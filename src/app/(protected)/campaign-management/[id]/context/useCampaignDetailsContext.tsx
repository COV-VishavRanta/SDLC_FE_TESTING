import { UserRole } from '@/constant/enums/user.enums';
import { useGlobalProtected } from '@/contexts';
import { GET_CAMPAIGN, GetCampaignResponse, GetCampaignVariables } from '@/graphql';
import { useCapabilities } from '@/hooks';
import {
  CAMPAIGN_CAPABILITIES_MAP,
  CAMPAIGN_MANAGER_UNASSIGNED_CAPABILITIES,
  DEFAULT_CAMPAIGN_CAPABILITIES,
} from '@/lib/permissions/route.permissions';
import { useSuspenseQuery } from '@apollo/client/react';
import { useLocale } from 'next-intl';
import { useCallback, useMemo, useState } from 'react';
import { CampaignDetailsProviderProps } from './CampaignDetailsContext';

function formatDateLocalized(dateStr?: string | null, locale?: string): string {
  if (!dateStr) return '';
  try {
    // Plain YYYY-MM-DD strings are parsed as UTC midnight by spec;
    // appending T00:00:00 forces parsing in the local timezone.
    const normalised = /^\d{4}-\d{2}-\d{2}$/.test(dateStr) ? `${dateStr}T00:00:00` : dateStr;
    return new Intl.DateTimeFormat(locale ?? 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(normalised));
  } catch {
    return dateStr;
  }
}

export default function useCampaignDetailsContext({
  campaignId,
  encodedCampaignId,
}: Omit<CampaignDetailsProviderProps, 'children'>) {
  const [promotionsLength, setPromotionsLength] = useState(0);
  const locale = useLocale();
  const roleBasedCapabilities = useCapabilities(
    CAMPAIGN_CAPABILITIES_MAP,
    DEFAULT_CAMPAIGN_CAPABILITIES,
  );
  const { currentUserRole, currentUserData } = useGlobalProtected();
  const currentUserId = currentUserData?.me?.id;

  const { data } = useSuspenseQuery<GetCampaignResponse, GetCampaignVariables>(GET_CAMPAIGN, {
    variables: { campaignId },
  });

  const campaign = data?.campaign?.campaign;

  const capabilities = useMemo(() => {
    const isUnassignedCampaignManager =
      currentUserRole === UserRole.CAMPAIGN_MANAGER &&
      campaign?.campaignManagerId !== currentUserId;

    return isUnassignedCampaignManager
      ? CAMPAIGN_MANAGER_UNASSIGNED_CAPABILITIES
      : roleBasedCapabilities;
  }, [campaign?.campaignManagerId, currentUserId, currentUserRole, roleBasedCapabilities]);

  const formatDate = useCallback(
    (dateStr?: string | null) => formatDateLocalized(dateStr, locale),
    [locale],
  );

  return {
    //data
    campaignData: campaign ?? null,
    encodedCampaignId,

    // helper
    formatDate,

    // capabilities
    capabilities,

    // state
    promotionsLength,
    setPromotionsLength,
  } as const;
}
