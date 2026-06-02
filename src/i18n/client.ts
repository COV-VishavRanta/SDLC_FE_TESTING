/**
 * Client-side i18n utilities
 * Handles dynamic loading of translation messages
 */

import type { Locale } from './config';

/**
 * Dynamically loads translation messages for a given locale
 */
export async function loadMessages(locale: Locale): Promise<Record<string, string>> {
  try {
    const response = await fetch(`/locales/${locale}/translation.json`);

    if (!response.ok) {
      throw new Error(`Failed to load messages for locale: ${locale}`);
    }

    return (await response.json()) as Record<string, string>;
  } catch (error) {
     
    console.error(`Error loading messages for locale ${locale}:`, error);
    // Return empty object as fallback
    return {};
  }
}
