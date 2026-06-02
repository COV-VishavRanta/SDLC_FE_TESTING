import { Card, CardContent, CardHeader, Skeleton } from '@/components';
import { useTranslations } from 'next-intl';

export function PspAdminOverviewCardSkeleton() {
  const t = useTranslations('dashboard.psp-admin-overview');

  return (
    <Card
      className='border border-[var(--neutral-300)] bg-[var(--neutral-100)]'
      aria-busy='true'
      aria-label={t('loading')}
    >
      <CardHeader className='gap-0 p-0 pb-5'>
        <Skeleton className='h-5 w-48' />
      </CardHeader>
      <CardContent className='p-0'>
        <div className='flex items-center justify-between rounded-xl border border-[var(--neutral-200)] bg-white p-5'>
          <div className='flex flex-col gap-2'>
            <Skeleton className='h-10 w-14' />
            <Skeleton className='h-4 w-36' />
          </div>
          <Skeleton className='size-14 rounded-xl' />
        </div>
      </CardContent>
    </Card>
  );
}
