'use client';

import { Button, ViewMoreArrowIcon } from '@/components';
import { CampaignStatusEnum, ProtectedRoute } from '@/constant';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { CampaignCard } from './campaign-card';
import { STATUS_ICON_MAP } from './campaigns-progress.constants';
import { useCampaignsByStatus } from './useCampaignsByStatus';

interface CampaignStatusColumnProps {
  status: CampaignStatusEnum;
}

export function CampaignStatusColumn({ status }: CampaignStatusColumnProps) {
  const router = useRouter();
  const t = useTranslations('dashboard.campaigns-progress');
  const { campaigns, totalCount } = useCampaignsByStatus(status);

  const { icon, bg } = STATUS_ICON_MAP[status];
  const displayName = t(`statuses.${status}`);

  const handleViewMore = () => {
    router.push(`${ProtectedRoute.CAMPAIGN_MANAGEMENT}?status=${status}`);
  };

  return (
    <div className='flex w-full flex-col gap-5'>
      {/* Header */}
      <div className='flex h-8 items-center justify-between'>
        <div className='flex h-8 items-center gap-2'>
          <div
            aria-hidden='true'
            className={cn('flex size-8 items-center justify-center rounded-[6px]', bg)}
          >
            {icon}
          </div>
          <span className='whitespace-nowrap text-[16px] font-[var(--font-weight-semibold)] leading-5 tracking-[-0.15px] text-[var(--neutral-900)]'>
            {displayName}
          </span>
        </div>
        <span
          aria-label={t('status-count-aria', { count: totalCount, status: displayName })}
          className='flex size-7 items-center justify-center rounded-full border border-[var(--neutral-300)] bg-[var(--neutral-100)] text-[13px] font-[var(--font-weight-semibold)] text-[var(--neutral-700)]'
        >
          <span aria-hidden='true'>{totalCount}</span>
        </span>
      </div>

      {/* Campaign Cards */}
      <div className='flex w-full flex-col gap-2 overflow-clip'>
        {campaigns.length > 0 ? (
          campaigns.map((campaign) => <CampaignCard key={campaign.id} campaign={campaign} />)
        ) : (
          <p className='text-center text-[13px] text-[var(--neutral-500)]' role='status'>
            {t('no-campaigns')}
          </p>
        )}
      </div>

      {/* View More Button */}
      {campaigns.length > 0 && (
        <Button
          variant='outline'
          onClick={handleViewMore}
          aria-label={t('view-more-aria', { status: displayName })}
          className='flex w-full items-center justify-center gap-2 rounded-[6px] border border-[var(--primary-500)] bg-transparent px-3 py-2 transition-colors hover:bg-[var(--primary-300)] sm:rounded-[8px] sm:px-6 sm:py-3'
        >
          <span
            aria-hidden='true'
            className='whitespace-nowrap bg-gradient-to-b from-[var(--primary-500)] to-[var(--primary-600)] bg-clip-text text-[12px] font-[var(--font-weight-medium)] leading-normal text-transparent sm:text-[14px]'
          >
            {t('view-more')}
          </span>
          <span aria-hidden='true'>
            <ViewMoreArrowIcon />
          </span>
        </Button>
      )}
    </div>
  );
}
