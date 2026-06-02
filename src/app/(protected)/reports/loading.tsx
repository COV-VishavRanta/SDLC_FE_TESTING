import { PageHeader, PageRoot } from '@/components';
import { Skeleton } from '@/components/ui/skeleton';

import { ReportTableSkeleton } from './(components)/report-table/ReportTable.loading';

export default function ReportsLoading() {
  return (
    <PageRoot>
      {/* Page Header Skeleton */}
      <PageHeader>
        <Skeleton className='h-8 w-48 rounded-full' />
        <Skeleton className='h-5 w-80 rounded-full' />
      </PageHeader>

      {/* Selector + Export Buttons Row Skeleton */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <Skeleton className='h-10 w-64 rounded-lg' />
        <div className='flex gap-2'>
          <Skeleton className='h-10 w-28 rounded-lg' />
          <Skeleton className='h-10 w-28 rounded-lg' />
        </div>
      </div>

      {/* Table Skeleton */}
      <ReportTableSkeleton />
    </PageRoot>
  );
}
