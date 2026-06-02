'use client';

import { fetchAuthSession } from 'aws-amplify/auth';

import type { RefreshTokenResponse } from '@/graphql';

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_API_URL ?? 'http://localhost:8000/graphql';

const SUCCESS_STATUS = 200;

/**
 * Send new access token to FastAPI backend directly from the browser.
 *
 * Because this runs in the browser (not a Server Action), the browser
 * automatically:
 * - Sends existing httpOnly cookies via `credentials: 'include'`
 * - Receives and stores Set-Cookie headers from FastAPI's response
 *
 * No manual cookie parsing or forwarding needed.
 *
 * @param accessToken - New access token from Cognito
 * @param idToken - New ID token from Cognito
 */
async function updateBackendAccessToken(
  accessToken: string,
  idToken: string,
): Promise<{ success: boolean; error?: string }> {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Browser sends & receives httpOnly cookies automatically
    body: JSON.stringify({
      operationName: 'RefreshToken',
      query: `mutation RefreshToken($input: TokensRequest!) {
        refreshToken(input: $input) {
          statusCode
        }
      }`,
      variables: {
        input: { accessToken, idToken },
      },
    }),
  });

  if (!response.ok) {
    return { success: false, error: 'backend_refresh_failed' };
  }

  const body = (await response.json()) as {
    data?: RefreshTokenResponse;
    errors?: unknown[];
  };

  if (body?.data?.refreshToken?.statusCode !== SUCCESS_STATUS) {
    return { success: false, error: 'backend_refresh_failed' };
  }

  return { success: true };
}

/**
 * Client-side token refresh handler
 *
 * Flow:
 * 1. Call Amplify's fetchAuthSession with forceRefresh (browser-only)
 * 2. Amplify uses RT from browser storage to get new AT from Cognito
 * 3. Call FastAPI RefreshToken mutation directly from browser
 * 4. Browser automatically receives updated httpOnly cookies from FastAPI
 *
 * @returns {Promise<{ success: boolean; error?: string }>}
 */
export async function refreshAccessToken(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    // Step 1: Force refresh Amplify session (uses RT from local storage)
    const session = await fetchAuthSession({ forceRefresh: true });

    // Step 2: Extract new tokens
    const newAccessToken = session.tokens?.accessToken?.toString();

    const newIdToken = session.tokens?.idToken?.toString();

    if (!newAccessToken || !newIdToken) {
      return { success: false, error: 'refresh_token_expired' };
    }

    // Step 3: Send new tokens to backend (browser handles cookies automatically)
    return await updateBackendAccessToken(newAccessToken, newIdToken);
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (
        error.name === 'NotAuthorizedException' ||
        error.message.includes('refresh token') ||
        error.message.includes('expired')
      ) {
        return { success: false, error: 'refresh_token_expired' };
      }
    }

    return { success: false, error: 'refresh_failed' };
  }
}
