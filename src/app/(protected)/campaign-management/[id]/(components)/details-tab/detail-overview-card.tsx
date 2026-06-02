'use client';

import { useContext } from 'react';

import { useTranslations } from 'next-intl';
import { CampaignDetailsContext } from '../../context/CampaignDetailsContext';

interface OverviewFieldProps {
  label: string;
  value: string;
}

function OverviewField({ label, value }: OverviewFieldProps) {
  return (
    <div className='flex flex-1 flex-col gap-1 sm:gap-2'>
      <p className='text-[10px] font-medium uppercase leading-4 tracking-[-0.15px] text-[var(--neutral-500)] sm:text-xs sm:leading-5'>
        {label}
      </p>
      <p className='text-sm font-normal leading-5 tracking-[-0.23px] text-text-heading sm:text-base'>
        {value}
      </p>
    </div>
  );
}

export function DetailOverviewCard() {
  const { campaignData } = useContext(CampaignDetailsContext);
  const t = useTranslations('campaignManagement.details.overview');

  return (
    <div className='flex flex-col gap-4 rounded-xl border border-border bg-white px-4 py-4 sm:flex-row sm:gap-5 sm:px-8 sm:py-6'>
      <OverviewField label={t('objective')} value={campaignData?.objective ?? '—'} />
      <OverviewField label={t('description')} value={campaignData?.description ?? '—'} />
    </div>
  );
}
