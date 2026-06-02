import { Skeleton } from '@/components/ui/skeleton';

export function SurveyPreviewLoading() {
  return (
    <div className='flex h-full xcol bg-muted/20 w-full'>
      <div className='border-b bg-background p-4'>
        <Skeleton className='h-8 w-1/3' />
      </div>

      <div className='flex-1 overflow-auto p-4 md:p-8'>
        <div className=' space-y-8'>
          <div className='space-y-4'>
            <Skeleton className='h-10 w-3/4' />
            <Skeleton className='h-5 w-full' />
            <Skeleton className='h-5 w-5/6' />
          </div>

          {[1, 2].map((i) => (
            <div key={i} className='space-y-4 rounded-lg border bg-background p-6'>
              <Skeleton className='h-7 w-2/3' />

              <div className='space-y-3 pt-4'>
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className='flex items-center gap-3'>
                    <Skeleton className='size-5 rounded-full' />
                    <Skeleton className='h-5 w-full max-w-sm' />
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className='flex justify-between pt-4'>
            <Skeleton className='h-10 w-24' />
            <Skeleton className='h-10 w-24' />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SurveyPreviewLoading;
