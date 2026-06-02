'use client';

import { isValidDate } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { useContext } from 'react';

import { InfoCard } from '@/components';
import { UserRole } from '@/constant';
import { usePermissions } from '@/hooks';
import { CampaignDetailsContext } from '../../context/CampaignDetailsContext';

export function DetailInfoCards() {
  const { campaignData, formatDate } = useContext(CampaignDetailsContext);
  const t = useTranslations('campaignManagement.details.infoCards');

  const { role } = usePermissions();
  const isPSPAdmin = role === UserRole.PSP_ADMIN;

  return (
    <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:flex lg:gap-5'>
      {isPSPAdmin && <InfoCard label={t('brandName')} value={campaignData?.brandName ?? '—'} />}
      <InfoCard label={t('campaignManager')} value={campaignData?.campaignManager?.name ?? '—'} />
      <InfoCard
        label={t('startDate')}
        value={
          isValidDate(campaignData?.startDate ?? '')
            ? (formatDate(campaignData?.startDate) ?? '—')
            : '—'
        }
      />
      <InfoCard
        label={t('endDate')}
        value={
          isValidDate(campaignData?.endDate ?? '')
            ? (formatDate(campaignData?.endDate) ?? '—')
            : '—'
        }
      />
      <InfoCard label={t('expectedShipBy')} value={formatDate(campaignData?.shipByDate) ?? '—'} />
    </div>
  );
}
