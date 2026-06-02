import { PageRoot, Skeleton } from '@/components';

const STAT_COUNT = 4;
const TABLE_ROW_COUNT = 8;

function StatCardSkeleton() {
  return (
    <div className='flex flex-col gap-3 rounded-xl border border-border bg-white p-5 shadow-none'>
      <div className='flex items-center justify-between'>
        <Skeleton className='h-[19px] w-28 rounded-md' />
        <Skeleton className='size-9 rounded-lg' />
      </div>
      <Skeleton className='h-[42px] w-16 rounded-md' />
    </div>
  );
}

function TableHeaderSkeleton() {
  return (
    <div className='flex items-center gap-4 border-b border-border bg-muted/30 px-4 py-3'>
      <Skeleton className='h-4 w-32 rounded-md' />
      <Skeleton className='h-4 w-40 rounded-md' />
      <Skeleton className='h-4 w-24 rounded-md' />
      <Skeleton className='h-4 w-20 rounded-md' />
      <Skeleton className='h-4 w-28 rounded-md' />
    </div>
  );
}

function TableRowSkeleton() {
  return (
    <div className='flex items-center gap-4 border-b border-border px-4 py-[22px] last:border-0'>
      <Skeleton className='h-6 w-32 rounded-full' />
      <Skeleton className='h-6 w-40 rounded-full' />
      <Skeleton className='h-6 w-24 rounded-full' />
      <Skeleton className='h-6 w-20 rounded-full' />
      <Skeleton className='h-6 w-28 rounded-full' />
    </div>
  );
}

export default function ProtectedLoading() {
  return (
    <PageRoot>
      {/* Page Header Skeleton */}
      <div className='flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex flex-col gap-2'>
          <Skeleton className='h-[42px] w-56 rounded-lg' />
          <Skeleton className='h-4 w-full max-w-96 rounded-full' />
        </div>
        <Skeleton className='h-[45px] w-[130px] rounded-lg' />
      </div>

      {/* Stat Cards Skeleton */}
      <div className='grid grid-cols-2 gap-5 sm:grid-cols-2 xl:grid-cols-4 mt-6'>
        {Array.from({ length: STAT_COUNT }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Filters Skeleton */}
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

      {/* Table Skeleton */}
      <div className='overflow-hidden rounded-lg border border-border'>
        <TableHeaderSkeleton />
        {Array.from({ length: TABLE_ROW_COUNT }).map((_, i) => (
          <TableRowSkeleton key={i} />
        ))}
      </div>
    </PageRoot>
  );
}
