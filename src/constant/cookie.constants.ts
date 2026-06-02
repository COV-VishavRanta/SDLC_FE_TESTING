/**
 * Cookie name constants
 * Centralised names used when reading/writing cookies on both
 * the server (request.ts) and the client (document.cookie).
 */

/**
 * Cookie that stores the current user's active role name.
 * Written by GlobalProtectedProvider whenever GET_CURRENT_USER resolves
 * with a role that differs from the value already in the cookie.
 */
export const USER_ROLE_COOKIE_NAME = 'USER_ROLE';

/**
 * Cookie that stores the current user's selected PSP ID.
 * Written by GlobalProtectedProvider whenever GET_CURRENT_USER resolves
 * with a PSP ID that differs from the value already in the cookie.
 * Read server-side (next/headers) to hydrate pages without waiting for
 * the client-side `me` query — eliminates the PSP-ID waterfall on
 * PSP-admin routes.
 */
export const PSP_ID_COOKIE_NAME = 'PSP_ID';

/**
 * Cookie that stores the current user's selected Brand ID.
 * Written by GlobalProtectedProvider whenever GET_CURRENT_USER resolves
 * with a Brand ID that differs from the value already in the cookie.
 * Read server-side (next/headers) to hydrate pages without waiting for
 * the client-side `me` query — eliminates the Brand-ID waterfall on
 * Brand-admin routes.
 */
export const BRAND_ID_COOKIE_NAME = 'BRAND_ID';

/**
 * Cookie that stores the current user's selected Store ID.
 * Written by GlobalProtectedProvider whenever GET_CURRENT_USER resolves
 * with a Store ID that differs from the value already in the cookie.
 * Read server-side (next/headers) to hydrate pages without waiting for
 * the client-side `me` query — eliminates the Store-ID waterfall on
 * Store-admin routes.
 */
export const STORE_ID_COOKIE_NAME = 'STORE_ID';

/**
 * Cookie that stores whether the current session is impersonating another user.
 * Written by GlobalProtectedProvider when impersonation starts/stops and
 * synced when the GET_IMPERSONATION_STATUS query resolves.
 * Read server-side (next/headers) to hydrate the impersonation banner and
 * other server components without waiting for the client-side query.
 */
export const IS_IMPERSONATING_COOKIE_NAME = 'IS_IMPERSONATING';

/**
 * Cookie that stores the impersonation token.
 * Set by the backend as httpOnly (not accessible to JS) when an admin
 * starts impersonating another user. Referenced by name in proxy.ts
 * to ensure cleanup during logout.
 */
export const IMPERSONATION_COOKIE_NAME = 'impersonation_token';
