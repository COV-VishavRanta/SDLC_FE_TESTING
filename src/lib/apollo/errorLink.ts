'use client';

import { LoginRedirectReason, PUBLIC_ROOT_ROUTE } from '@/constant';
import { LogoutResponse } from '@/graphql';
import { CombinedGraphQLErrors, Observable, ServerError } from '@apollo/client';
import { ErrorLink } from '@apollo/client/link/error';
import { toast } from 'sonner';

import {
  getApiMessage,
  getApiServerErrorMessage,
  getXssErrorMessage,
} from '../../i18n/apiMessageStore';
import { refreshAccessToken } from './clientRefreshToken';
import { XssDetectedError } from './sanitizeLink';

const BAD_REQUEST_STATUS = 400;
const UNAUTHORIZED_STATUS = 401;
const FORBIDDEN_STATUS = 403;
const NOT_FOUND_STATUS = 404;
const CONFLICT_STATUS = 409;
const UNPROCESSABLE_STATUS = 422;
const SERVER_ERROR_STATUS = 500;

/** Singleton: ensures only one token refresh is in-flight at a time. */
let refreshPromise: Promise<{ success: boolean; error?: string }> | null = null;

/**
 * Calls the Logout mutation directly via `fetch` to clear the server-side session.
 *
 * Direct fetch is intentional here to avoid a circular dependency with the Apollo
 * client instance. Errors are swallowed — even if logout fails, the browser should
 * still be redirected to the login page.
 */
async function callLogoutMutation(): Promise<void> {
  const GRAPHQL_ENDPOINT =
    process.env.NEXT_PUBLIC_GRAPHQL_API_URL ?? 'http://localhost:8000/graphql';

  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Required to send httpOnly auth cookies
      body: JSON.stringify({
        operationName: 'Logout',
        query: `
          mutation Logout {
            logout {
              statusCode
            }
          }
        `,
      }),
    });

    if (!response.ok) {
      console.error(`[Auth] Logout mutation failed — HTTP ${response.status}`);
      return;
    }

    const result: { data?: LogoutResponse } = await response.json();

    if (result.data?.logout.statusCode !== 200) {
      console.warn(
        '[Auth] Logout mutation returned unexpected status:',
        result.data?.logout.statusCode,
      );
    }
  } catch (error) {
    // Swallow — caller will still redirect to login regardless of outcome
    console.error('[Auth] Unexpected error during logout mutation:', error);
  }
}

/**
 * Deduplicates concurrent token refresh requests.
 *
 * Multiple in-flight GraphQL requests can fail simultaneously with 401s.
 * This ensures only ONE refresh call reaches the network; all callers
 * share the same in-flight promise and receive its result.
 */
async function getRefreshPromise(): Promise<{ success: boolean; error?: string }> {
  if (refreshPromise) {
    return refreshPromise; // Piggyback on the existing in-flight refresh
  }

  refreshPromise = refreshAccessToken();

  try {
    return await refreshPromise;
  } finally {
    // Always release the singleton so the next auth failure triggers a fresh refresh
    refreshPromise = null;
  }
}

/**
 * Returns `true` if the given Apollo error represents an authentication failure.
 *
 * Covers two scenarios:
 * - **GraphQL errors** with `UNAUTHENTICATED` / `FORBIDDEN` extension codes,
 *   or messages containing "unauthorized" / "401".
 * - **HTTP-level 401** responses wrapped in a `ServerError`.
 */
function isAuthError(error: unknown): boolean {
  if (CombinedGraphQLErrors.is(error)) {
    return error.errors.some(
      (err) =>
        err.extensions?.code === 'UNAUTHENTICATED' ||
        err.extensions?.code === 'FORBIDDEN' ||
        err.message?.toLowerCase()?.includes('unauthorized') ||
        err.message?.includes('401'),
    );
  }

  if (ServerError.is(error)) {
    return error.statusCode === UNAUTHORIZED_STATUS;
  }

  return false;
}

/**
 * Redirects the browser to the login page with a descriptive reason code.
 *
 * @param reason - Appended as `?reason=<reason>` to aid login-page messaging.
 */
function redirectToLogin(reason: string): void {
  window.location.href = `${PUBLIC_ROOT_ROUTE}?reason=${reason}`;
}

/**
 * Apollo Error Link — global handler for authentication errors and server faults.
 *
 * Intercepts every GraphQL response and applies the following logic:
 *
 * **Non-auth server errors (404 / 500)**
 * Shows a user-facing toast notification with an appropriate message.
 *
 * **Authentication errors (401 / UNAUTHENTICATED / FORBIDDEN)**
 * 1. Triggers a deduplicated token refresh via `getRefreshPromise()`.
 * 2. On success — retries the original GraphQL operation transparently.
 * 3. On failure — calls the Logout mutation to invalidate the server session,
 *    then redirects to the login page with a reason code:
 *    - `session_expired` — refresh token was expired.
 *    - `authentication_failed` — any other refresh failure.
 *
 * Auth handling is skipped entirely during SSR (no browser APIs available).
 *
 * @see https://www.apollographql.com/docs/react/data/error-handling
 */
export const errorLink = new ErrorLink(({ error, operation, forward }) => {
  if (error instanceof XssDetectedError) {
    toast.error(getXssErrorMessage());
    return;
  }

  // Handle USER_INACTIVE: the backend returns 403 with message "USER_INACTIVE"
  // when a logged-in user's account is deactivated. Logout and redirect immediately.
  if (error instanceof ServerError && error.statusCode === FORBIDDEN_STATUS) {
    try {
      const body = JSON.parse(error.bodyText) as Record<string, unknown>;
      const errors = body?.errors as { message?: string; code?: string } | undefined;

      if (errors?.message === 'USER_INACTIVE' && typeof window !== 'undefined') {
        callLogoutMutation()
          .then(() => {
            redirectToLogin(LoginRedirectReason.INV_USER_INACTIVE);
          })
          .catch(() => {
            redirectToLogin(LoginRedirectReason.INV_USER_INACTIVE);
          });
        return;
      }
    } catch {
      // Fall through to generic error handling below
    }
  }

  // Handle non-auth server errors with user-facing notifications
  if (error instanceof ServerError) {
    if (
      error.statusCode === NOT_FOUND_STATUS ||
      error.statusCode === UNPROCESSABLE_STATUS ||
      error.statusCode === FORBIDDEN_STATUS ||
      error.statusCode === CONFLICT_STATUS
    ) {
      try {
        const body = JSON.parse(error.bodyText) as Record<string, unknown>;
        const errors = body?.errors as { message?: string; code?: string } | undefined;

        const errorCode = errors?.message;

        toast.error(getApiMessage(errorCode));
      } catch {
        toast.error(getApiMessage());
      }
    } else if (
      error.statusCode === SERVER_ERROR_STATUS ||
      error.statusCode === BAD_REQUEST_STATUS
    ) {
      toast.error(getApiServerErrorMessage());
    }
  }

  if (!isAuthError(error)) {
    return; // Not an auth error — pass through to the next error handler
  }

  // Auth error recovery requires browser APIs (cookies, navigation)
  if (typeof window === 'undefined') {
    return;
  }

  return new Observable((observer) => {
    getRefreshPromise()
      .then((result) => {
        if (result.success) {
          // Token refreshed successfully — replay the original operation
          forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer),
          });
          return;
        }

        // Refresh failed — invalidate server session then redirect
        const reason =
          result.error === 'refresh_token_expired'
            ? LoginRedirectReason.SESSION_EXPIRED
            : LoginRedirectReason.AUTHENTICATION_FAILED;

        return callLogoutMutation()
          .then(() => {
            redirectToLogin(reason);
          })
          .catch((logoutError: Error) => {
            console.error('[Auth] Logout call failed during session cleanup:', logoutError);
            // Redirect regardless — local session state is now invalid
            redirectToLogin(LoginRedirectReason.AUTHENTICATION_FAILED);
          });
      })
      .catch((refreshError: Error) => {
        console.error('[Auth] Token refresh failed unexpectedly:', refreshError);
        observer.error(refreshError);
      });
  });
});
