// ─── Skeleton ─────────────────────────────────────────────────────────────────

import { PageRoot, Skeleton } from '@/components';

const SKELETON_TABLE_ROWS = 6;

export default function InstallationProofSkeleton() {
  return (
    <PageRoot>
      {/* Back link */}
      <Skeleton className='h-5 w-52' />

      {/* Page heading */}
      <div className='flex flex-col gap-2'>
        <Skeleton className='h-[42px] w-64 rounded-lg' />
        <Skeleton className='h-4 w-40 rounded-full' />
      </div>

      {/* Top action bar: search + batch action buttons */}
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <Skeleton className='h-10 w-full max-w-sm rounded-lg' />
        <div className='flex shrink-0 items-center gap-2'>
          <Skeleton className='h-[38px] w-32 rounded-lg' />
          <Skeleton className='h-[38px] w-32 rounded-lg' />
        </div>
      </div>

      {/* Table skeleton */}
      <div className='overflow-clip rounded-xl border border-border'>
        {/* Header row */}
        <div className='flex items-center gap-4 bg-[var(--table-header-bg)] px-6 py-3'>
          <Skeleton className='h-4 w-4 rounded' />
          <Skeleton className='h-3 w-[38%] min-w-[160px]' />
          <Skeleton className='h-3 w-[15%] min-w-[80px]' />
          <Skeleton className='h-3 w-[15%] min-w-[80px]' />
          <Skeleton className='h-3 w-[15%] min-w-[80px]' />
        </div>

        {/* Data rows */}
        {Array.from({ length: SKELETON_TABLE_ROWS }).map((_, rowIdx) => (
          <div key={rowIdx} className='flex items-center gap-4 border-t border-border px-6 py-4'>
            <Skeleton className='h-4 w-4 rounded' />
            <div className='flex w-[38%] min-w-[160px] flex-col gap-1'>
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-3 w-2/3' />
            </div>
            <Skeleton className='h-4 w-[15%] min-w-[80px]' />
            <Skeleton className='h-6 w-[15%] min-w-[80px] rounded-full' />
            <div className='flex w-[15%] min-w-[80px] items-center gap-1'>
              <Skeleton className='h-8 w-8 rounded-md' />
              <Skeleton className='h-8 w-8 rounded-md' />
              <Skeleton className='h-8 w-8 rounded-md' />
            </div>
          </div>
        ))}
      </div>

      {/* Footer: pagination + submit */}
      <div className='flex items-center justify-between'>
        <Skeleton className='h-4 w-40 rounded-full' />
        <div className='flex items-center gap-2'>
          <Skeleton className='h-8 w-8 rounded-md' />
          <Skeleton className='h-8 w-8 rounded-md' />
          <Skeleton className='h-8 w-8 rounded-md' />
          <Skeleton className='h-8 w-8 rounded-md' />
        </div>
        <Skeleton className='h-10 w-36 rounded-lg' />
      </div>
    </PageRoot>
  );
}
