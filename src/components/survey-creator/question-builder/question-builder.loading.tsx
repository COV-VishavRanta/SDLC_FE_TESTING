import { Skeleton } from '@/components/ui/skeleton';

export function QuestionBuilderLoading() {
  return (
    <div className='flex h-full flex-col gap-4 p-4'>
      <div className='flex items-center justify-between'>
        <Skeleton className='h-8 w-48' />
        <Skeleton className='h-10 w-32' />
      </div>

      <div className='flex-1 space-y-4'>
        {[1, 2, 3].map((i) => (
          <div key={i} className='rounded-xl border bg-card p-4'>
            <div className='flex flex-col gap-4'>
              <div className='flex items-center gap-4'>
                <Skeleton className='size-6 rounded' />
                <Skeleton className='h-6 w-3/4' />
                <Skeleton className='ml-auto h-8 w-8' />
              </div>
              <div className='space-y-2 pl-10'>
                <Skeleton className='h-10 w-full' />
                <Skeleton className='h-10 w-3/4' />
                <Skeleton className='h-10 w-1/2' />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuestionBuilderLoading;
