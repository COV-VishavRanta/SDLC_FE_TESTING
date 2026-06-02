'use client';

import { Card, CardContent, TrendingUpIcon, UsersGroupIcon } from '@/components';
import { GET_USER_OVERVIEW, UserOverviewResponse } from '@/graphql';
import { useSuspenseQuery } from '@apollo/client/react';
import { useTranslations } from 'next-intl';

/* ─── Stat Card Icon ─── */
function StatCardIcon({ type }: { type: 'users' | 'trending' }) {
  return (
    <div
      className='flex size-12 shrink-0 items-center justify-center rounded-md bg-[var(--primary-300)] sm:rounded-lg'
      aria-hidden='true'
    >
      {type === 'users' ? (
        <UsersGroupIcon className='size-6 text-[var(--primary-500)]' />
      ) : (
        <TrendingUpIcon className='size-6 text-[var(--primary-500)]' />
      )}
    </div>
  );
}

/* ─── Stat Card ─── */
function StatCard({
  label,
  value,
  iconType,
  isPrimary = false,
}: {
  label: string;
  value: number | string;
  iconType: 'users' | 'trending';
  isPrimary?: boolean;
}) {
  return (
    <Card className='rounded-md border border-[var(--neutral-300)] bg-[var(--neutral-100)] p-[15px] sm:rounded-lg sm:px-6 sm:py-6'>
      <CardContent className='flex items-start justify-between p-0'>
        <div className='flex flex-col gap-2'>
          <p
            className={`font-[var(--font-weight-medium)] leading-5 tracking-[-0.15px] text-[var(--neutral-500)] ${
              isPrimary ? 'text-[14px]' : 'text-[12px] sm:text-[14px]'
            }`}
          >
            {label}
          </p>
          <p
            className={`font-[var(--font-weight-semibold)] leading-normal text-[var(--neutral-900)] ${
              isPrimary ? 'text-[32px]' : 'text-[24px] sm:text-[32px]'
            }`}
          >
            {value.toLocaleString()}
          </p>
        </div>
        <StatCardIcon type={iconType} />
      </CardContent>
    </Card>
  );
}

export default function UserOverview() {
  const t = useTranslations('dashboard.user-overview');

  /* ─── Fetch user overview data from GraphQL ─── */
  const { data } = useSuspenseQuery<UserOverviewResponse>(GET_USER_OVERVIEW);

  const USER_STATS = [
    {
      label: t('stat-card.total-users'),
      value: data?.userOverview?.totalUsers ?? '—',
      iconType: 'users' as const,
    },
    {
      label: t('stat-card.active-users'),
      value: data?.userOverview?.activeUsers ?? '—',
      iconType: 'users' as const,
    },
    {
      label: t('stat-card.inactive-users'),
      value: data?.userOverview?.inactiveUsers ?? '—',
      iconType: 'users' as const,
    },
    {
      label: t('stat-card.pending-users'),
      value: data?.userOverview?.pendingUsers ?? '—',
      iconType: 'users' as const,
    },
    {
      label: t('stat-card.new-users'),
      value: data?.userOverview?.newUsers ?? '—',
      iconType: 'trending' as const,
    },
  ];

  return (
    <section
      className='flex min-w-0 flex-col gap-2 sm:gap-5'
      aria-labelledby='user-overview-heading'
    >
      <h2
        id='user-overview-heading'
        className='text-[16px] font-[var(--font-weight-medium)] leading-5 tracking-[-0.15px] text-[var(--neutral-900)]'
      >
        {t('title')}
      </h2>
      <div className='grid min-w-0 grid-cols-2 gap-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-5'>
        {USER_STATS.map((stat, index) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value ?? ''}
            iconType={stat.iconType}
            isPrimary={index === 0}
          />
        ))}
      </div>
    </section>
  );
}
