import { Card, PageRoot, Skeleton } from '@/components';

import { ImportPromotionsTableSkeleton } from './(components)/import-promotions-table/import-promotions-table.loading';

export default function ImportPromotionsLoading() {
  return (
    <PageRoot>
      {/* Back link skeleton */}
      <Skeleton className='h-5 w-36 rounded-full' />

      {/* Page title skeleton */}
      <Skeleton className='h-9 w-72 rounded-full' />

      <Card className='flex flex-col gap-6 rounded-xl border border-border p-6'>
        {/* ── Destination Campaign skeleton ── */}
        <div className='rounded-lg bg-[#EBF5FB] p-4'>
          <Skeleton className='h-3 w-48 rounded-full' />
          <Skeleton className='mt-2 h-6 w-64 rounded-full' />
        </div>

        {/* ── Import Action skeleton ── */}
        <div className='flex flex-col gap-3'>
          <Skeleton className='h-5 w-40 rounded-full' />
          <div className='grid grid-cols-2 gap-4'>
            {/* Copy card skeleton */}
            <div className='flex items-start gap-3 rounded-lg border border-border p-4'>
              <Skeleton className='mt-0.5 size-4 shrink-0 rounded-full' />
              <div className='flex flex-col gap-2 flex-1'>
                <Skeleton className='h-5 w-24 rounded-full' />
                <Skeleton className='h-4 w-full rounded-full' />
                <Skeleton className='h-4 w-3/4 rounded-full' />
              </div>
            </div>
            {/* Replace card skeleton */}
            <div className='flex items-start gap-3 rounded-lg border border-border p-4'>
              <Skeleton className='mt-0.5 size-4 shrink-0 rounded-full' />
              <div className='flex flex-col gap-2 flex-1'>
                <Skeleton className='h-5 w-24 rounded-full' />
                <Skeleton className='h-4 w-full rounded-full' />
                <Skeleton className='h-4 w-3/4 rounded-full' />
              </div>
            </div>
          </div>
        </div>

        {/* ── Source Campaign skeleton ── */}
        <div className='flex flex-col gap-2'>
          <Skeleton className='h-5 w-44 rounded-full' />
          <Skeleton className='h-[var(--input-height)] w-full max-w-xs rounded-lg' />
        </div>

        {/* ── Promotions Table skeleton ── */}
        <div className='flex flex-col gap-4'>
          <div className='flex items-center justify-between gap-4'>
            <Skeleton className='h-7 w-48 rounded-full' />
            <Skeleton className='h-9 w-[260px] rounded-lg' />
          </div>
          <ImportPromotionsTableSkeleton />
        </div>

        {/* ── Action Buttons skeleton ── */}
        <div className='flex justify-end gap-3'>
          <Skeleton className='h-9 w-24 rounded-lg' />
          <Skeleton className='h-9 w-40 rounded-lg' />
        </div>
      </Card>
    </PageRoot>
  );
}
