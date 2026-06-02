'use client';

import { CampaignIcon, Card, CardContent, StoreIcon } from '@/components';
import { useGlobalProtected } from '@/contexts';
import { GET_BRAND_OVERVIEW, GetBrandOverviewResponse, GetBrandOverviewVariables } from '@/graphql';
import { skipToken, useSuspenseQuery } from '@apollo/client/react';
import { useTranslations } from 'next-intl';

/* ─── Types ─── */
interface OverviewStat {
  label: string;
  value: number | string;
  iconType: 'stores' | 'campaigns';
}

/* ─── Stat Card Icon ─── */
function StatCardIcon({ type }: { type: 'stores' | 'campaigns' }) {
  return (
    <div
      className='flex size-12 shrink-0 items-center justify-center rounded-lg bg-[var(--primary-300)]'
      aria-hidden='true'
    >
      {type === 'stores' ? (
        <StoreIcon className='size-6 text-[var(--primary-500)]' />
      ) : (
        <CampaignIcon className='size-6 text-[var(--primary-500)]' />
      )}
    </div>
  );
}

/* ─── Overview Stat Card ─── */
function OverviewStatCard({ label, value, iconType }: OverviewStat) {
  return (
    <Card className='border border-[var(--neutral-300)] bg-[var(--neutral-100)] p-[15px] sm:px-6 sm:py-6'>
      <CardContent className='flex items-start justify-between p-0'>
        <div className='flex flex-col gap-2'>
          <p className='text-[12px] sm:text-[14px] font-[var(--font-weight-medium)] leading-5 tracking-[-0.15px] text-[var(--neutral-500)]'>
            {label}
          </p>
          <p className='text-[24px] sm:text-[32px] font-[var(--font-weight-semibold)] leading-normal text-[var(--neutral-900)]'>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
        </div>
        <StatCardIcon type={iconType} />
      </CardContent>
    </Card>
  );
}

/* ─── Overview Cards Section ─── */
export default function OverviewCards() {
  const t = useTranslations('dashboard.brand-overview');
  const { selectedBrandId } = useGlobalProtected();

  const { data } = useSuspenseQuery<GetBrandOverviewResponse, GetBrandOverviewVariables>(
    GET_BRAND_OVERVIEW,
    selectedBrandId ? { variables: { brandId: selectedBrandId } } : skipToken,
  );

  const stats: OverviewStat[] = [
    {
      label: t('stat-card.active-stores'),
      value: data?.brandOverview?.activeStores ?? '—',
      iconType: 'stores',
    },
    {
      label: t('stat-card.ongoing-campaigns'),
      value: data?.brandOverview?.ongoingCampaigns ?? '—',
      iconType: 'campaigns',
    },
  ];

  return (
    <section className='grid grid-cols-2 gap-2 sm:gap-5' aria-labelledby='brand-overview-heading'>
      <h2 id='brand-overview-heading' className='sr-only'>
        {t('title')}
      </h2>
      {stats.map((stat) => (
        <OverviewStatCard key={stat.label} {...stat} />
      ))}
    </section>
  );
}
