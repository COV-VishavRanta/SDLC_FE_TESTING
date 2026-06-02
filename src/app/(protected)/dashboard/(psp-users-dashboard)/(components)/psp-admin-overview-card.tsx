'use client';

import { Card, CardContent, CardHeader, CardTitle, PackageIcon } from '@/components';
import { useGlobalProtected } from '@/contexts';
import { GET_PSP_OVERVIEW, GetPspOverviewVariables, PspOverviewResponse } from '@/graphql';
import { skipToken, useSuspenseQuery } from '@apollo/client/react';
import { useTranslations } from 'next-intl';

export default function PspAdminOverviewCard() {
  const t = useTranslations('dashboard.psp-admin-overview');
  const { selectedPspId } = useGlobalProtected();

  const { data } = useSuspenseQuery<PspOverviewResponse, GetPspOverviewVariables>(
    GET_PSP_OVERVIEW,
    selectedPspId ? { variables: { pspId: selectedPspId } } : skipToken,
  );

  const activeCampaigns = data?.pspOverview?.activeCampaigns ?? 0;

  return (
    <Card className='border border-[var(--neutral-300)] bg-[var(--neutral-100)] p-[15px] sm:px-6 sm:py-6'>
      <CardHeader className='gap-0 p-0 pb-5'>
        <CardTitle className='text-[16px] font-[var(--font-weight-medium)] leading-5 tracking-[-0.15px] text-[var(--neutral-900)]'>
          {t('title')}
        </CardTitle>
      </CardHeader>
      <CardContent className='p-0'>
        <div className='flex items-center justify-between rounded-xl border border-[var(--neutral-200)] bg-white p-5'>
          {/* Metric text */}
          <div className='flex flex-col gap-1'>
            <span
              className='text-[40px] font-[var(--font-weight-bold)] leading-none text-[var(--neutral-900)]'
              aria-label={`${activeCampaigns} ${t('ongoing-campaigns')}`}
            >
              {activeCampaigns}
            </span>
            <span
              className='text-[14px] font-[var(--font-weight-regular)] leading-5 tracking-[-0.15px] text-[var(--neutral-500)]'
              aria-hidden='true'
            >
              {t('ongoing-campaigns')}
            </span>
          </div>

          {/* Icon */}
          <div
            className='flex size-14 items-center justify-center rounded-xl bg-[var(--primary-100)]'
            aria-hidden='true'
          >
            <PackageIcon className='size-7 text-[var(--primary-500)]' />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
