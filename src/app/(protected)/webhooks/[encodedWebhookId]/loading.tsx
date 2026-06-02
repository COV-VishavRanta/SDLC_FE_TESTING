import { Skeleton } from '@/components';
import { useTranslations } from 'next-intl';

const FIELD_SKELETON_COUNT = 3;
const IP_SKELETON_COUNT = 4;

export default function WebhookDetailsLoading() {
  const t = useTranslations('webhooks.details');

  return (
    <div
      aria-busy='true'
      aria-label={t('loadingLabel')}
      className='flex min-w-0 flex-col gap-6 overflow-x-hidden bg-[var(--neutral-200)] p-4 sm:p-6 lg:p-8'
    >
      {/* Back link */}
      <Skeleton className='h-5 w-36' />

      {/* Title + button row */}
      <div className='flex items-center justify-between gap-4'>
        <div className='flex items-center gap-3'>
          <Skeleton className='h-9 w-56' />
          <Skeleton className='h-6 w-16 rounded-full' />
        </div>
        <Skeleton className='h-11 w-36 rounded-lg' />
      </div>

      {/* Two-column cards */}
      <div className='grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]'>
        {/* Webhook Information card */}
        <div className='rounded-xl border border-[var(--neutral-300)] bg-white px-8 py-6'>
          <Skeleton className='mb-5 h-5 w-44' />

          {/* Row 1: 3 fields */}
          <div className='grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-3'>
            {Array.from({ length: FIELD_SKELETON_COUNT }).map((_, i) => (
              <div key={i} className='flex flex-col gap-1.5'>
                <Skeleton className='h-3 w-20' />
                <Skeleton className='h-5 w-full' />
              </div>
            ))}
          </div>

          {/* Row 2: 3 date fields */}
          <div className='mt-5 grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-3'>
            {Array.from({ length: FIELD_SKELETON_COUNT }).map((_, i) => (
              <div key={i} className='flex flex-col gap-1.5'>
                <Skeleton className='h-3 w-20' />
                <Skeleton className='h-5 w-full' />
              </div>
            ))}
          </div>

          {/* Row 3: Client Secret full-width */}
          <div className='mt-5 flex flex-col gap-1.5'>
            <Skeleton className='h-3 w-28' />
            <Skeleton className='h-12 w-full rounded-lg' />
          </div>
        </div>

        {/* Allowed IPs card */}
        <div className='rounded-xl border border-[var(--neutral-300)] bg-white px-8 py-6'>
          <Skeleton className='mb-5 h-5 w-28' />
          <div className='flex flex-col gap-2'>
            {Array.from({ length: IP_SKELETON_COUNT }).map((_, i) => (
              <Skeleton key={i} className='h-12 w-full rounded-lg' />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
