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

import { InventoryManagementContext } from '../../context/InventoryManagementContext';

export function InventoryFilters() {
  const {
    filterState,
    updateSearch,
    clearSearch,
    updateBrandId,
    resetFilters,
    ALL_BRANDS,
    brandList,
  } = useContext(InventoryManagementContext);

  const sortedBrandList = [...(brandList ?? [])].sort((a, b) => a.name.localeCompare(b.name));

  const t = useTranslations('inventoryManagement');

  return (
    <PageControls>
      <PageSearch
        className='w-full'
        aria-label={t('filter.searchAriaLabel')}
        placeholder={t('filter.searchPlaceholder')}
        value={filterState?.search}
        onChange={(e) => {
          updateSearch(e.target.value);
        }}
        onClear={clearSearch}
      />

      {/* Brand Filter */}
      <div className='w-full wide:min-w-[160px] wide:w-auto'>
        <Select
          aria-label={t('filter.brandAriaLabel')}
          value={filterState?.brandId}
          onValueChange={(value) => {
            updateBrandId(value ?? ALL_BRANDS);
          }}
          itemToStringLabel={(selectedItem: string) => {
            if (selectedItem === ALL_BRANDS) return t('brandOptions.all');
            return sortedBrandList.find((b) => b.id === selectedItem)?.name ?? selectedItem;
          }}
        >
          <SelectTrigger
            aria-label={t('filter.brandAriaLabel')}
            className='h-[40.5px] bg-input-bg text-[13px] font-medium focus-visible:border-[var(--focus-border)] focus-visible:ring-[var(--focus-ring)] focus-visible:ring-3'
          >
            <SelectValue placeholder={t('brandOptions.all')} />
          </SelectTrigger>
          <SelectContent className='rounded-[8px]' alignItemWithTrigger={false}>
            <SelectItem value={ALL_BRANDS} className='text-[14px] tracking-[-0.1504px]'>
              {t('brandOptions.all')}
            </SelectItem>
            {sortedBrandList.map((brand) => (
              <SelectItem
                key={brand.id}
                value={brand.id}
                className='text-[14px] tracking-[-0.1504px]'
              >
                {brand.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <PageResetButton onClick={resetFilters} />
    </PageControls>
  );
}
