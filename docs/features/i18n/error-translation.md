# Error & Validation Translation Pattern

## Overview

The `useConstantTranslation` hook provides a unified, type-safe pattern for translating validation errors, API errors, and success messages across the application with automatic pattern-based namespace detection.

## How It Works

### Automatic Pattern Recognition

The hook uses intelligent pattern detection to automatically route messages to the correct namespace:

| Pattern           | Example          | Detected Namespace | Use Case                |
| ----------------- | ---------------- | ------------------ | ----------------------- |
| Alphanumeric only | `required`       | Validation         | Form field validation   |
| Alphanumeric only | `minLength`      | Validation         | Zod schema errors       |
| With underscores  | `user_not_found` | Errors             | API/backend error codes |
| With underscores  | `network_error`  | Errors             | System errors           |
| Other strings     | `Custom message` | Pass-through       | Already translated text |

### Translation Structure

**Translation File (`public/locales/en/translation.json`):**

```json
{
  "auth": {
    "validation": {
      "required": "This field is required",
      "invalid": "Invalid format",
      "minLength": "Must be at least {min} characters",
      "maxLength": "Cannot exceed {max} characters"
    },
    "errors": {
      "invalid_credentials": "Incorrect email or password",
      "network_error": "Network connection error",
      "too_many_attempts": "Too many attempts. Please try again later."
    },
    "success": {
      "login_successful": "Login successful!",
      "password_reset": "Password reset email sent"
    }
  }
}
```

## Hook API

### Configuration

```typescript
type ConstantTranslationConfig<VKeys extends readonly string[]> = {
  validationNamespace?: string; // Namespace for validation messages
  errorNamespace?: string; // Namespace for error messages
  successNamespace?: string; // Namespace for success messages
  validationKeys?: VKeys; // Array of validation keys for type safety
};
```

**At least one namespace must be provided.**

### Return Value

```typescript
{
  translateError: (message?: string) => string | undefined;
  translateSuccess: (message?: string) => string | undefined;
  tValidation: TranslationFunction; // Direct validation translator
  tErrors: TranslationFunction; // Direct error translator
}
```

---

## Usage Examples

### Example 1: Auth Form with Validation

```tsx
'use client';

import { useConstantTranslation } from '@/hooks';
import { useForm } from 'react-hook-form';
import { AuthErrorCode } from '@/constant';

function LoginForm() {
  const { translateError, translateSuccess } = useConstantTranslation({
    validationNamespace: 'auth.validation',
    errorNamespace: 'auth.errors',
    successNamespace: 'auth.success',
    validationKeys: ['required', 'invalid', 'minLength'] as const,
  });

  const {
    formState: { errors },
  } = useForm();

  return (
    <div>
      {/* Validation error from Zod (alphanumeric) */}
      {errors.email?.message && <p>{translateError(errors.email.message)}</p>}

      {/* API error (snake_case) */}
      <p>{translateError(AuthErrorCode.INVALID_CREDENTIALS)}</p>

      {/* Success message */}
      <p>{translateSuccess('login_successful')}</p>
    </div>
  );
}
```

### Example 2: Profile Form with Error Enum

**Define error codes:**

```typescript
// src/constant/enums/profile-error.enum.ts
export enum ProfileErrorCode {
  INVALID_PHONE = 'invalid_phone',
  EMAIL_TAKEN = 'email_taken',
  UPDATE_FAILED = 'update_failed',
}
```

**Use in component:**

```tsx
'use client';

import { useConstantTranslation } from '@/hooks';
import { ProfileErrorCode } from '@/constant';

function ProfileForm() {
  const { translateError, tValidation } = useConstantTranslation({
    validationNamespace: 'profile.validation',
    errorNamespace: 'profile.errors',
  });

  // Automatic pattern detection
  translateError('required'); // → "This field is required" (validation)
  translateError(ProfileErrorCode.EMAIL_TAKEN); // → "This email is already in use" (error)
  translateError('Custom message'); // → "Custom message" (pass-through)

  // Direct namespace access
  tValidation('minLength'); // Direct validation translation

  return <form>...</form>;
}
```

### Example 3: Type-Safe Validation Keys

```tsx
'use client';

import { useConstantTranslation } from '@/hooks';

function RegistrationForm() {
  const { tValidation } = useConstantTranslation({
    validationNamespace: 'auth.validation',
    validationKeys: ['required', 'invalid', 'minLength', 'maxLength'] as const,
  });

  // TypeScript ensures only defined keys are used
  const requiredMsg = tValidation('required'); // ✅ Valid
  // const unknownMsg = tValidation('unknown'); // ❌ TypeScript error

  return <form>...</form>;
}
```

### Example 4: Multiple Namespaces

```tsx
'use client';

import { useConstantTranslation } from '@/hooks';

function SettingsPanel() {
  const { translateError, translateSuccess, tErrors } = useConstantTranslation({
    validationNamespace: 'settings.validation',
    errorNamespace: 'settings.errors',
    successNamespace: 'settings.success',
  });

  const handleSave = async () => {
    try {
      // ... save logic
      toast.success(translateSuccess('settings_saved'));
    } catch (error) {
      if (error.code === 'permission_denied') {
        toast.error(tErrors('permission_denied'));
      } else {
        toast.error(translateError(error.message));
      }
    }
  };

  return <button onClick={handleSave}>Save</button>;
}
```

## Pattern Recognition Algorithm

The `translateError` function uses this logic:

```typescript
function translateError(message?: string): string | undefined {
  if (!message) return message;

  // 1. Check if it's a known validation key (type-safe)
  if (validationKeys && isValidationKey(message)) {
    return tValidation(message);
  }

  // 2. Try error namespace (catches all other patterns)
  if (tErrors) {
    try {
      return tErrors(message);
    } catch {
      return message; // Fallback: return original
    }
  }

  return message;
}
```

**Detection Flow:**

1. **Empty/undefined** → Return as-is
2. **In `validationKeys` array** → Use validation namespace
3. **Translation exists in error namespace** → Use error namespace
4. **No translation found** → Return original message (pass-through)

## Best Practices

### 1. **Use Error Enums for Type Safety**

Define error codes as enums:

```typescript
// src/constant/enums/auth-error.enum.ts
export enum AuthErrorCode {
  USER_NOT_FOUND = 'user_not_found',
  INVALID_CREDENTIALS = 'invalid_credentials',
  TOO_MANY_ATTEMPTS = 'too_many_attempts',
}
```

Export from barrel:

```typescript
// src/constant/index.ts
export * from './enums/auth-error.enum';
```

### 2. **Consistent Naming Conventions**

| Type       | Pattern            | Example                 |
| ---------- | ------------------ | ----------------------- |
| Validation | `camelCase`        | `required`, `minLength` |
| Errors     | `snake_case`       | `user_not_found`        |
| Success    | `snake_case`       | `login_successful`      |
| Namespaces | `feature.category` | `auth.validation`       |

### 3. **Namespace Organization**

**Recommended structure:**

```
{feature}.validation  // Form validation errors
{feature}.errors      // API/system errors
{feature}.success     // Success messages
```

**Example:**

```json
{
  "auth": {
    "validation": { "required": "...", "invalid": "..." },
    "errors": { "network_error": "..." },
    "success": { "login_successful": "..." }
  },
  "profile": {
    "validation": { "required": "...", "minLength": "..." },
    "errors": { "update_failed": "...", "email_taken": "..." },
    "success": { "profile_updated": "..." }
  }
}
```

### 4. **Backend API Integration**

**❌ Bad - Hardcoded messages:**

```json
{
  "error": "User not found"
}
```

**✅ Good - Error codes:**

```json
{
  "error": "user_not_found"
}
```

Backend should return error codes, frontend translates them.

### 5. **Zod Schema Integration**

Use short validation keys in Zod schemas:

```typescript
import { z } from 'zod';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'required') // Alphanumeric → validation namespace
    .email('invalid'), // Alphanumeric → validation namespace
  password: z.string().min(1, 'required').min(8, 'minLength'), // Will be translated with interpolation
});
```

### 6. **Type-Safe Validation Keys**

Define validation keys for autocomplete and type checking:

```typescript
const { translateError, tValidation } = useConstantTranslation({
  validationNamespace: 'auth.validation',
  validationKeys: ['required', 'invalid', 'minLength', 'maxLength'] as const,
});

// TypeScript will enforce only these keys can be used with tValidation
```

### 7. **Handle Missing Translations Gracefully**

The hook returns the original message if no translation is found:

```typescript
translateError('unknown_error'); // Returns "unknown_error" if not in translation file
translateError('Custom error'); // Returns "Custom error" (pass-through)
```

### 8. **Use Direct Translators When Needed**

```typescript
const { tValidation, tErrors } = useConstantTranslation({
  validationNamespace: 'auth.validation',
  errorNamespace: 'auth.errors',
});

// When you know the exact namespace
tValidation('required'); // Direct access, no pattern detection
tErrors('user_not_found'); // Direct access, no pattern detection
```

## Migration Guide

### Before: Hardcoded Messages

```tsx
function LoginForm() {
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      await login();
    } catch (err) {
      if (err.code === 'USER_NOT_FOUND') {
        setError('User not found');
      } else if (err.code === 'INVALID_CREDENTIALS') {
        setError('Invalid email or password');
      } else {
        setError('An error occurred');
      }
    }
  };

  return <p>{error}</p>;
}
```

### After: With `useConstantTranslation`

```tsx
'use client';

import { useConstantTranslation } from '@/hooks';
import { AuthErrorCode } from '@/constant';

function LoginForm() {
  const [error, setError] = useState<string>();

  const { translateError } = useConstantTranslation({
    validationNamespace: 'auth.validation',
    errorNamespace: 'auth.errors',
  });

  const handleSubmit = async () => {
    try {
      await login();
    } catch (err) {
      // Just set the error code - translation happens automatically
      setError(err.code);
    }
  };

  return <p>{translateError(error)}</p>;
}
```

### Benefits of Migration

- ✅ **Multi-language support**: Automatic translation to user's locale
- ✅ **Type safety**: Error codes defined as enums
- ✅ **Maintainability**: Messages centralized in translation files
- ✅ **Consistency**: Same error codes across frontend and backend
- ✅ **Flexibility**: Easy to update messages without code changes

## Complete Example: Auth Flow

**1. Define error enum:**

```typescript
// src/constant/enums/auth-error.enum.ts
export enum AuthErrorCode {
  INVALID_CREDENTIALS = 'invalid_credentials',
  USER_NOT_FOUND = 'user_not_found',
  TOO_MANY_ATTEMPTS = 'too_many_attempts',
  NETWORK_ERROR = 'network_error',
}
```

**2. Add translations:**

```json
// public/locales/en/translation.json
{
  "auth": {
    "validation": {
      "required": "This field is required",
      "invalid": "Invalid format",
      "minLength": "Must be at least 8 characters"
    },
    "errors": {
      "invalid_credentials": "Incorrect email or password",
      "too_many_attempts": "Too many failed attempts. Please try again later.",
      "network_error": "Network connection error. Please check your internet."
    },
    "success": {
      "login_successful": "Welcome back!",
      "password_reset_sent": "Password reset instructions sent to your email"
    }
  }
}
```

**3. Use in component:**

```tsx
'use client';

import { useConstantTranslation } from '@/hooks';
import { AuthErrorCode } from '@/constant';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().min(1, 'required').email('invalid'),
  password: z.string().min(1, 'required').min(8, 'minLength'),
});

function LoginForm() {
  const { translateError, translateSuccess } = useConstantTranslation({
    validationNamespace: 'auth.validation',
    errorNamespace: 'auth.errors',
    successNamespace: 'auth.success',
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const [apiError, setApiError] = useState<string>();
  const [success, setSuccess] = useState(false);

  const onSubmit = async (data) => {
    try {
      await login(data);
      setSuccess(true);
      setApiError(undefined);
    } catch (error) {
      setApiError(error.code || AuthErrorCode.NETWORK_ERROR);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{translateError(errors.email.message)}</span>}

      <input {...register('password')} type='password' />
      {errors.password && <span>{translateError(errors.password.message)}</span>}

      {apiError && <div className='error'>{translateError(apiError)}</div>}
      {success && <div className='success'>{translateSuccess('login_successful')}</div>}

      <button type='submit'>Login</button>
    </form>
  );
}
```

---

## File Structure

```
src/
├── constant/
│   ├── index.ts                     # Barrel exports
│   └── enums/
│       └── auth-error.enum.ts       # Error code enums
├── hooks/
│   ├── index.ts                     # Barrel exports
│   └── useConstantTranslation.ts    # Translation hook
└── public/
    └── locales/
        ├── en/
        │   └── translation.json     # English translations
        ├── es/
        │   └── translation.json     # Spanish translations
        └── fr/
            └── translation.json     # French translations
```
