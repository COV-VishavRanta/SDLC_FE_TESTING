import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

import {
  AUTH_ROUTES,
  IMPERSONATION_COOKIE_NAME,
  IS_IMPERSONATING_COOKIE_NAME,
  PROTECTED_ROOT_ROUTE,
  PROTECTED_ROUTES,
  PUBLIC_ROOT_ROUTE,
  PUBLIC_ROUTES,
  USER_ROLE_COOKIE_NAME,
} from './constant';
import { getRequiredPermission, hasPermission } from './lib/permissions/route.permissions';

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_API_URL ?? 'http://localhost:8000/graphql';

/**
 * Proxy function for authentication routing
 *
 * This function runs before requests are completed and handles:
 * - Redirecting unauthenticated users from protected routes to login
 * - Redirecting authenticated users from auth routes to dashboard
 * - Allowing access to public routes for all users
 * - Handling the `/logout` signal to call Logout mutation, clear cookies, and redirect to login (preserves query params)
 * - Handling the `/refresh-session` signal to refresh tokens and set cookies
 *
 * Authentication is determined by the presence of an access token
 * in cookies, which is set by the backend.
 */
export default async function proxy(req: NextRequest) {
  // Get the current path
  const path = req.nextUrl.pathname;

  if (path === '/logout') {
    // Call backend Logout mutation to clear server-side session
    const allCookies = req.cookies.getAll();
    const cookieHeader = allCookies.map((c) => `${c.name}=${c.value}`).join('; ');

    // Preserve query parameters (e.g., ?reason=session_expired) for login page
    const loginUrl = new URL(PUBLIC_ROOT_ROUTE, req.url);
    const reason = req.nextUrl.searchParams.get('reason');
    if (reason) {
      loginUrl.searchParams.set('reason', reason);
    }

    const response = NextResponse.redirect(loginUrl);

    try {
      await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookieHeader,
        },
        body: JSON.stringify({
          operationName: 'Logout',
          query: `mutation Logout {
            logout {
              statusCode
            }
          }`,
        }),
      });
    } catch (error) {
      // Log but don't block logout — user should still be redirected
      // clear access token cookie, even if backend logout fails
      response.cookies.delete('access_token');
      console.error('[Logout] Backend logout mutation failed:', error);
    }

    // Middleware CAN delete cookies!
    response.cookies.delete('access_token');
    response.cookies.delete(IMPERSONATION_COOKIE_NAME);
    response.cookies.delete(IS_IMPERSONATING_COOKIE_NAME);

    // Clear Cognito cookies too
    allCookies.forEach((c) => {
      if (c.name.includes('CognitoIdentityServiceProvider')) {
        response.cookies.delete(c.name);
      }
    });

    return response;
  }

  // Check route type
  const isProtectedRoute = PROTECTED_ROUTES.some((route) => path.startsWith(route.href));
  const isAuthRoute = AUTH_ROUTES.some((route) => path.startsWith(route.href));
  const isPublicRoute = PUBLIC_ROUTES.some((route) => path === route.href);

  // Get the access token from cookies (set by backend)
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value ?? process.env.TEST_TOKEN; // For local testing without backend, use TEST_TOKEN from .env

  // Check if user is authenticated
  const isAuthenticated = Boolean(accessToken);
  // const isAuthenticated = true;

  // Redirect root path based on authentication status
  if (path === '/') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL(PROTECTED_ROOT_ROUTE, req.url));
    } else {
      return NextResponse.redirect(new URL(PUBLIC_ROOT_ROUTE, req.url));
    }
  }

  // Redirect unauthenticated users from protected routes to login
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL(PUBLIC_ROOT_ROUTE, req.url);
    // Preserve the original URL as a redirect parameter
    loginUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(loginUrl);
  }

  // Enforce role-based access control on protected routes
  if (isProtectedRoute && isAuthenticated) {
    const requiredPermission = getRequiredPermission(path);
    if (requiredPermission !== null) {
      const userRole = req.cookies.get(USER_ROLE_COOKIE_NAME)?.value ?? '';
      if (!hasPermission(userRole, requiredPermission)) {
        return NextResponse.redirect(new URL(PROTECTED_ROOT_ROUTE, req.url));
      }
    }
  }

  // Redirect authenticated users from auth routes to dashboard
  if (isAuthRoute && isAuthenticated) {
    // Check if there's a redirect parameter from login
    const redirectUrl = req.nextUrl.searchParams.get('redirect');
    if (redirectUrl && PROTECTED_ROUTES.some((route) => redirectUrl.startsWith(route.href))) {
      return NextResponse.redirect(new URL(redirectUrl, req.url));
    }

    return NextResponse.redirect(new URL(PROTECTED_ROOT_ROUTE, req.url));
  }

  // Allow access to public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // For all other routes, allow the request to proceed
  return NextResponse.next();
}
