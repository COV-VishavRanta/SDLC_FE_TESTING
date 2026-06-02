import { Skeleton } from '@/components';
import { useTranslations } from 'next-intl';

export default function BrandDetailsLoading() {
  const t = useTranslations('brandManagement.details');

  return (
    /* aria-busy announces this region is loading to screen readers (WCAG 4.1.3) */
    <div
      aria-busy='true'
      aria-label={t('loadingLabel')}
      className='flex min-h-screen min-w-0 flex-col gap-6 overflow-x-hidden bg-[var(--gray-50)] p-4 sm:p-6 lg:p-8'
    >
      {/* Back link */}
      <Skeleton className='h-5 w-28' />

      {/* Page title row */}
      <div className='flex items-center gap-3'>
        <Skeleton className='h-10 w-64' />
        <Skeleton className='h-6 w-16 rounded-full' />
      </div>

      {/* Two-column cards */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]'>
        {/* Brand Information card */}
        <div className='rounded-lg border border-border bg-white p-6 shadow-sm'>
          <Skeleton className='mb-5 h-5 w-40' />
          <div className='grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2'>
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className='flex flex-col gap-1.5'>
                <Skeleton className='h-3 w-20' />
                <Skeleton className='h-5 w-full' />
              </div>
            ))}
          </div>
        </div>

        {/* Brand Administrators card */}
        <div className='rounded-lg border border-border bg-white p-6 shadow-sm'>
          <Skeleton className='mb-5 h-5 w-44' />
          <div className='flex flex-col gap-3'>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className='flex items-center gap-3 rounded-lg border border-border p-3'>
                <Skeleton className='size-9 rounded-full' />
                <div className='flex flex-1 flex-col gap-1.5'>
                  <Skeleton className='h-4 w-32' />
                  <Skeleton className='h-3 w-44' />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
