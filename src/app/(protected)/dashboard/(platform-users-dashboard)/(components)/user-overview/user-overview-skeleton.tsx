import { Card, CardContent, Skeleton } from '@/components';

/**
 * Skeleton loader for a single stat card
 */
export function StatCardSkeleton() {
  return (
    <Card className='rounded-md border border-[var(--neutral-300)] bg-[var(--neutral-100)] p-[15px] sm:rounded-lg sm:px-6 sm:py-6'>
      <CardContent className='flex items-start justify-between p-0'>
        <div className='flex flex-col gap-2'>
          <Skeleton className='h-5 w-24' />
          <Skeleton className='h-[30px] w-16 sm:h-[38px]' />
        </div>
        <Skeleton className='size-12 rounded-md sm:rounded-lg' />
      </CardContent>
    </Card>
  );
}

/**
 * Skeleton loader for the entire user overview section
 */
export function UserOverviewSkeleton() {
  return (
    <section className='flex min-w-0 flex-col gap-2 sm:gap-5' aria-hidden='true'>
      <Skeleton className='h-5 w-32' />
      <div className='grid min-w-0 grid-cols-2 gap-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-5'>
        {Array.from({ length: 5 }).map((_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </div>
    </section>
  );
}
