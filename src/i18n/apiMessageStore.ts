/**
 * Module-level store for API message translations.
 *
 * Populated by {@link IntlProvider} whenever locale/messages change.
 * Read synchronously by Apollo errorLink (and other non-React code) to
 * translate API error/success codes into locale-specific user-facing messages.
 *
 * This exists because the Apollo error link is not a React component and
 * cannot use hooks like `useTranslations()`.
 */

/** Shape of the nested messages object loaded from translation JSON files. */
interface NestedMessages {
  [key: string]: string | NestedMessages;
}

interface ApiMessages {
  fallback?: {
    genericError?: string;
    serverError?: string;
    xssDetected?: string;
  };
  errors?: Record<string, string>;
  success?: Record<string, string>;
}

/** Cached copy of the full translation messages — kept in sync by IntlProvider. */
let cachedMessages: NestedMessages = {};

/**
 * Replaces the cached messages.
 * Called by {@link IntlProvider} on mount and every locale switch.
 */
export function setApiMessages(messages: NestedMessages): void {
  cachedMessages = messages;
}

/**
 * Returns the translated fallback message for unknown/missing codes.
 */
function getApiFallbackMessage(): string {
  const api = cachedMessages?.apiMessages as ApiMessages | undefined;
  return api?.fallback?.genericError ?? 'Something went wrong. Please try again.';
}

/**
 * Returns the translated "server error" fallback (HTTP 500).
 */
export function getApiServerErrorMessage(): string {
  const api = cachedMessages?.apiMessages as ApiMessages | undefined;
  return (
    api?.fallback?.serverError ?? 'An unexpected server error occurred. Please try again later.'
  );
}

/**
 * Returns the translated message shown when an XSS payload is detected in
 * mutation variables.
 */
export function getXssErrorMessage(): string {
  const api = cachedMessages?.apiMessages as ApiMessages | undefined;
  return (
    api?.fallback?.xssDetected ??
    'Potentially dangerous input detected. Please remove HTML or script content.'
  );
}

/**
 * Resolves an API error/success code to a translated user-facing message.
 *
 * Lookup order:
 * 1. `apiMessages.errors.<code>`
 * 2. `apiMessages.success.<code>`
 * 3. Translated generic fallback (`apiMessages.fallback.genericError`)
 * 4. Hard-coded English fallback (safety net if messages aren't loaded yet)
 *
 * @param code - The message code returned by the API (e.g. `"PSP_DUPLICATE_NAME"`).
 *               If `undefined` or `null`, the generic fallback is returned.
 */
export function getApiMessage(code?: string | null): string {
  if (!code) {
    return getApiFallbackMessage();
  }

  const api = cachedMessages?.apiMessages as ApiMessages | undefined;

  return api?.errors?.[code] ?? api?.success?.[code] ?? getApiFallbackMessage();
}
