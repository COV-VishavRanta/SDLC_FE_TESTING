'use client';

import { CheckCircleIcon, PauseCircleIcon, PSPManagementIcon, StatCard } from '@/components';
import { useTranslations } from 'next-intl';
import { useContext } from 'react';

import { PspManagementContext } from '../../context/PspManagementContext';

export default function StatSection() {
  const t = useTranslations('pspManagement.stats');
  const { pspData } = useContext(PspManagementContext);

  const totalPsps = pspData?.totalPsps ?? 0;
  const activePsps = pspData?.activePsps ?? 0;
  const inactivePsps = pspData?.inactivePsps ?? 0;

  return (
    <>
      {/* aria-hidden on all stat icons: the StatCard label text is the accessible name (WCAG 1.1.1) */}
      <StatCard
        icon={<PSPManagementIcon className='size-6 text-primary' aria-hidden='true' />}
        iconBgClass='bg-stat-icon-blue'
        value={totalPsps}
        label={t('totalPsps')}
      />
      <StatCard
        icon={<CheckCircleIcon className='size-6 text-badge-active-text' aria-hidden='true' />}
        iconBgClass='bg-stat-icon-green'
        value={activePsps}
        label={t('activePsps')}
      />
      <StatCard
        icon={<PauseCircleIcon className='size-6 text-text-secondary' aria-hidden='true' />}
        iconBgClass='bg-stat-icon-gray'
        value={inactivePsps}
        label={t('inactivePsps')}
      />
    </>
  );
}
