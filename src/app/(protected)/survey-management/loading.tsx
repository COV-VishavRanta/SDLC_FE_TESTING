import { PageRoot, Skeleton } from '@/components';

import { SurveyStatCardsSkeleton } from './(components)/survey-stat-cards/survey-stat-cards.loading';
import { SurveyTableSkeleton } from './(components)/survey-table/survey-table.loading';

export default function SurveyManagementLoading() {
  return (
    <PageRoot>
      {/* Page Header Skeleton */}
      <div className='flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex flex-col gap-2'>
          <Skeleton className='h-[42px] w-56 rounded-lg' />
          <Skeleton className='h-4 w-full max-w-96 rounded-full' />
        </div>
      </div>

      {/* Stat Cards Skeleton */}
      <SurveyStatCardsSkeleton />

      {/* Filters Skeleton */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <Skeleton className='h-10 w-full rounded-lg sm:max-w-md' />
        <div className='flex gap-2'>
          <Skeleton className='h-10 w-32 rounded-lg' />
          <Skeleton className='h-10 w-24 rounded-lg' />
        </div>
      </div>

      {/* Table Skeleton */}
      <SurveyTableSkeleton />
    </PageRoot>
  );
}
