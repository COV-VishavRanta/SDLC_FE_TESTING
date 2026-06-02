'use client';

import { PROTECTED_ROOT_ROUTE } from '@/constant';
import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';

interface CapabilitiesGuardProps {
  /** Redirect when false. Compute this from `useCapabilities()`. */
  allowed: boolean;
  /** Fallback route on denial. Defaults to the protected root (dashboard). */
  fallbackRoute?: string;
  children: ReactNode;
}

/**
 * Generic guard component that redirects when `allowed` is false.
 *
 * Pair with `useCapabilities()` to block sub-page access for restricted roles.
 *
 * @example
 * const { canAccessSubPages } = useCapabilities(CAMPAIGN_CAPABILITIES_MAP, DEFAULT_CAPS);
 * <CapabilitiesGuard allowed={canAccessSubPages} fallbackRoute={ProtectedRoute.CAMPAIGN_MANAGEMENT}>
 *   <ImportPromotionsContent />
 * </CapabilitiesGuard>
 */
export function CapabilitiesGuard({
  allowed,
  fallbackRoute = PROTECTED_ROOT_ROUTE,
  children,
}: CapabilitiesGuardProps) {
  const router = useRouter();

  useEffect(() => {
    if (!allowed) {
      router.replace(fallbackRoute);
    }
  }, [allowed, fallbackRoute, router]);

  if (!allowed) return null;
  return <>{children}</>;
}
