import { Skeleton } from '@/components/ui/skeleton';

export function QuestionSettingLoading() {
  return (
    <div className='flex h-full flex-col p-4'>
      <Skeleton className='mb-6 h-8 w-40' />

      <div className='space-y-6'>
        <div className='space-y-3 flex flex-col'>
          <Skeleton className='h-5 w-24' />
          <Skeleton className='h-10 w-full' />
        </div>

        <div className='space-y-3 flex flex-col'>
          <Skeleton className='h-5 w-32' />
          <Skeleton className='h-10 w-full' />
        </div>

        <div className='space-y-4 rounded-lg border p-4'>
          <Skeleton className='h-6 w-32' />
          <div className='flex items-center justify-between'>
            <Skeleton className='h-5 w-24' />
            <Skeleton className='h-6 w-10' />
          </div>
          <div className='flex items-center justify-between'>
            <Skeleton className='h-5 w-40' />
            <Skeleton className='h-6 w-10' />
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionSettingLoading;
