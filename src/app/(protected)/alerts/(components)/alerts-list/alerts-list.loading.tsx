'use client';

import { Card, Skeleton } from '@/components';

const DEFAULT_SKELETON_ROWS = 8;

export function AlertsListSkeleton() {
  return (
    <div className='flex flex-col gap-6'>
      {/* Search bar skeleton */}
      <Skeleton className='h-10 w-full rounded-lg' />

      {/* Alert rows card skeleton */}
      <Card className='overflow-hidden rounded-[8px] border border-border p-0'>
        <div className='flex flex-col gap-2 p-6'>
          {Array.from({ length: DEFAULT_SKELETON_ROWS }).map((_, index) => (
            <div
              key={`alert-skeleton-${index}`}
              className='flex items-center justify-between rounded-[8px] p-[14px]'
            >
              {/* Left: Icon + text */}
              <div className='flex items-center gap-3'>
                {/* Icon */}
                <Skeleton className='h-9 w-9 rounded-[8px] shrink-0' />
                {/* Text */}
                <div className='flex flex-col gap-1.5'>
                  <Skeleton className='h-4 w-48 rounded-full' />
                  <Skeleton className='h-3 w-72 rounded-full' />
                </div>
              </div>
              {/* Right: View button */}
              <Skeleton className='h-4 w-8 rounded-full ml-4 shrink-0' />
            </div>
          ))}
        </div>

        {/* Pagination footer skeleton */}
        <div className='border-t border-border bg-[var(--table-header-bg)] flex flex-col items-center justify-between gap-3 px-6 py-4 sm:flex-row'>
          <Skeleton className='h-5 w-48 rounded-full' />
          <div className='flex items-center gap-2'>
            <Skeleton className='h-[39px] w-[90px] rounded-md' />
            <Skeleton className='h-[39px] w-[70px] rounded-md' />
          </div>
        </div>
      </Card>
    </div>
  );
}
