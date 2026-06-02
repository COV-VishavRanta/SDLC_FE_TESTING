'use client';

import { InfoCircleIcon } from '@/components';
import { useTranslations } from 'next-intl';

export default function NoCampaignSelectedCard() {
  const t = useTranslations('campaignManagement.importPromotions');
  return (
    <div className='flex items-center gap-4 rounded-lg bg-[#EBF5FB] px-5 py-4'>
      <div className='flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary'>
        <InfoCircleIcon className='size-5 text-white' />
      </div>
      <div className='flex flex-col gap-0.5'>
        <p className='text-[14px] font-semibold leading-[21px] text-[#005C8A]'>
          {t('noCampaignSelectedTitle')}
        </p>
        <p className='text-[13px] leading-[19.5px] text-[#005F8C]'>
          {t('noCampaignSelectedMessage')}
        </p>
      </div>
    </div>
  );
}
