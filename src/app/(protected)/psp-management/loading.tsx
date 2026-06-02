import { PageDescription, PageHeader, PageRoot, PageTitle, Skeleton } from '@/components';
import { PspTableSkeleton } from './(components)/psp-listing/psp-table.loading';

/* ── Page Loading State ── */
export default function PspManagementLoading() {
  return (
    <PageRoot>
      {/* Page Header */}
      <PageHeader>
        <PageTitle className='font-semibold text-text-heading'>PSP Management</PageTitle>
        <PageDescription>Manage Print Service Providers and their administrators</PageDescription>
      </PageHeader>

      {/* Stat Cards Skeleton */}
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6'>
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className='flex flex-col gap-2 rounded-[12px] border border-border bg-white px-6 py-5'
          >
            <Skeleton className='h-5 w-32' />
            <Skeleton className='h-8 w-20' />
          </div>
        ))}
      </div>

      {/* Search + Create Skeleton */}
      <div className='flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex flex-1 gap-3'>
          <Skeleton className='h-10 flex-1 w-full' />
          <Skeleton className='h-10 w-32' />
        </div>
        <Skeleton className='h-10 w-40' />
      </div>

      {/* PSP List Skeleton */}
      <div className='flex flex-col gap-4'>
        <PspTableSkeleton />
      </div>
    </PageRoot>
  );
}
