'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useTranslations } from 'next-intl';

const SKELETON_CARD_COUNT = 3;

export function OrdersTabSkeleton() {
  const t = useTranslations('campaignManagement.details.ordersTab');

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

          {/* Stats */}
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:flex lg:flex-1 lg:items-center lg:gap-[42px]'>
            {/* Total Promotions */}
            <div className='flex flex-1 flex-col items-center gap-1'>
              <Skeleton className='h-3 w-24' />
              <Skeleton className='h-7 w-8 rounded-lg' />
            </div>
            {/* Total Quantity */}
            <div className='flex flex-1 flex-col items-center gap-1'>
              <Skeleton className='h-3 w-24' />
              <Skeleton className='h-6 w-10' />
            </div>
            {/* Ship Quantity */}
            <div className='flex flex-1 flex-col items-center gap-1'>
              <Skeleton className='h-3 w-24' />
              <Skeleton className='h-6 w-10' />
            </div>
            {/* Remaining Qty */}
            <div className='flex flex-1 flex-col items-center gap-1'>
              <Skeleton className='h-3 w-24' />
              <Skeleton className='h-6 w-10' />
            </div>
            {/* Status */}
            <div className='flex flex-1 flex-col items-center gap-1'>
              <Skeleton className='h-3 w-16' />
              <Skeleton className='h-6 w-20 rounded-full' />
            </div>
          </div>

          {/* Ship Button placeholder */}
          <Skeleton className='h-9 w-[84px] shrink-0 rounded-lg' />

          {/* Chevron */}
          <Skeleton className='hidden size-4 lg:block' />
        </div>
      ))}
    </div>
  );
}

/** Skeleton for an individual expanded promotion row */
export function PromotionRowSkeleton() {
  return (
    <div className='flex flex-col gap-2 rounded-lg border border-[#e5e7eb] bg-white px-5 py-3'>
      <Skeleton className='h-4 w-48' />
      <div className='flex items-center justify-between'>
        <div className='flex gap-8'>
          <div className='flex flex-col gap-1'>
            <Skeleton className='h-3 w-20' />
            <Skeleton className='h-4 w-32' />
          </div>
          <div className='flex flex-col gap-1'>
            <Skeleton className='h-3 w-16' />
            <Skeleton className='h-4 w-24' />
          </div>
        </div>
        <div className='flex items-center gap-12'>
          <Skeleton className='h-4 w-20' />
          <Skeleton className='h-4 w-16' />
          <Skeleton className='h-4 w-24' />
        </div>
      </div>
    </div>
  );
}
