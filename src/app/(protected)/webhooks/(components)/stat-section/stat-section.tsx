'use client';

import { CheckCircleIcon, PauseCircleIcon, StatCard, WebhookIcon } from '@/components';
import { useTranslations } from 'next-intl';

export default function StatSection() {
  const t = useTranslations('webhooks.stats');

  return (
    <>
      <StatCard
        icon={<WebhookIcon className='size-6 text-primary' aria-hidden='true' />}
        iconBgClass='bg-stat-icon-blue'
        value={0}
        label={t('total')}
      />
      <StatCard
        icon={<CheckCircleIcon className='size-6 text-badge-active-text' aria-hidden='true' />}
        iconBgClass='bg-stat-icon-green'
        value={0}
        label={t('active')}
      />
      <StatCard
        icon={<PauseCircleIcon className='size-6 text-text-secondary' aria-hidden='true' />}
        iconBgClass='bg-stat-icon-gray'
        value={0}
        label={t('inactive')}
      />
    </>
  );
}
