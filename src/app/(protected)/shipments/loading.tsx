import { PageHeader, PageRoot } from '@/components';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { ShipmentStatCardsSkeleton } from './(components)/shipment-stat-cards/shipment-stat-cards.loading';
import { ShipmentTableSkeleton } from './(components)/shipment-table/shipment-table.loading';

export default function ShipmentsLoading() {
  return (
    <PageRoot>
      {/* Page Header */}
      <PageHeader>
        <Skeleton className='h-[42px] w-44 rounded-lg' />
        <Skeleton className='mt-1 h-[21px] w-80 rounded-md' />
      </PageHeader>

      {/* Stat Cards */}
      <ShipmentStatCardsSkeleton />

      {/* Filters */}
      <Card className='flex flex-col gap-3 rounded-xl border border-border bg-page-control p-4 shadow-none sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 sm:p-6'>
        {/* Search */}
        <Skeleton className='h-10 w-full flex-1 rounded-lg sm:h-[47px]' />
        {/* Campaign select */}
        <Skeleton className='h-10 w-full rounded-lg sm:h-[40.5px] wide:w-[180px]' />
        {/* Store select */}
        <Skeleton className='h-10 w-full rounded-lg sm:h-[40.5px] wide:w-[160px]' />
        {/* Status select */}
        <Skeleton className='h-10 w-full rounded-lg sm:h-[40.5px] wide:w-[155px]' />
        {/* Reset button */}
        <Skeleton className='h-10 w-full rounded-lg sm:h-[47px] wide:w-24' />
      </Card>

      {/* Table */}
      <ShipmentTableSkeleton />
    </PageRoot>
  );
}
