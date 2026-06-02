'use client';

/**
 * IntlProvider Component
 * Wraps the application with NextIntlClientProvider and manages locale state
 */

import { NextIntlClientProvider } from 'next-intl';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useState, useTransition } from 'react';

import { setApiMessages } from './apiMessageStore';
import { loadMessages } from './client';
import { DEFAULT_TIME_ZONE, defaultLocale, LOCALE_COOKIE_NAME, type Locale } from './config';

/**
 * Context for locale state management
 */

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  isPending: boolean;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

/**
 * Hook to access and change the current locale
 */
export function useLocaleContext() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocaleContext must be used within IntlProvider');
  }
  return context;
}

interface IntlProviderProps {
  children: React.ReactNode;
  initialMessages?: Record<string, string>;
  initialLocale?: Locale;
}

export function IntlProvider({
  children,
  initialMessages = {},
  initialLocale = defaultLocale,
}: IntlProviderProps) {
  const router = useRouter();
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [messages, setMessages] = useState<Record<string, string>>(() => {
    // Sync the module-level API message store on first render so the Apollo
    // errorLink can translate API codes before any locale switch occurs.
    setApiMessages(initialMessages);
    return initialMessages;
  });
  const [isPending, startTransition] = useTransition();

  // Update locale function
  const setLocale = (newLocale: Locale) => {
    // Set cookie first so server knows the preference immediately
    document.cookie = `${LOCALE_COOKIE_NAME}=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;

    startTransition(async () => {
      try {
        // Start both operations in parallel:
        // 1. Fetch client messages
        // 2. Give server refresh time to complete
        const [msgs] = await Promise.all([
          loadMessages(newLocale),
          // Trigger server refresh and add minimum delay for server to catch up
          new Promise<void>((resolve) => {
            router.refresh();
            // Small delay to allow server refresh to propagate
            setTimeout(resolve, 50);
          }),
        ]);

        // Update client state after both complete - synchronized update
        setMessages(msgs);
        setApiMessages(msgs);
        setLocaleState(newLocale);
      } catch (error: unknown) {
        console.error('Failed to switch locale:', error);
      }
    });
  };

  // Provide locale and setLocale to children via context
  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone={DEFAULT_TIME_ZONE}>
      <LocaleContext.Provider value={{ locale, setLocale, isPending }}>
        {children}
      </LocaleContext.Provider>
    </NextIntlClientProvider>
  );
}
