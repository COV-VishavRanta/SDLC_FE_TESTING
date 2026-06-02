'use client';

import { PageDescription, PageHeader, PageRoot, PageTitle, Skeleton } from '@/components';
import { UserRole } from '@/constant/enums/user.enums';
import { usePermissions } from '@/hooks';
import { useTranslations } from 'next-intl';

import { CampaignTableSkeleton } from './(components)/campaign-table/campaign-table.loading';

/* ── Page Loading State ── */
export default function CampaignManagementLoading() {
  const t = useTranslations('campaignManagement.loading');
  const { role } = usePermissions();
  const isPspAdmin = role === UserRole.PSP_ADMIN;

  return (
    <PageRoot>
      {/* Page Header */}
      <div className='flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <PageHeader>
          <PageTitle className='font-semibold text-text-heading'>
            {isPspAdmin ? t('pspAdmin.title') : t('title')}
          </PageTitle>
          <PageDescription>
            {isPspAdmin ? t('pspAdmin.description') : t('description')}
          </PageDescription>
        </PageHeader>
        <Skeleton className='h-10 w-44' />
      </div>

      {/* Filters Skeleton */}
      <div className='flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex flex-1 gap-3'>
          <Skeleton className='h-10 max-w-md flex-1' />
          <Skeleton className='h-10 w-32' />
          <Skeleton className='h-10 w-32' />
        </div>
      </div>

      {/* Campaign List Skeleton */}
      <div className='flex flex-col gap-4'>
        <CampaignTableSkeleton />
      </div>
    </PageRoot>
  );
}
