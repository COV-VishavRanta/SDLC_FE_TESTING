/**
 * Auth error codes for translation
 * These map to keys under 'auth.layout.errors' namespace
 */
export enum AuthErrorCode {
  // Login errors
  EMAIL_NOT_REGISTERED = 'email_not_registered',
  TOO_MANY_ATTEMPTS = 'too_many_attempts',
  UNEXPECTED_ERROR = 'unexpected_error',
  LOGIN_EXCHANGE_FAILED = 'login_exchange_failed',

  // Verification errors
  INVALID_CODE = 'invalid_code',
  CODE_EXPIRED = 'code_expired',
  VERIFICATION_FAILED = 'verification_failed',
  SESSION_RETRIEVAL_FAILED = 'session_retrieval_failed',

  // Resend errors
  RESEND_FAILED = 'resend_failed',
  RESEND_LIMIT_EXCEEDED = 'resend_limit_exceeded',

  // Sign out errors
  SIGNOUT_FAILED = 'signout_failed',

  // Token refresh errors
  REFRESH_TOKEN_EXPIRED = 'refresh_token_expired',
  BACKEND_REFRESH_FAILED = 'backend_refresh_failed',
  REFRESH_FAILED = 'refresh_failed',

  // Disabled user
  USER_DISABLED = 'user_disabled',

  // Client-side errors (not from API)
  INCOMPLETE_CODE = 'incomplete_code',
}

/**
 * Auth validation codes for translation
 * These map to keys under 'auth.layout.validation' namespace
 */

export enum AuthValidationCode {
  EMAIL_REQUIRED = 'email-required',
  EMAIL_INVALID = 'email-invalid',
}

/**
 * Login redirect reason codes appended to the URL by the backend.
 * These map to keys under 'auth.layout.loginForm.reasons' namespace.
 */
export enum LoginRedirectReason {
  SESSION_EXPIRED = 'session_expired',
  AUTHENTICATION_FAILED = 'authentication_failed',
  INV_TOKEN = 'INV_TOKEN',
  INV_TOKEN_INVALID = 'INV_TOKEN_INVALID',
  INV_TOKEN_EXPIRED = 'INV_TOKEN_EXPIRED',
  INV_USER_INACTIVE = 'INV_USER_INACTIVE',
  INV_USER_DELETED = 'INV_USER_DELETED',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  IDLE_TIMEOUT = 'idle_timeout',
}
