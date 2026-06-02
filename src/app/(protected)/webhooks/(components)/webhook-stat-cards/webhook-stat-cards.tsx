'use client';

import { CheckCircleIcon, InactiveCircleIcon, PackageIcon, StatCard } from '@/components';
import { useTranslations } from 'next-intl';
import { useContext } from 'react';

import { WebhookContext } from '../../context/WebhookContext';

export default function WebhookStatCards() {
  const { totalCredentials, activeCredentials, inactiveCredentials } = useContext(WebhookContext);
  const t = useTranslations('webhooks');

  return (
    <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mt-6'>
      <StatCard
        icon={<PackageIcon className='size-[18px] text-[var(--primary-500)]' aria-hidden='true' />}
        iconBgClass='bg-stat-icon-blue'
        value={totalCredentials}
        label={t('stats.total')}
      />
      <StatCard
        icon={
          <CheckCircleIcon className='size-5 text-[var(--badge-active-text)]' aria-hidden='true' />
        }
        iconBgClass='bg-[var(--badge-active-bg)]'
        value={activeCredentials}
        label={t('stats.active')}
        valueClassName='text-[var(--badge-active-text)]'
      />
      <StatCard
        icon={
          <InactiveCircleIcon
            className='size-5 text-[var(--stat-icon-inactive-color)]'
            aria-hidden='true'
          />
        }
        iconBgClass='bg-stat-icon-gray'
        value={inactiveCredentials}
        label={t('stats.inactive')}
      />
    </div>
  );
}
