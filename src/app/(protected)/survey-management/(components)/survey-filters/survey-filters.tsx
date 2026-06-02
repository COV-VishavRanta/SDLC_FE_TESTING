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
import { SurveyStatusEnum } from '@/constant';
import { useCapabilities } from '@/hooks';
import { DEFAULT_SURVEY_CAPABILITIES, SURVEY_CAPABILITIES_MAP } from '@/lib';
import { useTranslations } from 'next-intl';
import { useContext } from 'react';

import { SurveyManagementContext } from '../../context/SurveyManagementContext';
import { ALL_BRANDS, ALL_STATUSES } from '../../context/useSurveyManagementContext';

export function SurveyFilters() {
  const {
    filterState,
    surveySearch,
    updateSurveySearch,
    clearSurveySearch,
    updateStatus,
    updateBrandFilter,
    resetFilters,
    brandsForFilter,
  } = useContext(SurveyManagementContext);
  const t = useTranslations('surveyManagement');
  const caps = useCapabilities(SURVEY_CAPABILITIES_MAP, DEFAULT_SURVEY_CAPABILITIES);

  const BRAND_OPTIONS = [
    { label: t('filter.allBrands'), value: ALL_BRANDS },
    ...brandsForFilter
      .map((b) => ({ label: b.name, value: b.id }))
      ?.sort((a, b) => a.label.localeCompare(b.label)),
  ];

  const STATUS_OPTIONS = [
    { label: t('statusOptions.all'), value: ALL_STATUSES },
    { label: t('statusOptions.draft'), value: SurveyStatusEnum.DRAFT },
    { label: t('statusOptions.active'), value: SurveyStatusEnum.ACTIVE },
    { label: t('statusOptions.closed'), value: SurveyStatusEnum.CLOSED },
  ];

  return (
    <PageControls>
      <PageSearch
        className='w-full'
        placeholder={t('filter.searchPlaceholder')}
        value={surveySearch}
        onChange={(e) => {
          updateSurveySearch(e.target.value);
        }}
        onClear={clearSurveySearch}
      />

      {caps.showBrandFilter && (
        <div className='w-full wide:min-w-[160px] wide:w-auto'>
          <Select
            aria-label={t('filter.brandAriaLabel')}
            value={filterState.brandId ?? ALL_BRANDS}
            onValueChange={(value) => {
              updateBrandFilter(value as string);
            }}
            itemToStringLabel={(selectedItem: string) =>
              BRAND_OPTIONS.find((item) => item.value === selectedItem)?.label ?? ''
            }
          >
            <SelectTrigger
              aria-label={t('filter.brandAriaLabel')}
              className='h-[40.5px] bg-input-bg text-[13px] font-medium focus-visible:border-[var(--focus-border)] focus-visible:ring-3 focus-visible:ring-[var(--focus-ring)]'
            >
              <SelectValue placeholder={t('filter.brandPlaceholder')} />
            </SelectTrigger>
            <SelectContent className='rounded-[8px]' alignItemWithTrigger={false}>
              {BRAND_OPTIONS.map((option) => (
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
      )}

      <div className='w-full wide:min-w-[150px] wide:w-auto'>
        <Select
          aria-label={t('filter.statusAriaLabel')}
          value={filterState.status}
          onValueChange={(value) => {
            updateStatus(value as SurveyStatusEnum | typeof ALL_STATUSES);
          }}
          itemToStringLabel={(selectedItem: string) =>
            STATUS_OPTIONS.find((item) => item.value === selectedItem)?.label ?? ''
          }
        >
          <SelectTrigger
            aria-label={t('filter.statusAriaLabel')}
            className='h-[40.5px] bg-input-bg text-[13px] font-medium focus-visible:border-[var(--focus-border)] focus-visible:ring-3 focus-visible:ring-[var(--focus-ring)]'
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
