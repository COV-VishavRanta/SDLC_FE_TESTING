import { ImportPromotionMode, ProtectedRoute } from '@/constant';
import {
  GET_CAMPAIGN,
  GET_PROMOTIONS_BY_CAMPAIGN,
  GetCampaignResponse,
  GetCampaignVariables,
  IMPORT_PROMOTIONS,
  ImportPromotionsResponse,
  ImportPromotionsVariables,
} from '@/graphql';
import { decodeId } from '@/lib';
import { useMutation, useSuspenseQuery } from '@apollo/client/react';
import { RowSelectionState } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { ImportPromotionsProviderProps } from './ImportPromotionsContext';

export default function useImportPromotionsContext({
  encodedCampaignId,
}: Pick<ImportPromotionsProviderProps, 'encodedCampaignId'>) {
  const router = useRouter();
  const t = useTranslations('campaignManagement.importPromotions');

  /* ── Decode IDs ── */
  const campaignId = useMemo(() => decodeId(encodedCampaignId), [encodedCampaignId]);

  /* ── Fetch destination campaign for header display ── */
  const { data: campaignQueryData } = useSuspenseQuery<GetCampaignResponse, GetCampaignVariables>(
    GET_CAMPAIGN,
    { variables: { campaignId }, skip: !campaignId },
  );
  const destinationCampaign = campaignQueryData?.campaign?.campaign;
  const brandId = destinationCampaign?.brandId ?? '';

  /* ── Import action ── */
  const [importAction, setImportAction] = useState<ImportPromotionMode>(ImportPromotionMode.COPY);

  /* ── Source campaign selection ── */
  const [sourceCampaignId, setSourceCampaignId] = useState<string>('');

  /* ── Table selection ── */
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const selectedIds = Object.keys(rowSelection).filter((id) => rowSelection[id]);
  const hasSelection = selectedIds.length > 0;

  /* ── Mutation ── */
  const [importPromotionsMutation, { loading: isImporting }] = useMutation<
    ImportPromotionsResponse,
    ImportPromotionsVariables
  >(IMPORT_PROMOTIONS);

  async function handleAddToCampaign() {
    if (!hasSelection || !sourceCampaignId) return;
    const result = await importPromotionsMutation({
      variables: {
        input: {
          targetCampaignId: campaignId,
          sourceCampaignId,
          promotionIds: selectedIds,
          mode: importAction,
        },
      },
      refetchQueries: [GET_CAMPAIGN, GET_PROMOTIONS_BY_CAMPAIGN],
      update: (cache) => {
        // Evict specific fields to ensure fresh data is fetched when the components remount
        cache.evict({ fieldName: 'promotionsByCampaign' });
        cache.evict({ fieldName: 'campaign', args: { campaignId } });
        cache.gc();
      },
      onCompleted: () => {
        toast.success(t('addSuccess'));
        router.push(`${ProtectedRoute.CAMPAIGN_MANAGEMENT}/${encodedCampaignId}`);
        router.refresh();
      },
      onError: () => {
        toast.error(result.data?.importPromotions.message ?? t('addFailed'));
      },
    });
  }

  return {
    brandId,

    // destination campaign
    destinationCampaign,
    destinationCampaignId: campaignId,

    // import action
    importAction,
    setImportAction,

    // source campaigns
    sourceCampaignId,
    setSourceCampaignId,

    // table   rowSelection,
    rowSelection,
    setRowSelection,
    selectedIds,
    hasSelection,

    // import actions
    isImporting,
    handleAddToCampaign,

    // translations
    t,
  };
}
