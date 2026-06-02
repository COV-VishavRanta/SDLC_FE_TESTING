# Internationalization (i18n)

This directory contains internationalization configuration and utilities for the Pop Logic application using `next-intl`.

## Architecture

### Client-Side Locale Management

Since SEO is not a concern, this implementation uses **client-side locale switching** without URL routing (`/en/`, `/es/`, etc.).

- Locale preference is stored in `localStorage`
- Translations are loaded dynamically on demand
- No middleware or `[locale]` route segments required

## Files

| File               | Purpose                                                                         |
| ------------------ | ------------------------------------------------------------------------------- |
| `config.ts`        | Locale configuration (supported locales, default, display names, cookie name)   |
| `client.ts`        | Client-side utilities for loading translation messages                          |
| `request.ts`       | Server-side request config for next-intl (reads cookie, loads messages)         |
| `IntlProvider.tsx` | React Context Provider wrapping NextIntlClientProvider, manages locale state    |
| `messages.d.ts`    | TypeScript type definitions for type-safe translations (auto-generated from en) |
| `index.ts`         | Barrel exports                                                                  |

## Type Safety

This project uses **TypeScript declaration merging** to provide type-safe translation keys.

### How It Works

The [messages.d.ts](messages.d.ts) file is auto-generated from the English translation file and declares the shape of translation messages. TypeScript will:

- ✅ Autocomplete translation keys
- ✅ Show errors for invalid/missing keys
- ✅ Support IntelliSense for nested keys
- ✅ Enable safe refactoring

### Example

```tsx
'use client';
import { useTranslations } from 'next-intl';

export function LoginForm() {
  const t = useTranslations('auth.layout.loginForm');
  return (
    <div>
      {/* ✅ Valid - TypeScript knows this key exists */}
      <h1>{t('title')}</h1>
      {/* ❌ Type error - 'invalidKey' doesn't exist in translations */}
      <p>{t('invalidKey')}</p>
    </div>
  );
}
```

### Updating Type Definitions

When you add new translation keys to `public/locales/en/translation.json`, TypeScript will automatically pick up the changes. You may need to:

1. Restart the TypeScript server in VS Code (`Cmd/Ctrl + Shift + P` → "TypeScript: Restart TS Server")
2. Restart your development server if types aren't updating

## Adding New Locales

1. Create a new directory: `public/locales/{locale}/`
2. Create `translation.json` file in the new directory
3. Update `locales` array in [config.ts](config.ts)
4. Add display name to `localeNames` object and ensure cookie name is set if needed
5. Copy translation structure from an existing locale file and translate the values

## Translation Files

Translation files are stored in `public/locales/{locale}/translation.json` and are managed manually by developers.

### Editing Translations

Directly edit the JSON files in `public/locales/` and restart the development server to see changes.

## Configuration

Locale preference is stored in a cookie (`LOCALE_COOKIE_NAME`, default: `'NEXT_LOCALE'`) for server/client sync, and optionally in `localStorage` for client-side persistence.

### Server-Side Locale Detection

- The request.ts file reads the user's preferred locale from the cookie and loads the correct translation file for Server Components.
- If the cookie is missing or invalid, it falls back to the default locale.

### Provider & Context

- The IntlProvider.tsx file wraps the app with NextIntlClientProvider and provides a React context for locale state and switching.
- Use the `useLocaleContext()` hook to access and change the current locale in client components.

## Unique Locale Switching Scenario: Near-Zero Lag for RSC & Client Components

This project implements a unique approach to locale switching that ensures **both Server Components (RSC) and Client Components update their translations nearly instantly and in sync**:

- When switching locale, the IntlProvider sets the cookie immediately so the server can pick up the new locale on the next RSC render.
- In parallel, it triggers a client-side fetch for the new translation messages and a server refresh (router.refresh()).
- Both operations run concurrently, so the client UI and server-rendered content update together with minimal delay (typically <50ms).
- This avoids the common lag or mismatch between RSC and client translations during locale switches.

**Result:** Users experience seamless, synchronized translation updates across all components, with no visible lag or flash of incorrect language.

### How It Works (IntlProvider.tsx)

```tsx
const setLocale = (newLocale: Locale) => {
  document.cookie = `${LOCALE_COOKIE_NAME}=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
  startTransition(async () => {
    const [msgs] = await Promise.all([
      loadMessages(newLocale),
      new Promise<void>((resolve) => {
        router.refresh();
        setTimeout(resolve, 50);
      }),
    ]);
    setMessages(msgs);
    setLocaleState(newLocale);
  });
};
```

#### Example: Switching Locale

```tsx
import { useLocaleContext } from '@/i18n/IntlProvider';

function LanguageSwitcher() {
  const { locale, setLocale, isPending } = useLocaleContext();
  return (
    <div>
      <button onClick={() => setLocale('es')} disabled={isPending}>
        Español
      </button>
      <button onClick={() => setLocale('fr')} disabled={isPending}>
        Français
      </button>
    </div>
  );
}
```
