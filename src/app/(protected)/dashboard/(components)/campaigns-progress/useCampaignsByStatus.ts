import { CampaignStatusEnum } from '@/constant';
import { useGlobalProtected } from '@/contexts';
import { LIST_CAMPAIGNS, ListCampaignsResponse, ListCampaignsVariables } from '@/graphql';
import { CampaignType } from '@/types';
import { skipToken, useSuspenseQuery } from '@apollo/client/react';

const PAGE_SIZE = 2;

interface UseCampaignsByStatusResult {
  campaigns: CampaignType[];
  totalCount: number;
}

export function useCampaignsByStatus(status: CampaignStatusEnum): UseCampaignsByStatusResult {
  const { selectedBrandId, selectedPspId, selectedStoreId } = useGlobalProtected();

  const { data } = useSuspenseQuery<ListCampaignsResponse, ListCampaignsVariables>(
    LIST_CAMPAIGNS,
    (selectedBrandId ?? selectedPspId ?? selectedStoreId)
      ? {
          variables: {
            pspId: selectedPspId,
            brandId: selectedBrandId,
            storeId: selectedStoreId,
            page: 1,
            pageSize: PAGE_SIZE,
            filter: {
              status,
              // send isArchived: false to all status except COMPLETED, as COMPLETED status can include both archived and non-archived campaigns
              ...(status !== CampaignStatusEnum.COMPLETED ? { isArchived: false } : {}),
            },
          },
        }
      : skipToken,
  );

  const campaigns = data?.listCampaigns?.campaigns ?? [];
  const totalCount = data?.listCampaigns?.pagination?.totalCount ?? campaigns?.length;

  return { campaigns, totalCount };
}
