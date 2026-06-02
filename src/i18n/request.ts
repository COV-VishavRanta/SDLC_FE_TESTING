/**
 * Request-scoped i18n configuration for Server Components
 * This file is required for next-intl to work with Server Components
 *
 * Source: https://next-intl.dev/docs/getting-started/app-router
 */

import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

import {
  DEFAULT_TIME_ZONE,
  defaultLocale,
  LOCALE_COOKIE_NAME,
  locales,
  type Locale,
} from './config';

const messageLoaders = {
  en: () => import('../../public/locales/en/translation.json'),
  fr: () => import('../../public/locales/fr/translation.json'),
  es: () => import('../../public/locales/es/translation.json'),
};

export default getRequestConfig(async () => {
  // Read user's preferred locale from cookie
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get(LOCALE_COOKIE_NAME)?.value;

  // Validate and use locale from cookie, fallback to default
  const locale = (
    locales.includes(localeCookie as Locale) ? localeCookie : defaultLocale
  ) as Locale;

  // Dynamically import messages based on locale and via safe mapping
  const messages = (await messageLoaders[locale]()).default;

  return {
    locale,
    messages,
    timeZone: DEFAULT_TIME_ZONE,
  };
});
