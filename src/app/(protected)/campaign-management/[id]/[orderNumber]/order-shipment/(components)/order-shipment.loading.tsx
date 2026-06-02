// ─── Skeleton ─────────────────────────────────────────────────────────────────

import { Card, CardContent, CardHeader, PageRoot, Skeleton } from '@/components';

const SKELETON_TABLE_ROWS = 6;
const SKELETON_TABLE_COLS = 5;

export default function OrderShipmentSkeleton() {
  return (
    <PageRoot>
      {/* Back link */}
      <Skeleton className='h-5 w-52' />

      {/* Page heading */}
      <div className='flex flex-col gap-2'>
        <Skeleton className='h-[42px] w-56 rounded-lg' />
        <Skeleton className='h-4 w-36 rounded-full' />
      </div>

      {/* Shipment Details card (matching Figma 32px/24px padding) */}
      <Card className='rounded-xl p-0'>
        <CardHeader className='px-8 pt-6 pb-0'>
          <Skeleton className='h-5 w-40' />
        </CardHeader>
        <CardContent className='flex flex-col gap-5 px-8 pt-5 pb-6'>
          <div className='grid grid-cols-2 gap-5 sm:grid-cols-2'>
            <div className='flex flex-col gap-2'>
              <Skeleton className='h-4 w-36' />
              <Skeleton className='h-[var(--input-height)] w-full rounded-[var(--input-radius)]' />
            </div>
            <div className='flex flex-col gap-2'>
              <Skeleton className='h-4 w-44' />
              <Skeleton className='h-[var(--input-height)] w-full rounded-[var(--input-radius)]' />
            </div>
          </div>
          <div className='flex flex-col gap-2'>
            <Skeleton className='h-4 w-48' />
            <Skeleton className='min-h-[89px] w-full rounded-[var(--input-radius)]' />
          </div>
        </CardContent>
      </Card>

      {/* Promotions Pending Shipment section (no Card wrapper per Figma) */}
      <div className='flex flex-col gap-3'>
        {/* Heading row */}
        <div className='flex items-center justify-between'>
          <Skeleton className='h-5 w-56' />
          <Skeleton className='h-10 w-28 rounded-lg' />
        </div>

        {/* Table skeleton */}
        <div className='overflow-hidden rounded-lg border border-border'>
          {/* Header row */}
          <div className='flex items-center gap-4 bg-[var(--table-header-bg)] px-6 py-3'>
            <Skeleton className='h-3 w-[38%] min-w-[200px]' />
            <Skeleton className='h-3 w-[15%] min-w-[80px]' />
            <Skeleton className='h-3 w-[15%] min-w-[80px]' />
            <Skeleton className='h-3 w-[15%] min-w-[80px]' />
            <Skeleton className='h-3 w-[17%] min-w-[80px]' />
          </div>
          {/* Data rows */}
          {Array.from({ length: SKELETON_TABLE_ROWS }).map((_, rowIdx) => (
            <div key={rowIdx} className='flex items-center gap-4 border-t border-border px-6 py-3'>
              <Skeleton className='h-4 w-[38%] min-w-[200px]' />
              {Array.from({ length: SKELETON_TABLE_COLS - 1 }).map((_, colIdx) => (
                <Skeleton key={colIdx} className='h-4 w-[15%] min-w-[80px]' />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Footer actions */}
      <div className='flex items-center justify-end gap-5'>
        <Skeleton className='h-10 w-24 rounded-[10px]' />
        <Skeleton className='h-10 w-40 rounded-[10px]' />
      </div>
    </PageRoot>
  );
}
