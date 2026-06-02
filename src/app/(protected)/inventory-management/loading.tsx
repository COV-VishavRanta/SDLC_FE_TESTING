import { PageRoot, Skeleton } from '@/components';

import { InventoryTableSkeleton } from './(components)/inventory-table/inventory-table.loading';

/** Loading skeleton for Inventory Management page */
export default function InventoryManagementLoading() {
  return (
    <PageRoot>
      {/* Page Header with Create Button Skeleton */}
      <div className='flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex flex-col gap-2'>
          <Skeleton className='h-[42px] w-64 rounded-lg' />
          <Skeleton className='h-4 w-full max-w-96 rounded-full' />
        </div>
        <Skeleton className='h-[45px] w-[150px] rounded-lg' />
      </div>

      {/* Filters Section Skeleton */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <Skeleton className='h-10 w-full rounded-lg sm:max-w-md' />
        <div className='flex gap-2'>
          <Skeleton className='h-10 w-36 rounded-lg' />
          <Skeleton className='h-10 w-36 rounded-lg' />
          <Skeleton className='h-10 w-20 rounded-lg' />
        </div>
      </div>

      {/* Inventory Table Skeleton */}
      <InventoryTableSkeleton />
    </PageRoot>
  );
}
