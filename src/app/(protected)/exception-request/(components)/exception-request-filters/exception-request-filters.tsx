'use client';

import {
  PageControls,
  PageResetButton,
  PageSearch,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components';
import { ShipmentReorderStatusEnum } from '@/constant';
import { useTranslations } from 'next-intl';
import { useContext } from 'react';

import { ExceptionRequestContext } from '../../context/ExceptionRequestContext';

export default function ExceptionRequestFilters() {
  const {
    filterState,
    filterOptions,
    updateSearch,
    clearSearch,
    updateCampaign,
    updateStatus,
    updateStore,
    resetFilters,
    ALL_CAMPAIGNS,
    ALL_STATUSES,
    ALL_STORES,
    isBrandAdmin,
  } = useContext(ExceptionRequestContext);
  const t = useTranslations('exceptionRequest');

  const campaigns = filterOptions?.campaigns ?? [];
  const sortedCampaigns = [...campaigns].sort((a, b) => a.name.localeCompare(b.name));
  const stores = filterOptions?.stores ?? [];
  const sortedStores = [...stores].sort((a, b) => a.name.localeCompare(b.name));

  const STATUS_OPTIONS: { label: string; value: ShipmentReorderStatusEnum }[] = [
    {
      label: t('filterOptions.pendingApproval'),
      value: ShipmentReorderStatusEnum.PENDING_APPROVAL,
    },
    { label: t('filterOptions.approved'), value: ShipmentReorderStatusEnum.APPROVED },
    { label: t('filterOptions.rejected'), value: ShipmentReorderStatusEnum.REJECTED },
    { label: t('filterOptions.cancelled'), value: ShipmentReorderStatusEnum.CANCELLED },
  ];

  return (
    <PageControls>
      <PageSearch
        className='w-full'
        placeholder={t('filter.searchPlaceholder')}
        value={filterState.search}
        onChange={(e) => {
          updateSearch(e.target.value);
        }}
        onClear={clearSearch}
      />

      {/* Campaign */}
      <div className='w-full wide:min-w-[180px] wide:w-auto'>
        <Select
          aria-label={t('filter.campaignAriaLabel')}
          value={filterState.campaignId}
          onValueChange={(value) => {
            updateCampaign(value ?? ALL_CAMPAIGNS);
          }}
          itemToStringLabel={(selectedItem: string) =>
            sortedCampaigns.find((c) => c.id === selectedItem)?.name ??
            t('filterOptions.allCampaigns')
          }
        >
          <SelectTrigger
            aria-label={t('filter.campaignAriaLabel')}
            className='h-[40.5px] bg-input-bg text-[13px] font-medium focus-visible:border-[var(--focus-border)] focus-visible:ring-[var(--focus-ring)] focus-visible:ring-3'
          >
            <SelectValue placeholder={t('filterOptions.allCampaigns')} />
          </SelectTrigger>
          <SelectContent className='rounded-[8px]' alignItemWithTrigger={false}>
            <SelectItem value={ALL_CAMPAIGNS} className='text-[14px] tracking-[-0.1504px]'>
              {t('filterOptions.allCampaigns')}
            </SelectItem>
            {sortedCampaigns.map((campaign) => (
              <SelectItem
                key={campaign.id}
                value={campaign.id}
                className='text-[14px] tracking-[-0.1504px]'
              >
                {campaign.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Store – Brand Admin only */}
      {isBrandAdmin && (
        <div className='w-full wide:min-w-[180px] wide:w-auto'>
          <Select
            aria-label={t('filter.storeAriaLabel')}
            value={filterState.storeId}
            onValueChange={(value) => {
              updateStore(value ?? ALL_STORES);
            }}
            itemToStringLabel={(selectedItem: string) =>
              sortedStores.find((s) => s.id === selectedItem)?.name ?? t('filterOptions.allStores')
            }
          >
            <SelectTrigger
              aria-label={t('filter.storeAriaLabel')}
              className='h-[40.5px] bg-input-bg text-[13px] font-medium focus-visible:border-[var(--focus-border)] focus-visible:ring-[var(--focus-ring)] focus-visible:ring-3'
            >
              <SelectValue placeholder={t('filterOptions.allStores')} />
            </SelectTrigger>
            <SelectContent className='rounded-[8px]' alignItemWithTrigger={false}>
              <SelectItem value={ALL_STORES} className='text-[14px] tracking-[-0.1504px]'>
                {t('filterOptions.allStores')}
              </SelectItem>
              {sortedStores.map((store) => (
                <SelectItem
                  key={store.id}
                  value={store.id}
                  className='text-[14px] tracking-[-0.1504px]'
                >
                  {store.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Status */}
      <div className='w-full wide:min-w-[155px] wide:w-auto'>
        <Select
          aria-label={t('filter.statusAriaLabel')}
          value={filterState.status}
          onValueChange={(value) => {
            updateStatus(value ?? ALL_STATUSES);
          }}
          itemToStringLabel={(selectedItem: string) =>
            STATUS_OPTIONS.find((o) => o.value === selectedItem)?.label ??
            t('filterOptions.allStatuses')
          }
        >
          <SelectTrigger
            aria-label={t('filter.statusAriaLabel')}
            className='h-[40.5px] bg-input-bg text-[13px] font-medium focus-visible:border-[var(--focus-border)] focus-visible:ring-[var(--focus-ring)] focus-visible:ring-3'
          >
            <SelectValue placeholder={t('filterOptions.allStatuses')} />
          </SelectTrigger>
          <SelectContent className='rounded-[8px]' alignItemWithTrigger={false}>
            <SelectItem value={ALL_STATUSES} className='text-[14px] tracking-[-0.1504px]'>
              {t('filterOptions.allStatuses')}
            </SelectItem>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className='text-[14px] tracking-[-0.1504px]'
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <PageResetButton onClick={resetFilters} />
    </PageControls>
  );
}
