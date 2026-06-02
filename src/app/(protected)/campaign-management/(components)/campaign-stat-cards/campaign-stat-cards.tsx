'use client';

import { EyeIcon, InfoCircleIcon, InProductionIcon, TotalCampaignsIcon } from '@/components';
import { StatCard } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import { useContext } from 'react';

import { CampaignManagementContext } from '../../context/CampaignManagementContext';

export function CampaignStatCards() {
  const { statusCounts } = useContext(CampaignManagementContext);
  const t = useTranslations('campaignManagement');

  return (
    <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4 mt-6'>
      {/* aria-hidden on all icons: StatCard label text is the accessible name (WCAG 1.1.1) */}
      <StatCard
        label={t('stats.totalCampaigns')}
        value={statusCounts?.total}
        icon={<TotalCampaignsIcon className='size-5 text-primary' aria-hidden='true' />}
        iconBgClass='bg-stat-icon-blue'
      />
      <StatCard
        label={t('stats.newCampaigns')}
        value={statusCounts?.newCampaigns}
        icon={<InfoCircleIcon className='size-6 text-primary' aria-hidden='true' />}
        iconBgClass='bg-stat-icon-blue'
      />
      <StatCard
        label={t('stats.inReview')}
        value={statusCounts?.inReview}
        icon={<EyeIcon className='size-6 text-[var(--badge-purple-text)]' aria-hidden='true' />}
        iconBgClass='bg-stat-icon-purple'
      />
      <StatCard
        label={t('stats.inProduction')}
        value={statusCounts?.inProduction}
        icon={
          <InProductionIcon
            className='size-6 text-[var(--stat-icon-amber-text)]'
            aria-hidden='true'
          />
        }
        iconBgClass='bg-stat-icon-amber'
      />
    </div>
  );
}
