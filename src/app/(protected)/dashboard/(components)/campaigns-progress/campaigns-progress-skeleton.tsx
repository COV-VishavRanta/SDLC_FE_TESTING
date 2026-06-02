import { Card, Skeleton } from '@/components';

/* ─── Skeleton ─── */
export function CampaignsProgressSkeleton() {
  return (
    <Card
      className='rounded-[8px] border border-[var(--neutral-300)] bg-[var(--neutral-100)] p-6'
      aria-busy='true'
      aria-label='Loading campaigns progress'
    >
      <span className='sr-only' role='status'>
        Loading campaigns progress
      </span>
      <Skeleton className='mb-5 h-5 w-40' aria-hidden='true' />
      <div className='flex gap-5 overflow-hidden' aria-hidden='true'>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className='flex w-[320px] shrink-0 flex-col rounded-[12px] border border-[var(--neutral-300)] bg-[var(--neutral-200)] p-6'
          >
            <div className='flex w-full flex-col gap-5'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <Skeleton className='size-8 rounded-[6px]' />
                  <Skeleton className='h-5 w-20' />
                </div>
                <Skeleton className='size-7 rounded-md' />
              </div>
              <div className='flex flex-col gap-2'>
                <Skeleton className='h-[72px] w-full rounded-[8px]' />
                <Skeleton className='h-[72px] w-full rounded-[8px]' />
              </div>
              <Skeleton className='h-[48px] w-full rounded-[8px]' />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
