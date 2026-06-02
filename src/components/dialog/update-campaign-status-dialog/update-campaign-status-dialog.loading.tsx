'use client';

import { Dialog, DialogContent, DialogFooter, DialogHeader, Skeleton } from '@/components';

interface UpdateCampaignStatusDialogSkeletonProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Loading skeleton for the Update Campaign Status dialog.
 * Mirrors the layout of the real dialog while data is loading.
 */
export function UpdateCampaignStatusDialogSkeleton({
  open,
  onOpenChange,
}: UpdateCampaignStatusDialogSkeletonProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className='flex w-full flex-col gap-0 overflow-hidden rounded-xl p-0 ring-0 sm:max-w-[600px]'
      >
        {/* Header skeleton */}
        <DialogHeader className='flex flex-row items-start justify-between gap-5 border-b border-[var(--neutral-300)] px-8 py-6'>
          <div className='flex flex-1 flex-col gap-2'>
            <Skeleton className='h-6 w-64' />
            <Skeleton className='h-5 w-full max-w-[400px]' />
          </div>
          <Skeleton className='size-6 shrink-0 rounded' />
        </DialogHeader>

        {/* Body skeleton */}
        <div className='flex flex-col gap-5 px-8 py-6'>
          {/* Campaign info */}
          <div className='flex flex-col gap-2 border-b border-[var(--gray-300)] pb-5'>
            <Skeleton className='h-5 w-72' />
            <Skeleton className='h-5 w-40' />
            <Skeleton className='h-5 w-32' />
          </div>

          {/* New Status select */}
          <div className='flex flex-col gap-2'>
            <Skeleton className='h-5 w-24' />
            <Skeleton className='h-[47px] w-full rounded-lg' />
          </div>

          {/* Info banner */}
          <div className='flex items-start gap-3 rounded-lg bg-[var(--primary-300)] p-3.5'>
            <Skeleton className='size-9 shrink-0 rounded-lg' />
            <div className='flex flex-1 flex-col gap-1'>
              <Skeleton className='h-5 w-48' />
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-3/4' />
            </div>
          </div>
        </div>

        {/* Footer skeleton */}
        <DialogFooter className='flex flex-row items-center gap-3 border-t border-[var(--neutral-300)] px-8 py-5'>
          <Skeleton className='h-[43px] flex-1 rounded-lg' />
          <Skeleton className='h-[43px] flex-1 rounded-lg' />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
