/**
 * * Login Types
 */

import { UserType } from '@/types';

/**
 * Variables for the login mutation.
 */
export interface LoginVariables {
  input: TokensRequest;
}

/**
 * Request object containing authentication tokens from the identity provider.
 */
export interface TokensRequest {
  idToken: string;
  accessToken?: string;
}

/**
 * Response from the login mutation.
 */
export interface LoginResponse {
  login: LoginData;
}

/**
 * Login data returned from the authentication process.
 */
export interface LoginData {
  statusCode: number;
  authenticated: boolean;
  content: {
    ok: boolean;
    error?: string;
  };
  user: UserType;
}
/**
 * User information returned after successful authentication.
 */

/**
 *  * Logout Types
 */
/**
 * Response from the logout mutation.
 */
export interface LogoutResponse {
  logout: LogoutData;
}

/**
 * Logout data returned from the logout process.
 */
export interface LogoutData {
  statusCode: number;
  // authenticated: boolean;
  // content?: string;
}

/**
 * * Refresh Token Types
 */

/**
 * Variables for the refresh token mutation.
 */
export interface RefreshTokenVariables {
  input: RefreshTokensRequest;
}

/**
 * Request object containing authentication tokens from the identity provider.
 */
export interface RefreshTokensRequest {
  idToken: string;
  accessToken?: string;
}

export interface RefreshTokenResponse {
  refreshToken: {
    statusCode: number;
    // authenticated: boolean;
    // content?: string;
  };
}
