'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useTranslations } from 'next-intl';

const SKELETON_CARD_COUNT = 3;

export function InstallationProofTabSkeleton() {
  const t = useTranslations('campaignManagement.details.installationProofTab');

  return (
    <div
      role='status'
      aria-busy='true'
      aria-label={t('loading')}
      className='overflow-hidden rounded-lg border border-border'
    >
      <span className='sr-only'>{t('loading')}</span>
      {Array.from({ length: SKELETON_CARD_COUNT }).map((_, i) => (
        <div
          key={i}
          aria-hidden='true'
          className='flex flex-col gap-4 border-b border-border bg-white px-5 pb-5 pt-3 last:border-b-0 lg:flex-row lg:items-center lg:gap-[42px]'
        >
          {/* Store name */}
          <div className='flex flex-1 items-center gap-2'>
            <Skeleton className='size-4 rounded' />
            <Skeleton className='h-4 w-32' />
          </div>

          {/* Stats — Total Promotions, Total Qty, Status */}
          <div className='grid grid-cols-3 gap-4 lg:flex lg:flex-1 lg:items-center lg:gap-[42px]'>
            <div className='flex flex-1 flex-col items-center gap-1'>
              <Skeleton className='h-3 w-24' />
              <Skeleton className='h-7 w-8 rounded-lg' />
            </div>
            <div className='flex flex-1 flex-col items-center gap-1'>
              <Skeleton className='h-3 w-24' />
              <Skeleton className='h-6 w-10' />
            </div>
            <div className='flex flex-1 flex-col items-center gap-1'>
              <Skeleton className='h-3 w-16' />
              <Skeleton className='h-6 w-20 rounded-full' />
            </div>
          </div>

          {/* Accept / Reject icons placeholder */}
          <div className='flex shrink-0 items-center gap-2'>
            <Skeleton className='size-8 rounded-full' />
            <Skeleton className='size-8 rounded-full' />
          </div>

          {/* Chevron */}
          <Skeleton className='hidden size-4 lg:block' />
        </div>
      ))}
    </div>
  );
}
