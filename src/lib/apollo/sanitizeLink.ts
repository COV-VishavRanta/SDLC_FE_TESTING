import { ApolloLink, Observable } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';

/**
 * Thrown when a mutation variable contains a potential XSS payload.
 * Exported so the errorLink can identify it and show a user-facing toast.
 */
export class XssDetectedError extends Error {
  override readonly name = 'XssDetectedError';

  constructor() {
    super('Potentially dangerous input detected. Please remove HTML or script content.');
  }
}

/** Patterns that indicate a potential XSS payload. */
const XSS_PATTERNS: RegExp[] = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/i,
  /javascript\s*:/i,
  /data\s*:\s*text\/html/i,
  /\bon\w+\s*=/i,
  /<[^>]+>/,
];

/**
 * Returns true if the string contains any known XSS vector.
 */
function containsXss(value: string): boolean {
  return XSS_PATTERNS.some((pattern) => pattern.test(value));
}

/**
 * Recursively checks all string values in an object, array, or primitive.
 * Throws if any string contains a potential XSS payload.
 */
function assertNoXss(value: unknown): void {
  if (typeof value === 'string') {
    if (containsXss(value)) {
      throw new XssDetectedError();
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach(assertNoXss);
    return;
  }

  if (value !== null && typeof value === 'object') {
    Object.values(value as Record<string, unknown>).forEach(assertNoXss);
  }
}

/**
 * Apollo Link that blocks any **mutation** whose variables contain a potential
 * XSS payload (script tags, javascript: URIs, inline event handlers, etc.).
 *
 * Instead of silently stripping the content, this link rejects the operation
 * with an error so the caller is explicitly informed and the malicious input
 * never reaches the backend.
 * with an error so the caller is explicitly informed and the request is blocked
 * before it is sent through this client-side Apollo link chain. This is a
 * client-side guard only and does not prevent direct API calls outside Apollo.
 *
 * Place this link early in the chain (before errorLink and httpLink).
 * Place this link after `errorLink` but before `httpLink`. If `sanitizeLink`
 * runs before `errorLink`, it short-circuits the chain and `errorLink` will
 * not see `XssDetectedError`.
 */
export const sanitizeLink = new ApolloLink((operation, forward) => {
  const definition = getMainDefinition(operation.query);

  if (definition.kind === 'OperationDefinition' && definition.operation === 'mutation') {
    try {
      assertNoXss(operation.variables);
    } catch (error) {
      return new Observable((subscriber) => {
        subscriber.error(error);
      });
    }
  }

  return forward(operation);
});
