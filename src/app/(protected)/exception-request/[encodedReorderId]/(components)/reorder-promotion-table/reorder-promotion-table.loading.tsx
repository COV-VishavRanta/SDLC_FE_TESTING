import { Card, Skeleton } from '@/components';

const PROMOTION_ROW_COUNT = 4;
const COLUMN_COUNT = 5;

export default function ReorderPromotionTableLoading() {
  return (
    <>
      {/* Section Header */}
      <div className='flex flex-wrap items-center gap-3'>
        <Skeleton className='mr-auto h-[30px] w-64 rounded-md' />
        <Skeleton className='h-9 w-[260px] rounded-md' />
        <Skeleton className='h-[26px] w-28 rounded-full' />
      </div>

      {/* Table */}
      <Card className='overflow-clip rounded-xl border border-border p-0 shadow-none'>
        <div className='flex items-center gap-4 border-b border-border bg-[var(--neutral-200)] px-4 py-3'>
          {Array.from({ length: COLUMN_COUNT }).map((_, i) => (
            <Skeleton key={i} className='h-[18px] flex-1 rounded-md' />
          ))}
        </div>
        {Array.from({ length: PROMOTION_ROW_COUNT }).map((_, i) => (
          <div
            key={i}
            className='flex items-center gap-4 border-b border-border px-4 py-3 last:border-b-0'
          >
            <Skeleton className='h-[21px] flex-1 rounded-md' />
            <Skeleton className='h-[21px] w-12 flex-shrink-0 rounded-md' />
            <Skeleton className='h-[21px] w-12 flex-shrink-0 rounded-md' />
            <Skeleton className='h-[21px] w-24 flex-shrink-0 rounded-md' />
            <Skeleton className='h-[21px] w-12 flex-shrink-0 rounded-md' />
          </div>
        ))}
      </Card>
    </>
  );
}
