'use client';

import {
  AlertCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  PauseCircleIcon,
  StatCard,
} from '@/components';
import { useTranslations } from 'next-intl';
import { useContext } from 'react';

import { ExceptionRequestContext } from '../../context/ExceptionRequestContext';

export default function ExceptionRequestStatCards() {
  const { statusCounts } = useContext(ExceptionRequestContext);
  const t = useTranslations('exceptionRequest');

  // const total = statusCounts?.total ?? 0;
  const pendingApproval = statusCounts?.pendingApproval ?? 0;
  const rejected = statusCounts?.rejected ?? 0;
  const cancelled = statusCounts?.cancelled ?? 0;
  const approved = statusCounts?.approved ?? 0;

  return (
    <div className='mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
      {/* <StatCard
        icon={<InfoCircleIcon className='size-[18px] text-primary' aria-hidden='true' />}
        iconBgClass='bg-[var(--primary-300)]'
        value={total}
        label={t('stats.totalRequests')}
      /> */}
      <StatCard
        icon={
          <ClockIcon
            className='size-[18px] text-[var(--badge-pending-approval-text)]'
            aria-hidden='true'
          />
        }
        iconBgClass='bg-[var(--badge-pending-approval-bg)]'
        value={pendingApproval}
        label={t('stats.pendingApproval')}
        valueClassName='text-[var(--badge-pending-approval-text)]'
      />
      <StatCard
        icon={
          <CheckCircleIcon
            className='size-[18px] text-[var(--badge-inactive-text)]'
            aria-hidden='true'
          />
        }
        iconBgClass='bg-[var(--badge-active-bg)]'
        value={approved}
        label={t('stats.approved')}
        valueClassName='text-[var(--badge-inactive-text)]'
      />
      <StatCard
        icon={<AlertCircleIcon className='size-[18px]' aria-hidden='true' />}
        iconBgClass='bg-[#F8D7DA]'
        value={rejected}
        label={t('stats.rejected')}
        valueClassName='text-[#A71816]'
      />
      <StatCard
        icon={<PauseCircleIcon className='size-[18px] text-text-secondary' aria-hidden='true' />}
        iconBgClass='bg-stat-icon-gray'
        value={cancelled}
        label={t('stats.cancelled')}
        valueClassName='text-[var(--badge-inactive-text)]'
      />
    </div>
  );
}
