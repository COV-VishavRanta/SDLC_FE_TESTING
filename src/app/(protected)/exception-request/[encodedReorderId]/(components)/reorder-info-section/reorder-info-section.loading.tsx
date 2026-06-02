import { Skeleton } from '@/components';

const INFO_CARD_COUNT = 4;

function InfoCardSkeleton() {
  return (
    <div className='flex flex-1 flex-col gap-2 rounded-xl border border-border bg-white px-6 py-5'>
      <Skeleton className='h-[12px] w-24 rounded-sm' />
      <Skeleton className='h-[20px] w-40 rounded-md' />
    </div>
  );
}

export default function ReorderInfoSectionLoading() {
  return (
    <div className='flex flex-col gap-3 rounded-lg border border-border bg-[var(--neutral-200)] p-5'>
      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
        {Array.from({ length: INFO_CARD_COUNT / 2 }).map((_, i) => (
          <InfoCardSkeleton key={i} />
        ))}
      </div>
      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
        {Array.from({ length: INFO_CARD_COUNT / 2 }).map((_, i) => (
          <InfoCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
