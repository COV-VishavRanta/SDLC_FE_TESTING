import {
  AUDIT_ACTION_KEYS,
  AUDIT_ENTITY_TYPE_KEYS,
  AuditActorTypeEnum,
  UserRole,
} from '@/constant';
import { AuditLogType } from '@/types/graphql.types';
import { Header } from '@tanstack/react-table';
import { clsx, type ClassValue } from 'clsx';
import { formatInTimeZone } from 'date-fns-tz';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to conditionally join Tailwind CSS class names.
 * Combines `clsx` for conditional classes and `tailwind-merge`
 * to intelligently merge conflicting Tailwind classes.
 *
 * @param inputs - List of class values (strings, arrays, objects, etc.)
 * @returns A merged className string
 *
 * @example
 * cn('p-2', 'text-sm', condition && 'bg-red-500')
 */

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns the ARIA sort attribute for a table header.
 *
 * @param header - The TanStack Table header object
 * @returns 'ascending' | 'descending' | 'none' | undefined
 */
export function getAriaSort<T>(header: Header<T, unknown>) {
  if (!header.column.getCanSort()) return undefined;
  const sort = header.column.getIsSorted();
  return sort === 'asc' ? 'ascending' : sort === 'desc' ? 'descending' : 'none';
}

/**
 * Extracts initials from an email address.
 *
 * If the email username contains a dot (e.g., john.doe@example.com),
 * it returns the first letter of each segment.
 * Otherwise, it returns the first two characters.
 *
 * @param email - The user's email address
 * @returns Uppercase initials string
 *
 * @example
 * getInitials('john.doe@example.com') // "JD"
 * getInitials('alex@example.com') // "AL"
 */

export function getInitials(email: string): string {
  const parts = email.split('@')[0].split('.');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

/**
 * Validates whether a given value can be converted to a valid Date.
 *
 * @param value - A date string or Date object
 * @returns True if valid date, otherwise false
 *
 * @example
 * isValidDate('2024-01-01') // true
 * isValidDate('invalid-date') // false
 */
export function isValidDate(value: string | Date): boolean {
  const date = new Date(value);
  return !isNaN(date.getTime());
}

/**
 * Formats a Date object into a readable timestamp string.
 * Format: YYYY-MM-DD HH:mm (24-hour format)
 *
 * Returns an em dash (—) if date is undefined.
 *
 * @param date - Optional Date object
 * @returns Formatted timestamp string
 *
 * @example
 * formatTimestamp(new Date()) // "2026-02-22 14:30"
 * formatTimestamp(undefined) // "—"
 */
export function formatTimestamp(date?: string | Date): string {
  if (!date) return '—';

  // Backend sends UTC timestamps without a timezone suffix — append 'Z' so
  // the Date constructor interprets them as UTC instead of local time.
  const utcDate =
    typeof date === 'string' && !/Z|[+-]\d{2}(:\d{2})?$/.test(date) ? `${date}Z` : date;

  return formatInTimeZone(
    utcDate,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    'yyyy-MM-dd HH:mm:ss',
  );
}

export function formatDateLocalized(dateStr?: string, locale?: string): string | null {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return null;
  return date.toLocaleDateString(locale ?? 'en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}

/**
 * Retrieves the key of a UserRole enum by its value.
 *
 * Searches through the UserRole enum to find the key that corresponds
 * to the given value.
 *
 * @param value - The UserRole enum value to search for
 * @returns The enum key if found, otherwise undefined
 *
 * @example
 * getUserRoleKey('Platform Admin') // "PLATFORM_ADMIN"
 * getUserRoleKey('UNKNOWN') // undefined
 */
export function getUserRoleKey(value: string): keyof typeof UserRole | undefined {
  return (Object.keys(UserRole) as (keyof typeof UserRole)[]).find(
    (key) => UserRole[key] === value,
  );
}

/**
 * Translates a UserRole display value into a localised label.
 *
 * Resolves the enum key for `roleValue` via `getUserRoleKey`, then
 * delegates to the provided translator function (e.g. from
 * `getTranslations('roles')` / `useTranslations('roles')`).
 * Falls back to the raw `roleValue` string if no matching enum key is found.
 *
 * @param roleValue - The role string stored in the USER_ROLE cookie (e.g. "Platform Admin")
 * @param t - A translation function scoped to the 'roles' namespace
 * @returns The translated role label, or `roleValue` if no key is matched
 *
 * @example
 * const tRoles = await getTranslations('roles');
 * getRoleLabel('Platform Admin', tRoles) // "Administrateur de Plateforme" (fr)
 * getRoleLabel('Unknown', tRoles)        // "Unknown" (fallback)
 */
export function getRoleLabel(roleValue: string, t: (key: keyof typeof UserRole) => string): string {
  if (!roleValue) return '—';

  const key = getUserRoleKey(roleValue);
  return key !== undefined ? t(key) : roleValue;
}

export function getAuditActionLabel(
  action: string | null | undefined,
  t: (key: string) => string,
): string {
  if (!action) return '—';
  return AUDIT_ACTION_KEYS.has(action) ? t(action) : action;
}

export function getAuditEntityTypeLabel(
  entityType: string | null | undefined,
  t: (key: string) => string,
): string {
  if (!entityType) return '—';
  return AUDIT_ENTITY_TYPE_KEYS.has(entityType) ? t(entityType) : entityType;
}

export function getAuditActorType(
  log: Pick<AuditLogType, 'isImpersonated' | 'isThirdParty'>,
): AuditActorTypeEnum {
  if (log.isImpersonated) return AuditActorTypeEnum.IMPERSONATED;
  if (log.isThirdParty) return AuditActorTypeEnum.WEBHOOK;
  return AuditActorTypeEnum.SELF;
}

// Helper to read a cookie
export const getCookie = (name: string) => {
  // skip for server-side rendering where document is not available
  if (typeof document === 'undefined') return undefined;
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
    ?.split('=')[1];
};
