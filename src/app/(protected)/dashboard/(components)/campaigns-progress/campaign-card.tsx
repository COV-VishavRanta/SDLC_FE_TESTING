'use client';

import { ClockSmallIcon, StoreSmallIcon, TagSmallIcon } from '@/components';
import { UserRole } from '@/constant/enums/user.enums';
import { usePermissions } from '@/hooks';
import { CampaignType } from '@/types';
import { useLocale, useTranslations } from 'next-intl';

interface CampaignCardProps {
  campaign: CampaignType;
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const t = useTranslations('dashboard.campaigns-progress');
  const locale = useLocale();
  const { role } = usePermissions();
  const isBrandAdmin = role === UserRole.BRAND_ADMIN;

  const displayDate = campaign.endDate
    ? new Date(`${campaign.endDate}T00:00:00`).toLocaleDateString(locale, {
        month: 'short',
        day: 'numeric',
      })
    : '—';

  return (
    <article
      className='flex w-full flex-col gap-2 rounded-[8px] border border-[var(--neutral-300)] bg-[var(--neutral-100)] p-3'
      aria-label={campaign.name}
    >
      <p className='truncate text-[14px] font-[var(--font-weight-medium)] leading-5 tracking-[-0.15px] text-[var(--neutral-900)]'>
        {campaign.name}
      </p>
      {!isBrandAdmin && campaign.brandName && (
        <p
          aria-label={t('brand-name-aria', { name: campaign.brandName })}
          className='truncate text-[12px] leading-4 tracking-[-0.15px] text-[var(--neutral-500)]'
        >
          {campaign.brandName}
        </p>
      )}
      <div className='flex w-full items-center justify-between'>
        <div className='flex items-center gap-1'>
          <div className='flex items-center gap-1'>
            <span
              aria-hidden='true'
              className='flex size-4 shrink-0 items-center justify-center p-[2px]'
            >
              <TagSmallIcon />
            </span>
            <span className='whitespace-nowrap text-[12px] font-[var(--font-weight-medium)] leading-5 tracking-[-0.15px] text-[var(--neutral-500)]'>
              {t('promos', { count: campaign.promotionCount })}
            </span>
          </div>
          <div className='flex items-center gap-1'>
            <span
              aria-hidden='true'
              className='flex size-4 shrink-0 items-center justify-center p-[2px]'
            >
              <StoreSmallIcon />
            </span>
            <span className='whitespace-nowrap text-[12px] font-[var(--font-weight-medium)] leading-5 tracking-[-0.15px] text-[var(--neutral-500)]'>
              {t('stores', { count: campaign.storeCount })}
            </span>
          </div>
        </div>
        <div
          className='flex items-center gap-1'
          aria-label={t('end-date-aria', { date: displayDate })}
        >
          <span
            aria-hidden='true'
            className='flex size-4 shrink-0 items-center justify-center p-[2px]'
          >
            <ClockSmallIcon />
          </span>
          <span
            aria-hidden='true'
            className='whitespace-nowrap text-[12px] font-[var(--font-weight-medium)] leading-5 tracking-[-0.15px] text-[var(--neutral-500)]'
          >
            {displayDate}
          </span>
        </div>
      </div>
    </article>
  );
}
