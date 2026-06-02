/**
 * Internationalization configuration
 * Defines supported locales, default locale, and locale display names
 */

export const locales = ['en', 'es', 'fr'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
};

export const localeShortNames: Record<Locale, string> = {
  en: 'EN',
  es: 'ES',
  fr: 'FR',
};

/**
 * Default time zone for consistent date/time formatting
 * Uses IANA tz database format — shared between server and client
 */
export const DEFAULT_TIME_ZONE = 'America/New_York';

/**
 * Locale cookie name for storing user's preferred locale
 */
export const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';
