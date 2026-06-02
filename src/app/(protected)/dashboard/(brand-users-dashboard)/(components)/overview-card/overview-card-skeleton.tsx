import { Card, CardContent, Skeleton } from '@/components';

/* ─── Skeleton ─── */
export default function OverviewCardsSkeleton() {
  return (
    <section
      className='grid grid-cols-2 gap-2 sm:gap-5'
      aria-label='Overview loading'
      aria-hidden='true'
    >
      {Array.from({ length: 2 }).map((_, i) => (
        <Card
          key={i}
          className='border border-[var(--neutral-300)] bg-[var(--neutral-100)] p-[15px] sm:px-6 sm:py-6'
        >
          <CardContent className='flex items-start justify-between p-0'>
            <div className='flex flex-col gap-2'>
              <Skeleton className='h-5 w-32' />
              <Skeleton className='h-10 w-16' />
            </div>
            <Skeleton className='size-12 rounded-lg' />
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
