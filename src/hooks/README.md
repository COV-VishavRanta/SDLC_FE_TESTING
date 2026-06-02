# Hooks

This folder contains all the reusable custom hooks for the Pop Logic project.

## Structure

All hooks are exported from the `index.ts` file for centralized imports.

```tsx
// Example usage
import { useLocalStorage } from '@/hooks';
```

## Folder Structure

```
src/hooks/
├── index.ts              # Barrel export
├── useLocalStorage.ts    # Example: Local storage hook
└── {hookName}.ts         # Other hooks
```

## Guidelines

- Use the `use` prefix for all hook names (React convention)
- Use camelCase for hook names (e.g., , `useLocalStorage`)
- Each hook should be in its own file
- Export all hooks from the root `src/hooks/index.ts` file
- Include JSDoc comments describing the hook's purpose, parameters, and return value

## Available Hooks

### `useConstantTranslation`

Flexible hook for translating validation, error, and success messages using i18n namespaces and key lists. Supports custom validation keys and namespaces for validation, error, and success messages.

**Location:** `hooks/useConstantTranslation.ts`

**Usage:**

```tsx
import { useConstantTranslation } from '@/hooks';

const validationKeys = ['required', 'invalid_email', 'min_length'] as const;

function LoginForm() {
  const { translateError, tValidation, tErrors, translateSuccess } = useConstantTranslation({
    validationNamespace: 'auth.layout.loginForm.validation',
    errorNamespace: 'auth.layout.errors',
    successNamespace: 'auth.layout.success',
    validationKeys,
  });

  const error = translateError('required'); // → "Email is required"
  const apiError = translateError('email_not_found'); // → "No Email found..."
  const success = translateSuccess('login_success'); // → "Login successful!"
}
```

**Parameters:**

- `validationNamespace` (optional): Namespace for validation error translations
- `errorNamespace` (optional): Namespace for API/system error translations
- `successNamespace` (optional): Namespace for success message translations
- `validationKeys` (optional): Array of allowed validation keys (for type safety)

**Returns:**

- `translateError(message?: string)`: Translates validation keys (if listed) using `validationNamespace`, otherwise falls back to `errorNamespace` or returns the original string
- `tValidation(key: string)`: Direct access to validation translations
- `tErrors(code: string)`: Direct access to error translations
- `translateSuccess(message?: string)`: Translates success messages using `successNamespace`

**Translation Rules:**

- If `message` matches a key in `validationKeys`, uses `validationNamespace`
- Otherwise, tries `errorNamespace` (with fallback to original string)
- For success messages, uses `successNamespace` (with fallback)

---

### `useAuthErrorTranslation`

Convenience hook pre-configured for authentication forms. Uses `useErrorTranslation` with auth-specific namespaces.

**Usage:**

```tsx
import { useAuthErrorTranslation } from '@/hooks';

function LoginForm() {
  const { translateError, tErrors } = useAuthErrorTranslation();

  const error1 = translateError('required'); // → "Email is required"
  const error2 = translateError('user_not_found'); // → "No account found..."
}
```

**Equivalent to:**

```tsx
useErrorTranslation('auth.layout.loginForm.validation', 'auth.layout.errors');
```

---

## Adding a New Hook

1. Create a new file with the hook name: `{hookName}.ts`
2. Implement your hook following React hooks rules
3. Export the hook from the root `src/hooks/index.ts`
