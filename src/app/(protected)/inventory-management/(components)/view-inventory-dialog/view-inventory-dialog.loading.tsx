import { Dialog, DialogContent, Skeleton } from '@/components';

function DetailFieldSkeleton({ wide }: { wide?: boolean }) {
  return (
    <div className='flex flex-col gap-1.5'>
      <Skeleton className='h-3 w-20 rounded-full' />
      <Skeleton className={`h-[22px] rounded-full ${wide ? 'w-48' : 'w-32'}`} />
    </div>
  );
}

export function ViewInventoryDialogSkeleton() {
  return (
    <Dialog open>
      <DialogContent
        showCloseButton={false}
        className='flex max-h-[90vh] w-full flex-col gap-0 overflow-hidden rounded-2xl sm:max-w-[700px]'
      >
        {/* ── Header ── */}
        <div className='flex flex-row items-center justify-between border-b border-[#e1e6eb] px-8 py-6'>
          <Skeleton className='h-[30px] w-44 rounded-full' />
          <Skeleton className='size-9 rounded-md' />
        </div>

        {/* ── Scrollable body ── */}
        <div className='flex flex-col gap-6 overflow-y-auto px-8 py-6'>
          {/* Basic Information card */}
          <div className='flex flex-col gap-4 rounded-[12px] border border-[#e5e7eb] bg-[#f9fafb] px-5 py-6'>
            <div className='flex items-start justify-between'>
              <Skeleton className='h-6 w-36 rounded-full' />
              <Skeleton className='h-5 w-40 rounded-full' />
            </div>
            <div className='h-px w-10 bg-[#e1e6eb]' />
            <div className='grid grid-cols-2 gap-x-4 gap-y-5'>
              <DetailFieldSkeleton wide />
              <DetailFieldSkeleton />
              <DetailFieldSkeleton />
              <DetailFieldSkeleton />
              <DetailFieldSkeleton />
              <DetailFieldSkeleton />
              <DetailFieldSkeleton />
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className='flex justify-end border-t border-[#e5e7eb] px-6 py-5'>
          <Skeleton className='h-[44px] w-24 rounded-[8px]' />
        </div>
      </DialogContent>
    </Dialog>
  );
}
