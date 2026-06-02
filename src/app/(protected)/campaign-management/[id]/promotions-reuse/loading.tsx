import { PageRoot, Skeleton } from '@/components';

import { PromotionsReuseTableSkeleton } from './(components)/promotions-reuse-table/promotions-reuse-table.loading';

export default function PromotionsReuseLoading() {
  return (
    <PageRoot>
      {/* Back link skeleton */}
      <Skeleton className='h-5 w-36 rounded-full' />

      {/* Page title skeleton */}
      <Skeleton className='h-9 w-72 rounded-full' />

      {/* Table skeleton */}
      <PromotionsReuseTableSkeleton />
    </PageRoot>
  );
}
