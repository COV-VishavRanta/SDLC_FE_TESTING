import { Skeleton } from '@/components';

export default function CreateTemplateLoading() {
  return (
    <div className='flex min-h-screen flex-col gap-5 bg-[var(--neutral-200)] p-4 sm:p-6 lg:p-8'>
      {/* Back Link Skeleton */}
      <Skeleton className='h-6 w-64' />

      {/* Header Section */}
      <div className='flex flex-col gap-12'>
        {/* Title and Actions */}
        <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
          <Skeleton className='h-10 w-64' />
          <div className='flex gap-3'>
            <Skeleton className='h-12 w-28' />
            <Skeleton className='h-12 w-40' />
          </div>
        </div>

        {/* Main Content */}
        <div className='flex flex-col gap-5 lg:flex-row'>
          {/* Left Column */}
          <div className='flex flex-1 flex-col gap-5'>
            <Skeleton className='h-6 w-40' />
            <Skeleton className='h-64 w-full rounded-xl' />
            <Skeleton className='h-6 w-32' />
            <Skeleton className='h-96 w-full rounded-xl' />
          </div>

          {/* Right Column */}
          <div className='flex flex-col gap-5 lg:w-[404px]'>
            <Skeleton className='h-6 w-40' />
            <Skeleton className='h-64 w-full rounded-xl' />
          </div>
        </div>
      </div>
    </div>
  );
}
