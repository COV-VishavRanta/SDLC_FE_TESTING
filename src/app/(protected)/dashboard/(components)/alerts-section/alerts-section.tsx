'use client';

import { AlertRow, ArrowRightIcon, Card, NoRecordFound, Skeleton } from '@/components';
import {
  AlertType,
  BRAND_NOTIFICATION_ROLES,
  NotificationTypeEnum,
  ProtectedRoute,
  PSP_NOTIFICATION_ROLES,
  STORE_NOTIFICATION_ROLES,
} from '@/constant';
import { useGlobalProtected } from '@/contexts';
import { GET_NOTIFICATIONS, GetNotificationsResponse, GetNotificationsVariables } from '@/graphql';
import { usePermissions } from '@/hooks';
import { useSuspenseQuery } from '@apollo/client/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

const ALERTS_PAGE_SIZE = 3;

const NOTIFICATION_TYPE_VALUES = new Set<string>(Object.values(NotificationTypeEnum));

/* ─── Skeleton ─── */
export function AlertsSkeleton() {
  return (
    <Card className='border border-[var(--neutral-300)] bg-[var(--neutral-100)] p-[15px] sm:p-6'>
      <div className='mb-5 flex items-center justify-between'>
        <Skeleton className='h-5 w-16' />
        <Skeleton className='h-5 w-20' />
      </div>
      <div className='flex flex-col gap-3'>
        {Array.from({ length: ALERTS_PAGE_SIZE }).map((_, i) => (
          <Skeleton key={i} className='h-[68px] w-full rounded-lg' />
        ))}
      </div>
    </Card>
  );
}

/* ─── Main Component ─── */
export default function AlertsSection() {
  const t = useTranslations('dashboard.alerts-section');
  const tAlerts = useTranslations('alerts');

  const getAlertTitle = (title: string) =>
    NOTIFICATION_TYPE_VALUES.has(title)
      ? tAlerts(`notificationTypes.${title as NotificationTypeEnum}`)
      : title;
  const { selectedBrandId, selectedPspId, selectedStoreId } = useGlobalProtected();
  const { role } = usePermissions();
  const isPspRole = PSP_NOTIFICATION_ROLES.has(role as never);
  const isBrandRole = BRAND_NOTIFICATION_ROLES.has(role as never);
  const isStoreRole = STORE_NOTIFICATION_ROLES.has(role as never);

  const { data } = useSuspenseQuery<GetNotificationsResponse, GetNotificationsVariables>(
    GET_NOTIFICATIONS,
    {
      variables: {
        ...(isPspRole ? { pspId: selectedPspId } : {}),
        ...(isBrandRole ? { brandId: selectedBrandId } : {}),
        ...(isStoreRole ? { storeId: selectedStoreId } : {}),
        page: 1,
        pageSize: ALERTS_PAGE_SIZE,
      },
    },
  );

  const alerts = data?.notifications?.notifications ?? [];

  return (
    <Card className='border border-[var(--neutral-300)] bg-[var(--neutral-100)] p-[15px] sm:p-6'>
      <div className='mb-5 flex items-center justify-between'>
        <p className='text-[16px] font-[var(--font-weight-medium)] leading-5 tracking-[-0.15px] text-[var(--neutral-900)]'>
          {t('title')}
        </p>
        <Link
          href={ProtectedRoute.ALERTS}
          className='flex items-center gap-2 text-[16px] font-[var(--font-weight-medium)] text-[var(--primary-700)]'
        >
          {t('view-all')}
          <ArrowRightIcon className='size-[18px]' />
        </Link>
      </div>

      {alerts.length === 0 ? (
        <NoRecordFound message={t('empty')} />
      ) : (
        <div className='flex flex-col gap-2' role='list'>
          {alerts.map((alert) => (
            <AlertRow
              type={AlertType.WARNING}
              key={alert.id}
              title={getAlertTitle(alert.title)}
              description={alert.message}
              viewAction={null}
            />
          ))}
        </div>
      )}
    </Card>
  );
}
