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
import { PSPSortField, SortOrder } from '@/constant';
import { GET_PSPS, GetPSPsResponse, GetPSPsVariables } from '@/graphql';
import { useCapabilities } from '@/hooks';
import {
  DEFAULT_WEBHOOK_CAPABILITIES,
  WEBHOOK_CAPABILITIES_MAP,
} from '@/lib/permissions/capabilities/webhook.capabilities';
import { useSuspenseQuery } from '@apollo/client/react';
import { useTranslations } from 'next-intl';
import { useContext } from 'react';

import { WebhookContext } from '../../context/WebhookContext';

const ALL_PSPS_QUERY_VARS: GetPSPsVariables = {
  page: 1,
  pageSize: -1,
  filter: { isActive: true },
  sort: { field: PSPSortField.NAME, order: SortOrder.ASC },
};

function PspFilter() {
  const { filterState, updatePsp, ALL_PSPS } = useContext(WebhookContext);
  const t = useTranslations('webhooks');

  const { data } = useSuspenseQuery<GetPSPsResponse, GetPSPsVariables>(GET_PSPS, {
    variables: ALL_PSPS_QUERY_VARS,
  });

  const psps = data?.psps?.psps ?? [];

  return (
    <div className='w-full wide:min-w-[180px] wide:w-auto'>
      <Select
        aria-label={t('filter.pspAriaLabel')}
        value={filterState.pspId}
        onValueChange={(value) => {
          updatePsp(value ?? ALL_PSPS);
        }}
        itemToStringLabel={(selectedItem: string) =>
          psps.find((p) => p.id === selectedItem)?.name ?? t('filterOptions.allPsps')
        }
      >
        <SelectTrigger
          aria-label={t('filter.pspAriaLabel')}
          className='h-[40.5px] bg-input-bg text-[13px] font-medium focus-visible:border-[var(--focus-border)] focus-visible:ring-[var(--focus-ring)] focus-visible:ring-3'
        >
          <SelectValue placeholder={t('filterOptions.allPsps')} />
        </SelectTrigger>
        <SelectContent className='rounded-[8px]' alignItemWithTrigger={false}>
          <SelectItem value={ALL_PSPS} className='text-[14px] tracking-[-0.1504px]'>
            {t('filterOptions.allPsps')}
          </SelectItem>
          {psps.map((psp) => (
            <SelectItem key={psp.id} value={psp.id} className='text-[14px] tracking-[-0.1504px]'>
              {psp.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default function WebhookFilters() {
  const { filterState, updateSearch, clearSearch, updateStatus, resetFilters, ALL_STATUSES } =
    useContext(WebhookContext);
  const t = useTranslations('webhooks');
  const caps = useCapabilities(WEBHOOK_CAPABILITIES_MAP, DEFAULT_WEBHOOK_CAPABILITIES);

  const STATUS_OPTIONS = [
    { label: t('filterOptions.active'), value: 'true' },
    { label: t('filterOptions.inactive'), value: 'false' },
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

      {/* PSP filter — Platform Admin only */}
      {caps.showPspFilter && <PspFilter />}

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
