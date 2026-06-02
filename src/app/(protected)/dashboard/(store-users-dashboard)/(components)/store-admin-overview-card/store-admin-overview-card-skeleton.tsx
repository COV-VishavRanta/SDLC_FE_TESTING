import { Skeleton } from '@/components';
import { useTranslations } from 'next-intl';

export function StoreAdminOverviewCardSkeleton() {
  const t = useTranslations('dashboard.store-admin-overview');

  return (
    <section aria-label={t('section-label')} aria-busy='true'>
      <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className='flex items-start justify-between rounded-lg border border-[var(--neutral-300)] bg-[var(--neutral-100)] p-6'
            aria-hidden='true'
          >
            <div className='flex flex-col gap-2'>
              <Skeleton className='h-5 w-36' />
              <Skeleton className='h-8 w-16' />
            </div>
            <Skeleton className='size-12 rounded-lg' />
          </div>
        ))}
      </div>
    </section>
  );
}
