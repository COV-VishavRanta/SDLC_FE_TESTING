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
import { CampaignStatusEnum, CampaignTypeEnum } from '@/constant';
import { useTranslations } from 'next-intl';
import { useContext } from 'react';

import { CampaignManagementContext } from '../../context/CampaignManagementContext';
import {
  ALL_BRANDS,
  ALL_CAMPAIGN_TYPES,
  ALL_STATUSES,
  ALL_STORES,
} from '../../context/useCampaignManagementContext';

export function CampaignFilters() {
  const {
    filterState,
    updateSearch,
    clearSearch,
    updateCampaignType,
    updateStatus,
    resetFilters,
    updateIsArchived,
    updateBrandId,
    updateStoreId,
    capabilities,
    brandsList,
    storesList,
  } = useContext(CampaignManagementContext);
  const t = useTranslations('campaignManagement.filter');

  const BRAND_OPTIONS = [
    { label: t('brandOptions.all'), value: ALL_BRANDS },
    ...(brandsList ?? [])
      .map((b) => ({ label: b.name, value: b.id }))
      ?.sort((a, b) => a.label.localeCompare(b.label)),
  ];

  const STORE_OPTIONS = [
    { label: t('storeOptions.all'), value: ALL_STORES },
    ...(storesList ?? [])
      .map((s) => ({ label: s.name, value: s.id }))
      .sort((a, b) => a.label.localeCompare(b.label)),
  ];

  const selectedBrandLabel =
    BRAND_OPTIONS.find((opt) => opt.value === filterState.brandId)?.label ?? t('brandOptions.all');

  const selectedStoreLabel =
    STORE_OPTIONS.find((opt) => opt.value === filterState.storeId)?.label ?? t('storeOptions.all');

  const CAMPAIGN_TYPE_OPTIONS = [
    { label: t('typeOptions.all'), value: ALL_CAMPAIGN_TYPES },
    { label: t('typeOptions.ONE_OFF'), value: CampaignTypeEnum.ONE_OFF },
    { label: t('typeOptions.PERMANENT'), value: CampaignTypeEnum.PERMANENT },
  ];

  const STATUS_OPTIONS = [
    { label: t('statusOptions.all'), value: ALL_STATUSES },
    ...(capabilities.showDraftStatusFilter
      ? [{ label: t('statusOptions.DRAFT'), value: CampaignStatusEnum.DRAFT }]
      : []),
    { label: t('statusOptions.NEW'), value: CampaignStatusEnum.NEW },
    { label: t('statusOptions.IN_REVIEW'), value: CampaignStatusEnum.IN_REVIEW },
    { label: t('statusOptions.ACCEPTED'), value: CampaignStatusEnum.ACCEPTED },
    { label: t('statusOptions.ON_HOLD'), value: CampaignStatusEnum.ON_HOLD },
    { label: t('statusOptions.IN_PRODUCTION'), value: CampaignStatusEnum.IN_PRODUCTION },
    { label: t('statusOptions.PARTIALLY_SHIPPED'), value: CampaignStatusEnum.PARTIALLY_SHIPPED },
    { label: t('statusOptions.SHIPPED'), value: CampaignStatusEnum.SHIPPED },
    { label: t('statusOptions.PARTIALLY_RECEIVED'), value: CampaignStatusEnum.PARTIALLY_RECEIVED },
    { label: t('statusOptions.RECEIVED'), value: CampaignStatusEnum.RECEIVED },
    { label: t('statusOptions.COMPLETED'), value: CampaignStatusEnum.COMPLETED },
  ];

  const selectedTypeLabel =
    CAMPAIGN_TYPE_OPTIONS.find((opt) => opt.value === filterState.campaignType)?.label ??
    t('typeOptions.all');
  const selectedStatusLabel =
    STATUS_OPTIONS.find((opt) => opt.value === filterState.status)?.label ?? t('statusOptions.all');

  const ARCHIVE_OPTIONS = [
    { label: t('archivedOptions.archived'), value: 'true' },
    { label: t('archivedOptions.unarchived'), value: 'false' },
  ];

  const selectedArchiveLabel =
    ARCHIVE_OPTIONS.find((opt) => opt.value === filterState.isArchived)?.label ??
    t('archivedOptions.unarchived');

  return (
    <PageControls>
      <PageSearch
        className='w-full'
        placeholder={t('searchPlaceholder')}
        aria-label={t('searchAriaLabel')}
        value={filterState.search}
        onChange={(e) => {
          updateSearch(e.target.value);
        }}
        onClear={clearSearch}
      />
      {/* Store filter — Brand Admin + Campaign Manager only */}
      {capabilities.showStoreFilter && (
        <div className='w-full wide:min-w-[150px] wide:w-auto'>
          <Select
            aria-label={t('storeAriaLabel')}
            value={filterState.storeId}
            onValueChange={(value) => updateStoreId(value ?? ALL_STORES)}
          >
            <SelectTrigger
              aria-label={t('storeAriaLabel')}
              className='h-[var(--input-height)] w-full shrink-0 rounded-lg border-input bg-input-bg px-4 text-sm font-medium text-text-heading [&_[data-slot=select-icon]]:text-text-secondary'
            >
              <SelectValue placeholder={t('storeOptions.all')}>{selectedStoreLabel}</SelectValue>
            </SelectTrigger>
            <SelectContent className='rounded-lg'>
              {STORE_OPTIONS.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className='text-sm tracking-[-0.1504px]'
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <div className='w-full wide:min-w-[150px] wide:w-auto'>
        {/* Campaign Type Select */}
        <Select
          aria-label={t('typeAriaLabel')}
          value={filterState.campaignType}
          onValueChange={(value) => updateCampaignType(value ?? ALL_CAMPAIGN_TYPES)}
        >
          <SelectTrigger
            aria-label={t('typeAriaLabel')}
            className='h-[var(--input-height)] w-full shrink-0 rounded-lg border-input bg-input-bg px-4 text-sm font-medium text-text-heading [&_[data-slot=select-icon]]:text-text-secondary'
          >
            <SelectValue placeholder={t('typeOptions.all')}>{selectedTypeLabel}</SelectValue>
          </SelectTrigger>
          <SelectContent className='rounded-lg'>
            {CAMPAIGN_TYPE_OPTIONS.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className='text-sm tracking-[-0.1504px]'
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* Brand filter — PSP Admin only */}
      {capabilities.showBrandFilter && (
        <div className='w-full wide:min-w-[150px] wide:w-auto'>
          <Select
            aria-label={t('brandAriaLabel')}
            value={filterState.brandId}
            onValueChange={(value) => updateBrandId(value ?? ALL_BRANDS)}
          >
            <SelectTrigger
              aria-label={t('brandAriaLabel')}
              className='h-[var(--input-height)] w-full shrink-0 rounded-lg border-input bg-input-bg px-4 text-sm font-medium text-text-heading [&_[data-slot=select-icon]]:text-text-secondary'
            >
              <SelectValue placeholder={t('brandOptions.all')}>{selectedBrandLabel}</SelectValue>
            </SelectTrigger>
            <SelectContent className='rounded-lg'>
              {BRAND_OPTIONS.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className='text-sm tracking-[-0.1504px]'
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <div className='w-full wide:min-w-[150px] wide:w-auto'>
        {/* Status Select */}
        <Select
          aria-label={t('statusAriaLabel')}
          value={filterState.status}
          onValueChange={(value) => updateStatus(value ?? ALL_STATUSES)}
        >
          <SelectTrigger
            aria-label={t('statusAriaLabel')}
            className='h-[var(--input-height)] w-full shrink-0 rounded-lg border-input bg-input-bg px-4 text-sm font-medium text-text-heading [&_[data-slot=select-icon]]:text-text-secondary'
          >
            <SelectValue placeholder={t('statusOptions.all')}>{selectedStatusLabel}</SelectValue>
          </SelectTrigger>
          <SelectContent className='rounded-lg'>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className='text-sm tracking-[-0.1504px]'
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {capabilities.showArchiveFilter && (
        <div className='w-full wide:min-w-[150px] wide:w-auto'>
          {/* Archive Select */}
          <Select
            aria-label={t('archivedAriaLabel')}
            value={filterState.isArchived}
            onValueChange={(value) => updateIsArchived(value ?? 'false')}
          >
            <SelectTrigger
              aria-label={t('archivedAriaLabel')}
              className='h-[var(--input-height)] w-full shrink-0 rounded-lg border-input bg-input-bg px-4 text-sm font-medium text-text-heading [&_[data-slot=select-icon]]:text-text-secondary'
            >
              <SelectValue placeholder={t('archivedOptions.unarchived')}>
                {selectedArchiveLabel}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className='rounded-lg'>
              {ARCHIVE_OPTIONS.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className='text-sm tracking-[-0.1504px]'
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <PageResetButton onClick={resetFilters} />
    </PageControls>
  );
}
