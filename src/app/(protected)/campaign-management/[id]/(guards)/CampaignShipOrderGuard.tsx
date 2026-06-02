'use client';

import { CapabilitiesGuard } from '@/components';
import { ProtectedRoute } from '@/constant';
import { useCapabilities } from '@/hooks';
import {
  CAMPAIGN_CAPABILITIES_MAP,
  DEFAULT_CAMPAIGN_CAPABILITIES,
} from '@/lib/permissions/route.permissions';
import type { ReactNode } from 'react';

interface CampaignShipOrderGuardProps {
  children: ReactNode;
}

/**
 * Blocks access to the ship-order page for roles without the `canShipOrders` capability.
 * Only PSP Admin has this capability. All other roles are redirected to the
 * Campaign Management listing page.
 *
 * Usage:
 * ```tsx
 * export default async function OrderShipmentPage() {
 *   return (
 *     <CampaignShipOrderGuard>
 *       <OrderShipmentClient ... />
 *     </CampaignShipOrderGuard>
 *   );
 * }
 * ```
 */
export function CampaignShipOrderGuard({ children }: CampaignShipOrderGuardProps) {
  const { canShipOrders } = useCapabilities(
    CAMPAIGN_CAPABILITIES_MAP,
    DEFAULT_CAMPAIGN_CAPABILITIES,
  );

  return (
    <CapabilitiesGuard allowed={canShipOrders} fallbackRoute={ProtectedRoute.CAMPAIGN_MANAGEMENT}>
      {children}
    </CapabilitiesGuard>
  );
}
