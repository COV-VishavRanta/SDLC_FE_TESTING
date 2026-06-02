'use client';

import { CheckCircleIcon, DeactivateIcon, PSPManagementIcon } from '@/components';
import { StatCard } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import { useContext } from 'react';

import { BrandManagementContext } from '../../context/BrandManagementContext';

/**
 * Reads pspId from BrandManagementContext (already resolved server-side via
 * the ENTITY_ID cookie). Uses skipToken when pspId is undefined so the
 * parent <Suspense> boundary shows BrandStatCardsSkeleton automatically.
 */
export function BrandStatCards() {
  const { brandData } = useContext(BrandManagementContext);
  const t = useTranslations('brandManagement');

  const totalBrands = brandData?.totalBrands ?? 0;
  const activeBrands = brandData?.activeBrands ?? 0;
  const inactiveBrands = brandData?.inactiveBrands ?? 0;

  return (
    <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mt-6'>
      {/* aria-hidden on all icons: StatCard label text is the accessible name (WCAG 1.1.1) */}
      <StatCard
        label={t('stats.totalBrands')}
        value={totalBrands}
        icon={
          <PSPManagementIcon className='size-[18px] text-[var(--primary-500)]' aria-hidden='true' />
        }
        iconBgClass='bg-[var(--primary-300)]'
      />
      <StatCard
        label={t('stats.activeBrands')}
        value={activeBrands}
        icon={
          <CheckCircleIcon
            className='size-[18px] text-[var(--badge-active-text)]'
            aria-hidden='true'
          />
        }
        iconBgClass='bg-[var(--badge-active-bg)]'
        valueClassName='text-[var(--badge-active-text)]'
      />
      <StatCard
        label={t('stats.inactiveBrands')}
        value={inactiveBrands}
        icon={
          <DeactivateIcon className='size-[18px] text-[var(--neutral-600)]' aria-hidden='true' />
        }
        iconBgClass='bg-[var(--neutral-300)]'
        valueClassName='text-[var(--neutral-600)]'
      />
    </div>
  );
}
