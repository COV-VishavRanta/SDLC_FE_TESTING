'use client';

import { type CapabilitiesMap, getCapabilities } from '@/lib/permissions/route.permissions';

import { usePermissions } from './usePermissions';

/**
 * Generic capabilities hook.
 *
 * Each feature defines its own capabilities interface, role map, and defaults.
 * This single hook handles all features — no per-feature hooks needed.
 *
 * The returned object is a stable reference (module-level constant per role),
 * so it is safe to use in `useMemo` / `useEffect` dependency arrays.
 *
 * @example
 * const caps = useCapabilities(CAMPAIGN_CAPABILITIES_MAP, DEFAULT_CAMPAIGN_CAPABILITIES);
 * if (caps.canCreateCampaign) { ... }
 */
export function useCapabilities<T>(map: CapabilitiesMap<T>, defaults: T): T {
  const { role } = usePermissions();
  return getCapabilities(role, map, defaults);
}
