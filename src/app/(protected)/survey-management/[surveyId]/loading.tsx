import { Skeleton } from '@/components';

export default function SurveyDetailLoading() {
  return (
    <div
      aria-busy='true'
      aria-label='Loading survey details'
      className='flex min-h-screen min-w-0 flex-col gap-5 overflow-x-hidden bg-[var(--neutral-200)] p-4 sm:p-6 lg:p-8'
    >
      {/* Back link */}
      <Skeleton className='h-5 w-44' />

      {/* Title + button row */}
      <div className='flex items-start justify-between gap-4'>
        <div className='flex flex-col gap-2'>
          <Skeleton className='h-9 w-80' />
          <Skeleton className='h-4 w-96' />
        </div>
        <Skeleton className='h-12 w-36 shrink-0 rounded-lg' />
      </div>

      {/* Section heading */}
      <Skeleton className='h-6 w-52' />

      {/* Brand accordion bars */}
      <div className='overflow-hidden rounded-xl border border-[var(--neutral-300)]'>
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className='flex items-center justify-between border-b border-[var(--neutral-300)] bg-white px-5 py-[18px] last:border-b-0'
          >
            <Skeleton className='h-5 w-28' />
            <Skeleton className='size-4' />
          </div>
        ))}
      </div>
    </div>
  );
}
