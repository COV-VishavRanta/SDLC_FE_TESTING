import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const STAT_CARD_COUNT = 3;

/** Mirrors the StatCard layout for use as a Suspense/loading placeholder */
function StatCardSkeleton() {
  return (
    <Card className='flex flex-col gap-3 rounded-xl border border-border bg-white p-5 shadow-none'>
      <div className='flex items-center justify-between'>
        {/* Label */}
        <Skeleton className='h-[19px] w-28 rounded-md' />
        {/* Icon circle */}
        <Skeleton className='size-9 rounded-lg' />
      </div>
      {/* Value */}
      <Skeleton className='h-[42px] w-16 rounded-md' />
    </Card>
  );
}

/** Three-column skeleton grid matching the BrandStatCards layout */
export function BrandStatCardsSkeleton() {
  return (
    <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mt-6'>
      {Array.from({ length: STAT_CARD_COUNT }).map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
  );
}
