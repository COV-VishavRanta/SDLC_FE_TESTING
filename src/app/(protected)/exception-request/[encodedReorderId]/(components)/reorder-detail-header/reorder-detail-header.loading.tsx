import { Skeleton } from '@/components';

export default function ReorderDetailHeaderLoading() {
  return (
    <div className='flex flex-col gap-5'>
      <Skeleton className='h-[22px] w-48 rounded-md' />
      <div className='flex flex-wrap items-start justify-between gap-3'>
        <div className='flex flex-col gap-2'>
          <Skeleton className='h-[42px] w-64 rounded-md' />
          <Skeleton className='h-[21px] w-36 rounded-md' />
        </div>
        <Skeleton className='h-[44px] w-36 rounded-md' />
      </div>
    </div>
  );
}
