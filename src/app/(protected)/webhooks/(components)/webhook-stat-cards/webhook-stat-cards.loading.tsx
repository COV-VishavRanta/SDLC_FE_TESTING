import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const STAT_CARD_COUNT = 3;

function StatCardSkeleton() {
  return (
    <Card className='flex flex-col gap-3 rounded-xl border border-border bg-white p-5 shadow-none'>
      <div className='flex items-center justify-between'>
        <Skeleton className='h-[19px] w-28 rounded-md' />
        <Skeleton className='size-9 rounded-lg' />
      </div>
      <Skeleton className='h-[42px] w-16 rounded-md' />
    </Card>
  );
}

export function WebhookStatCardsSkeleton() {
  return (
    <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mt-6'>
      {Array.from({ length: STAT_CARD_COUNT }).map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
  );
}
