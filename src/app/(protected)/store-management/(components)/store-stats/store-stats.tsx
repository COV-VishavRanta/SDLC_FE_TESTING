'use client';

import { CheckCircleIcon, PauseCircleIcon, StatCard, StoreIcon } from '@/components';
import { useTranslations } from 'next-intl';
import { useContext } from 'react';

import { StoreManagementContext } from '../../context/StoreManagementContext';

export function StoreStats() {
  const t = useTranslations('storeManagement.stats');
  const { storeData } = useContext(StoreManagementContext);

  const totalStores = storeData?.totalStores ?? 0;
  const activeStores = storeData?.activeStores ?? 0;
  const inactiveStores = storeData?.inactiveStores ?? 0;

  return (
    <>
      {/* aria-hidden on all stat icons: the StatCard label text is the accessible name (WCAG 1.1.1) */}
      <StatCard
        icon={<StoreIcon className='size-6 text-primary' aria-hidden='true' />}
        iconBgClass='bg-stat-icon-blue'
        value={totalStores}
        label={t('totalStores')}
      />
      <StatCard
        icon={<CheckCircleIcon className='size-6 text-badge-active-text' aria-hidden='true' />}
        iconBgClass='bg-stat-icon-green'
        value={activeStores}
        label={t('activeStores')}
      />
      <StatCard
        icon={<PauseCircleIcon className='size-6 text-text-secondary' aria-hidden='true' />}
        iconBgClass='bg-stat-icon-gray'
        value={inactiveStores}
        label={t('inactiveStores')}
      />
    </>
  );
}
