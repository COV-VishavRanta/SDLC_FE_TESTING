import { PageRoot, Skeleton } from '@/components';

import { StoreDistributionTableSkeleton } from './(components)/store-distribution-table.loading';

export default function StoreDistributionSkeleton() {
  return (
    <PageRoot>
      {/* Back link skeleton */}
      <Skeleton className='h-5 w-40 rounded-full' />

      {/* Header skeleton */}
      <div className='flex flex-col gap-2'>
        <Skeleton className='h-8 w-64 rounded-full' />
        <Skeleton className='h-5 w-40 rounded-full' />
      </div>

      {/* Instruction + search row skeleton */}
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <Skeleton className='h-5 w-3/4 rounded-full' />
        <Skeleton className='h-9 w-full rounded-lg sm:w-[260px]' />
      </div>

      {/* Table skeleton */}
      <StoreDistributionTableSkeleton />

      {/* Total quantity row skeleton */}
      <div className='flex items-center justify-between rounded-xl border border-border bg-muted px-6 py-4'>
        <Skeleton className='h-5 w-28 rounded-full' />
        <Skeleton className='h-7 w-10 rounded-full' />
      </div>

      {/* Buttons skeleton */}
      <div className='flex justify-end gap-3'>
        <Skeleton className='h-9 w-24 rounded-lg' />
        <Skeleton className='h-9 w-36 rounded-lg' />
      </div>
    </PageRoot>
  );
}
