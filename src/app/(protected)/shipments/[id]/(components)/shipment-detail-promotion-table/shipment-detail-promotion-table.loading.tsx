import { Card, Skeleton } from '@/components';

const PROMOTION_ROW_COUNT = 4;
const COLUMN_COUNT = 5;

export default function ShipmentDetailPromotionTableLoading() {
  return (
    <>
      {/* Section Header */}
      <div className='flex flex-wrap items-center gap-3'>
        <Skeleton className='h-[30px] w-64 rounded-md mr-auto' />
        <Skeleton className='h-[26px] w-28 rounded-full' />
        <Skeleton className='h-9 w-28 rounded-md' />
        <Skeleton className='h-9 w-24 rounded-md' />
      </div>
      {/* Promotions In Shipment Table */}
      <Card className='overflow-clip rounded-xl border border-border p-0 shadow-none'>
        {/* Header row */}
        <div className='flex items-center gap-4 border-b border-border bg-[var(--neutral-200)] px-4 py-3'>
          {Array.from({ length: COLUMN_COUNT }).map((_, i) => (
            <Skeleton key={i} className='h-[18px] flex-1 rounded-md' />
          ))}
        </div>
        {/* Data rows */}
        {Array.from({ length: PROMOTION_ROW_COUNT }).map((_, i) => (
          <div
            key={i}
            className='flex items-center gap-4 border-b border-border px-4 py-3 last:border-b-0'
          >
            <Skeleton className='h-[21px] flex-1 rounded-md' />
            <Skeleton className='h-[21px] w-12 rounded-md flex-shrink-0' />
            <Skeleton className='h-[44px] w-[130px] rounded-md flex-shrink-0' />
            <Skeleton className='h-[44px] w-[160px] rounded-md flex-shrink-0' />
            <Skeleton className='h-[44px] w-[130px] rounded-md flex-shrink-0' />
          </div>
        ))}
      </Card>
      {/* Footer actions */}
      <div className='flex justify-end gap-3'>
        <Skeleton className='h-9 w-20 rounded-md' />
        <Skeleton className='h-9 w-48 rounded-md' />
      </div>
    </>
  );
}
