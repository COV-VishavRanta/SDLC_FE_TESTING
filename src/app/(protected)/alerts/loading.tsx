import { PageRoot, Skeleton } from '@/components';

import { AlertsListSkeleton } from './(components)/alerts-list/alerts-list.loading';

export default function AlertsLoading() {
  return (
    <PageRoot>
      {/* Page header skeleton */}
      <div className='mb-8 space-y-2'>
        <Skeleton className='h-[42px] w-40 rounded-lg' />
        <Skeleton className='h-4 w-80 rounded-full' />
      </div>

      {/* Alerts list skeleton */}
      <AlertsListSkeleton />
    </PageRoot>
  );
}
