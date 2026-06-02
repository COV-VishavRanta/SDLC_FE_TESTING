/**
 * Type definitions for next-intl translation messages
 *
 * This file enables type-safe translations by declaring the shape of our translation messages.
 * TypeScript will now autocomplete translation keys and show errors for invalid keys.
 *
 * Source: https://next-intl.dev/docs/workflows/typescript
 *
 * @example
 * ```tsx
 * const t = useTranslations('auth.layout.loginForm');
 * t('title') // ✅ Valid - TypeScript knows this key exists
 * t('invalidKey') // ❌ Type error - key doesn't exist
 * ```
 */

import messages from '../../public/locales/en/translation.json';

declare module 'next-intl' {
  interface AppConfig {
    Messages: typeof messages;
  }
}
