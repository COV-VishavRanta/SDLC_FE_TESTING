import { PageRoot, Skeleton } from '@/components';
import LogTableLoading from './(components)/log-listing/log-table.loading';

export default function AuditLogsLoading() {
  return (
    <PageRoot>
      {/* Page Header skeleton */}
      <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8'>
        <div className='space-y-2'>
          <Skeleton className='h-[42px] w-56 rounded-lg' />
          <Skeleton className='h-4 max-w-80 w-full rounded-full' />
        </div>
        <Skeleton className='h-[63px] w-44 rounded-lg' />
      </div>

      {/* Filters skeleton */}
      <div className='flex flex-col gap-3'>
        <div className='flex gap-3'>
          <Skeleton className='h-10 flex-1 rounded-lg' />
          <Skeleton className='h-10 w-28 rounded-lg' />
        </div>
      </div>

      {/* Log listing skeleton */}
      <LogTableLoading />
    </PageRoot>
  );
}
