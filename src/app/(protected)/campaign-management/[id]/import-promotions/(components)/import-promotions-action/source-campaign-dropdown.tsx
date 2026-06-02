'use client';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components';
import { useContext, useMemo } from 'react';

import { LIST_CAMPAIGNS, ListCampaignsResponse, ListCampaignsVariables } from '@/graphql';
import { useQuery } from '@apollo/client/react';
import { ImportPromotionsContext } from '../../context/ImportPromotionsContext';

type CampaignOption = { id: string; name: string };

export default function SourceCampaignDropdown() {
  const { t, sourceCampaignId, setSourceCampaignId, brandId, destinationCampaignId } =
    useContext(ImportPromotionsContext);

  /* ── Fetch campaigns list for source dropdown ── */
  const { data: campaignsData, loading: isLoadingCampaigns } = useQuery<
    ListCampaignsResponse,
    ListCampaignsVariables
  >(LIST_CAMPAIGNS, {
    variables: { brandId, pageSize: -1 },
    skip: !brandId,
  });

  const campaignOptions = useMemo(() => {
    const campaigns = campaignsData?.listCampaigns?.campaigns ?? [];
    const filteredCampaigns = campaigns.filter((c) => c.id !== destinationCampaignId);
    const sortableCampaigns = [...filteredCampaigns].sort((a, b) => a.name.localeCompare(b.name));
    return sortableCampaigns;
  }, [campaignsData, destinationCampaignId]);

  const selectedCampaign = campaignOptions.find((c) => c.id === sourceCampaignId) ?? null;

  return (
    <div className='flex flex-col gap-2'>
      <label
        htmlFor='source-campaign-select'
        className='text-[14px] font-medium leading-[21px] text-[#1a1d21]'
      >
        {t('sourceCampaignLabel')}
        <span className='ml-1 text-destructive' aria-hidden='true'>
          *
        </span>
      </label>
      <div className='w-full max-w-md'>
        <Combobox
          items={campaignOptions}
          itemToStringLabel={(item: CampaignOption) => item.name}
          itemToStringValue={(item: CampaignOption) => item.id}
          value={selectedCampaign}
          onValueChange={(item: CampaignOption | null) => {
            setSourceCampaignId(item?.id ?? '');
          }}
          disabled={isLoadingCampaigns}
        >
          <ComboboxInput
            id='source-campaign-select'
            aria-label={t('sourceCampaignAriaLabel')}
            placeholder={t('sourceCampaignPlaceholder')}
            isLoading={isLoadingCampaigns}
            disabled={isLoadingCampaigns}
          />
          <ComboboxContent>
            <ComboboxEmpty>{t('noCampaignFound')}</ComboboxEmpty>
            <ComboboxList>
              {(campaign: CampaignOption) => (
                <ComboboxItem
                  key={campaign.id}
                  value={campaign}
                  className='text-sm tracking-[-0.1504px]'
                >
                  {campaign.name}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>
    </div>
  );
}
