import { PageRoot, Skeleton } from '@/components';

import { BrandStatCardsSkeleton } from './(components)/brand-stat-cards/brand-stat-cards.loading';
import { BrandTableSkeleton } from './(components)/brand-table/brand-table.loading';

/** Loading skeleton for Brand Management page */
export default function BrandManagementLoading() {
  return (
    <PageRoot>
      {/* Page Header with Create Brand Button Skeleton */}
      <div className='flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex flex-col gap-2'>
          <Skeleton className='h-[42px] w-56 rounded-lg' />
          <Skeleton className='h-4 w-full max-w-96 rounded-full' />
        </div>
        <Skeleton className='h-[45px] w-[130px] rounded-lg' />
      </div>

      {/* Stat Cards Skeleton */}
      <BrandStatCardsSkeleton />

      {/* Filters Section Skeleton */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div className='flex flex-1 flex-col gap-2'>
          <Skeleton className='h-5 w-24 rounded-md' />
          <Skeleton className='h-10 w-full rounded-lg sm:max-w-md' />
        </div>
        <div className='flex gap-2'>
          <Skeleton className='h-10 w-32 rounded-lg' />
          <Skeleton className='h-10 w-32 rounded-lg' />
        </div>
      </div>

      {/* Brands Table Skeleton */}
      <BrandTableSkeleton />
    </PageRoot>
  );
}
