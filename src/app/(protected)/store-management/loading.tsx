import { PageRoot, Skeleton } from '@/components';
import { Card } from '@/components/ui/card';

import { StoreTableSkeleton } from './(components)/store-table/store-table.loading';

/** Loading skeleton for Store Management page */
export default function StoreManagementLoading() {
  return (
    <PageRoot>
      {/* Page Header with Create Store Button Skeleton */}
      <div className='flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex flex-col gap-2'>
          <Skeleton className='h-[42px] w-56 rounded-lg' />
          <Skeleton className='h-4 w-full max-w-96 rounded-full' />
        </div>
        <Skeleton className='h-[45px] w-[130px] rounded-lg' />
      </div>

      {/* Stat Cards Skeleton */}
      <div className='grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6'>
        {Array.from({ length: 3 }).map((_, index) => (
          <Card
            key={index}
            className='flex flex-col gap-3 rounded-xl border border-border bg-white p-5 shadow-none'
          >
            <div className='flex items-center justify-between'>
              <Skeleton className='h-[19px] w-28 rounded-md' />
              <Skeleton className='size-9 rounded-lg' />
            </div>
            <Skeleton className='h-[42px] w-16 rounded-md' />
          </Card>
        ))}
      </div>

      {/* Filters Skeleton (matches PageControls Card wrapper) */}
      <Card className='flex flex-col gap-3 rounded-xl border border-border bg-page-control p-4 shadow-none sm:flex-row sm:items-center sm:gap-4 sm:p-6'>
        <Skeleton className='h-10 flex-1 rounded-lg sm:h-[47px]' />
        <Skeleton className='h-10 w-[150px] rounded-lg sm:h-[47px]' />
        <Skeleton className='h-[47px] w-24 rounded-lg' />
      </Card>

      {/* Store Table Skeleton */}
      <StoreTableSkeleton />
    </PageRoot>
  );
}
