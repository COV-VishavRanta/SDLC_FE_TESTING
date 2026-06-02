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
import { useTranslations } from 'next-intl';
import { useContext } from 'react';

import { BrandManagementContext } from '../../context/BrandManagementContext';

export function BrandFilters() {
  const { filterState, updateSearch, clearSearch, updateStatus, resetFilters, ALL_STATUSES } =
    useContext(BrandManagementContext);
  const t = useTranslations('brandManagement');

  const STATUS_OPTIONS = [
    { label: t('statusOptions.all'), value: ALL_STATUSES },
    { label: t('statusOptions.active'), value: 'true' },
    { label: t('statusOptions.inactive'), value: 'false' },
  ];

  return (
    <PageControls>
      <PageSearch
        className='w-full'
        placeholder={t('filter.searchPlaceholder')}
        value={filterState?.search}
        onChange={(e) => {
          updateSearch(e.target.value);
        }}
        onClear={clearSearch}
      />

      <div className='w-full wide:min-w-[150px] wide:w-auto'>
        <Select
          aria-label={t('filter.statusAriaLabel')}
          value={filterState?.status}
          onValueChange={(value) => {
            updateStatus(value ?? ALL_STATUSES);
          }}
          itemToStringLabel={(selectedItem: string) =>
            STATUS_OPTIONS.find((item) => item.value === selectedItem)?.label ?? ''
          }
        >
          <SelectTrigger
            aria-label={t('filter.statusAriaLabel')}
            className='h-[40.5px] bg-input-bg text-[13px] font-medium focus-visible:border-[var(--focus-border)] focus-visible:ring-[var(--focus-ring)] focus-visible:ring-3'
          >
            <SelectValue placeholder={t('statusOptions.all')} />
          </SelectTrigger>
          <SelectContent className='rounded-[8px]' alignItemWithTrigger={false}>
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
