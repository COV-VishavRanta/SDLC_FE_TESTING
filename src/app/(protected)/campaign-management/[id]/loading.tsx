import { PageRoot, Skeleton } from '@/components';

/* ── Campaign Details Loading State ── */
export default function CampaignDetailsLoading() {
  return (
    <PageRoot>
      {/* ── Back Link Skeleton ── */}
      <div className='flex justify-between'>
        <div className='flex flex-col gap-4'>
          <Skeleton className='h-5 w-40 rounded-full' />

          {/* Title + Status */}
          <div className='flex flex-col gap-2'>
            <Skeleton className='h-10 w-72 rounded-lg' />
            <div className='flex items-center gap-3'>
              <Skeleton className='h-8 w-28 rounded-full' />
              <Skeleton className='h-5 w-36 rounded-full' />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex items-center gap-3'>
          <Skeleton className='h-[38px] w-16 rounded-lg' />
          <Skeleton className='h-[38px] w-20 rounded-lg' />
        </div>
      </div>

      {/* ── Tabs Skeleton ── */}
      <div className='mt-4 flex gap-6 border-b border-border pb-0'>
        <Skeleton className='h-9 w-20 rounded-md' />
        <Skeleton className='h-9 w-16 rounded-md' />
      </div>

      {/* ── Info Cards Skeleton ── */}
      <div className='mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4'>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className='flex flex-col gap-2 rounded-xl border border-border bg-white p-[21px]'
          >
            <Skeleton className='h-3.5 w-28 rounded-full' />
            <Skeleton className='h-6 w-36 rounded-full' />
          </div>
        ))}
      </div>

      {/* ── Overview Card Skeleton ── */}
      <div className='flex flex-col gap-5 rounded-xl border border-border bg-white p-[25px]'>
        <div className='flex flex-col gap-2'>
          <Skeleton className='h-3.5 w-20 rounded-full' />
          <Skeleton className='h-5 w-64 rounded-full' />
        </div>
        <div className='flex flex-col gap-2'>
          <Skeleton className='h-3.5 w-24 rounded-full' />
          <Skeleton className='h-5 w-96 rounded-full' />
          <Skeleton className='h-5 w-72 rounded-full' />
        </div>
      </div>

      {/* ── Promotions Table Skeleton ── */}
      <div className='flex flex-col gap-4'>
        {/* Section Header */}
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <Skeleton className='h-7 w-40 rounded-full' />
          <div className='flex items-center gap-2 sm:gap-3'>
            <Skeleton className='h-[43px] w-48 rounded-lg' />
            <Skeleton className='h-[41px] w-40 rounded-lg' />
          </div>
        </div>

        {/* Table Card */}
        <div className='overflow-hidden rounded-xl border border-border bg-white'>
          {/* Header Row */}
          <div className='flex h-[50px] items-center gap-4 border-b border-border bg-input-bg px-5'>
            <Skeleton className='h-3.5 w-40 rounded-full' />
            <Skeleton className='h-3.5 w-16 rounded-full ml-auto' />
            <Skeleton className='h-3.5 w-24 rounded-full' />
            <Skeleton className='h-3.5 w-20 rounded-full' />
            <Skeleton className='h-3.5 w-16 rounded-full' />
          </div>

          {/* Body Rows */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className='flex h-[77px] items-center gap-4 border-b border-border px-5 last:border-b-0'
            >
              <Skeleton className='h-4 w-48 rounded-full' />
              <Skeleton className='h-4 w-10 rounded-full ml-auto' />
              <Skeleton className='h-4 w-10 rounded-full' />
              <Skeleton className='h-5 w-10 rounded-full' />
              <div className='flex gap-1'>
                <Skeleton className='size-8 rounded-lg' />
                <Skeleton className='size-8 rounded-lg' />
                <Skeleton className='size-8 rounded-lg' />
              </div>
            </div>
          ))}

          {/* Footer */}
          <div className='flex h-[60px] items-center justify-between border-t border-border bg-input-bg px-5'>
            <Skeleton className='h-4 w-32 rounded-full' />
            <Skeleton className='h-8 w-40 rounded-lg' />
          </div>
        </div>
      </div>
    </PageRoot>
  );
}
