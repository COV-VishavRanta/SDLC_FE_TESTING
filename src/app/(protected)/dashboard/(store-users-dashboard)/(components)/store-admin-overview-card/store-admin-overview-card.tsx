'use client';

import { PackageIcon, SurveyIcon, UploadIcon } from '@/components';
import { useGlobalProtected } from '@/contexts';
import {
  GET_STORE_ADMIN_OVERVIEW,
  GetStoreAdminOverviewResponse,
  GetStoreAdminOverviewVariables,
} from '@/graphql';
import { skipToken, useSuspenseQuery } from '@apollo/client/react';
import { useTranslations } from 'next-intl';

interface OverviewMetricProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  ariaLabel: string;
}

function OverviewMetric({ label, value, icon, ariaLabel }: OverviewMetricProps) {
  return (
    <div className='flex items-start justify-between rounded-lg border border-[var(--neutral-300)] bg-[var(--neutral-100)] p-6'>
      <div className='flex flex-col gap-2'>
        <span className='text-[14px] font-[var(--font-weight-medium)] leading-5 tracking-[-0.15px] text-[var(--neutral-500)]'>
          {label}
        </span>
        <span
          className='text-[32px] font-[var(--font-weight-semibold)] leading-normal text-[var(--neutral-900)]'
          aria-label={ariaLabel}
        >
          {value}
        </span>
      </div>
      <div
        className='flex size-12 shrink-0 items-center justify-center rounded-lg bg-[var(--primary-300)]'
        aria-hidden='true'
      >
        {icon}
      </div>
    </div>
  );
}

export default function StoreAdminOverviewCard() {
  const t = useTranslations('dashboard.store-admin-overview');
  const { selectedStoreId } = useGlobalProtected();

  const { data } = useSuspenseQuery<GetStoreAdminOverviewResponse, GetStoreAdminOverviewVariables>(
    GET_STORE_ADMIN_OVERVIEW,
    selectedStoreId ? { variables: { storeId: selectedStoreId } } : skipToken,
  );

  const ongoingCampaigns = data?.storeAdminOverview?.ongoingCampaigns ?? 0;
  const pendingSurveys = data?.storeAdminOverview?.pendingSurveys ?? 0;
  const pendingInstallations = data?.storeAdminOverview?.pendingInstallations ?? 0;

  return (
    <section aria-label={t('section-label')}>
      <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
        <OverviewMetric
          label={t('ongoing-campaigns')}
          value={ongoingCampaigns}
          icon={<PackageIcon className='size-6 text-[var(--primary-500)]' />}
          ariaLabel={`${ongoingCampaigns} ${t('ongoing-campaigns')}`}
        />

        <OverviewMetric
          label={t('pending-surveys')}
          value={pendingSurveys}
          icon={<SurveyIcon className='size-6 text-[var(--primary-500)]' />}
          ariaLabel={`${pendingSurveys} ${t('pending-surveys')}`}
        />

        <OverviewMetric
          label={t('pending-installations')}
          value={pendingInstallations}
          icon={<UploadIcon className='size-6 text-[var(--primary-500)]' />}
          ariaLabel={`${pendingInstallations} ${t('pending-installations')}`}
        />
      </div>
    </section>
  );
}
