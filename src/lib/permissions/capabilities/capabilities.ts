/**
 * Generic capabilities utility.
 *
 * Intentionally free of React and browser APIs so it can be safely
 * imported by Edge middleware, Node.js servers, and browser bundles —
 * same contract as `hasPermission` and `getRequiredPermission`.
 */
import { type UserRole } from '@/constant/enums/user.enums';

/**
 * A partial map from UserRole to a feature-specific capabilities object.
 * Only roles with non-default capabilities need an entry.
 */
export type CapabilitiesMap<T> = Partial<Record<UserRole, T>>;

/**
 * Returns the capabilities object for the given role.
 * Falls back to `defaults` for unknown roles or roles not present in the map.
 *
 * Pure function — safe for Edge, Node, and Browser contexts.
 *
 * @example
 * const caps = getCapabilities(role, CAMPAIGN_CAPABILITIES_MAP, DEFAULT_CAMPAIGN_CAPABILITIES);
 */
export function getCapabilities<T>(role: string, map: CapabilitiesMap<T>, defaults: T): T {
  return (map[role as UserRole] as T | undefined) ?? defaults;
}
