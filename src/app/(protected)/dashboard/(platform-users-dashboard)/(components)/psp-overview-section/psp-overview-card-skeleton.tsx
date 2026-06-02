import { Card, CardContent, CardHeader, Skeleton } from '@/components';

/**
 * Skeleton loader for PSP overview card
 */
export function PspOverviewCardSkeleton() {
  return (
    <Card
      className='border border-[var(--neutral-300)] bg-[var(--neutral-100)] p-0'
      aria-hidden='true'
    >
      <CardHeader className='flex flex-row items-center justify-between border-b border-[var(--neutral-300)] px-[15px] py-[15px] sm:px-6 sm:py-6'>
        <Skeleton className='h-5 w-32' />
        <Skeleton className='h-5 w-24' />
      </CardHeader>
      <CardContent className='flex flex-col gap-5 px-[15px] py-[15px] sm:px-6 sm:py-6'>
        {/* Total PSPs row */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Skeleton className='size-10 rounded-lg' />
            <div className='flex flex-col gap-1'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-3 w-20' />
            </div>
          </div>
          <Skeleton className='h-10 w-12' />
        </div>

        {/* Active row */}
        <div className='flex items-center justify-between'>
          <Skeleton className='h-5 w-24' />
          <Skeleton className='h-5 w-8' />
        </div>

        {/* Inactive row */}
        <div className='flex items-center justify-between'>
          <Skeleton className='h-5 w-28' />
          <Skeleton className='h-5 w-8' />
        </div>
      </CardContent>
    </Card>
  );
}
