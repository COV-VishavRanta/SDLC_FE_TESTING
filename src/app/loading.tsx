import { Skeleton } from '@/components';

export default function RootLoading() {
  return (
    <div className='min-h-screen bg-background'>
      <div className='container mx-auto px-4 py-12'>
        <div className='mb-8 flex items-center justify-between'>
          <div className='flex flex-col gap-2'>
            <Skeleton className='h-9 w-64' />
            <Skeleton className='h-5 w-48' />
          </div>
          <Skeleton className='h-10 w-40 rounded-md' />
        </div>
      </div>
    </div>
  );
}
