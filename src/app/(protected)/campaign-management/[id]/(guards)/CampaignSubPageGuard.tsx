'use client';

import { CapabilitiesGuard } from '@/components';
import { CAMPAIGN_SUB_PAGE_NAME, ProtectedRoute } from '@/constant';
import { UserRole } from '@/constant/enums/user.enums';
import { useGlobalProtected } from '@/contexts';
import { GET_CAMPAIGN, type GetCampaignResponse, type GetCampaignVariables } from '@/graphql';
import { useCapabilities } from '@/hooks';
import { decodeId } from '@/lib';
import {
  CAMPAIGN_CAPABILITIES_MAP,
  DEFAULT_CAMPAIGN_CAPABILITIES,
} from '@/lib/permissions/route.permissions';
import { useQuery } from '@apollo/client/react';
import { useParams } from 'next/navigation';
import type { JSX, ReactNode } from 'react';

interface CampaignSubPageGuardProps {
  children: ReactNode;
  campaignSubPageName: CAMPAIGN_SUB_PAGE_NAME;
  loader: JSX.Element;
}

/**
 * Blocks access to campaign sub-pages (import-promotions, promotions-reuse,
 * store-distribution) for roles without the `canAccessSubPages` capability.
 *
 * For Campaign Manager, also enforces ownership: blocks access to action
 * sub-pages when the campaign is not assigned to the current user.
 *
 * Redirects to ProtectedRoute.CAMPAIGN_MANAGEMENT on denial.
 *
 * Usage in any campaign sub-page (server component):
 * ```tsx
 * export default async function ImportPromotionsPage({ params }) {
 *   return (
 *     <CampaignSubPageGuard>
 *       <PageRoot>...</PageRoot>
 *     </CampaignSubPageGuard>
 *   );
 * }
 * ```
 */
export function CampaignSubPageGuard({
  children,
  campaignSubPageName,
  loader,
}: CampaignSubPageGuardProps) {
  const {
    canAccessImportPromotionsPage,
    canAccessPromotionsReusePage,
    canAccessStoreDistributionPage,
    canAccessShipOrdersPage,
    canAccessVerifyInstallationProofPage,
  } = useCapabilities(CAMPAIGN_CAPABILITIES_MAP, DEFAULT_CAMPAIGN_CAPABILITIES);

  const { currentUserRole, currentUserData } = useGlobalProtected();
  const currentUserId = currentUserData?.me?.id;
  const isCampaignManager = currentUserRole === UserRole.CAMPAIGN_MANAGER;

  const params = useParams<{ id: string }>();
  const campaignId = decodeId(params.id);

  // For Campaign Manager, verify ownership. Apollo serves from cache when
  // the user navigated from the detail page; falls back to a network request
  // for direct URL access.
  const { data: campaignQueryData, loading: isCampaignLoading } = useQuery<
    GetCampaignResponse,
    GetCampaignVariables
  >(GET_CAMPAIGN, {
    variables: { campaignId },
    skip: !isCampaignManager || !campaignId,
  });

  const canAccessSubPages = (() => {
    switch (campaignSubPageName) {
      case CAMPAIGN_SUB_PAGE_NAME.IMPORT_PROMOTIONS:
        return canAccessImportPromotionsPage;
      case CAMPAIGN_SUB_PAGE_NAME.PROMOTIONS_REUSE:
        return canAccessPromotionsReusePage;
      case CAMPAIGN_SUB_PAGE_NAME.STORE_DISTRIBUTION:
        return canAccessStoreDistributionPage;
      case CAMPAIGN_SUB_PAGE_NAME.SHIP_ORDERS:
        return canAccessShipOrdersPage;
      case CAMPAIGN_SUB_PAGE_NAME.VERIFY_INSTALLATION_PROOF:
        return canAccessVerifyInstallationProofPage;
      default:
        return false;
    }
  })();

  // Non-CM roles are never subject to ownership checks.
  const isAssignedCampaignManager =
    !isCampaignManager ||
    campaignQueryData?.campaign?.campaign?.campaignManagerId === currentUserId;

  // Hold render until the ownership query settles to avoid a content flash.
  if (isCampaignLoading) return loader;

  return (
    <CapabilitiesGuard
      allowed={canAccessSubPages && isAssignedCampaignManager}
      fallbackRoute={ProtectedRoute.CAMPAIGN_MANAGEMENT}
    >
      {children}
    </CapabilitiesGuard>
  );
}
