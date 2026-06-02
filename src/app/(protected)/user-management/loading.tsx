import { PageRoot } from '@/components';
import { Skeleton } from '@/components/ui/skeleton';

import UserTableLoading from './(components)/user-table/user-table.loading';

/**
 * Streaming loading UI for the User Management page.
 * Rendered automatically by Next.js while the page segment is loading.
 */
export default function UserManagementLoading() {
  return (
    <PageRoot>
      {/* Page Header skeleton */}
      <div className='flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex flex-col gap-2'>
          <Skeleton className='h-[42px] w-56 rounded-lg' />
          <Skeleton className='h-4 w-full max-w-96 rounded-full' />
        </div>
        <Skeleton className='h-[45px] w-[130px] rounded-lg' />
      </div>

      {/* Filters skeleton */}
      <div className='flex gap-3'>
        <Skeleton className='h-[40.5px] w-[100%] rounded-lg' />
        <Skeleton className='h-[40.5px] w-[100%] rounded-lg' />
      </div>

      {/* Table skeleton */}
      <UserTableLoading />
    </PageRoot>
  );
}
