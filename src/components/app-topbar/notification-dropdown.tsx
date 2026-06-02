'use client';

import {
  BRAND_NOTIFICATION_ROLES,
  NotificationTypeEnum,
  ProtectedRoute,
  PSP_NOTIFICATION_ROLES,
  STORE_NOTIFICATION_ROLES,
} from '@/constant';
import { useGlobalProtected } from '@/contexts';
import { GET_NOTIFICATIONS, GetNotificationsResponse, GetNotificationsVariables } from '@/graphql';
import { usePermissions } from '@/hooks';
import { formatDateLocalized } from '@/lib/utils';
import { useLazyQuery } from '@apollo/client/react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';

import { NotificationIcon } from '../icons/NotificationIcon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Skeleton } from '../ui/skeleton';

function NotificationSkeleton() {
  return (
    <div className='flex-col items-start px-4 py-3 border-b border-border last:border-b-0'>
      <div className='mb-1 flex w-full items-start justify-between'>
        <Skeleton className='h-[21px] w-32 rounded' />
        <Skeleton className='h-[18px] w-16 rounded ml-2' />
      </div>
      <Skeleton className='h-[18px] w-full rounded mt-1' />
    </div>
  );
}

const TOP_NOTIFICATIONS_LIMIT = 5;

/* ── Notification type codes for title translation ── */
const NOTIFICATION_TYPE_VALUES = new Set<string>(Object.values(NotificationTypeEnum));

export default function NotificationDropdownContent() {
  const t = useTranslations('topbar.notifications');
  const tAlerts = useTranslations('alerts');

  const getNotificationTitle = (title: string) =>
    NOTIFICATION_TYPE_VALUES.has(title)
      ? tAlerts(`notificationTypes.${title as NotificationTypeEnum}`)
      : title;
  const { selectedBrandId, selectedPspId, selectedStoreId } = useGlobalProtected();
  const locale = useLocale();

  const { role } = usePermissions();
  const isPspRole = PSP_NOTIFICATION_ROLES.has(role as never);
  const isBrandRole = BRAND_NOTIFICATION_ROLES.has(role as never);
  const isStoreRole = STORE_NOTIFICATION_ROLES.has(role as never);

  const [getNotifications, { data, loading }] = useLazyQuery<
    GetNotificationsResponse,
    GetNotificationsVariables
  >(GET_NOTIFICATIONS, {
    fetchPolicy: 'network-only', // Always fetch fresh data when triggered
  });

  const items = data?.notifications?.notifications ?? [];
  const hasUnread = items.some((n) => !n.isRead);

  return (
    <DropdownMenu
      onOpenChange={(open) => {
        //  refetch notifications when dropdown is opened to ensure we show the latest data
        if (open) {
          getNotifications({
            variables: {
              page: 1,
              pageSize: TOP_NOTIFICATIONS_LIMIT,
              ...(isPspRole ? { pspId: selectedPspId } : {}),
              ...(isBrandRole ? { brandId: selectedBrandId } : {}),
              ...(isStoreRole ? { storeId: selectedStoreId } : {}),
            },
          });
        }
      }}
    >
      <DropdownMenuTrigger
        className='relative rounded-lg p-2 transition-colors hover:bg-gray-50 outline-none cursor-pointer focus-visible:ring-3 focus-visible:ring-[var(--focus-ring)] focus-visible:border-[var(--focus-border)]'
        aria-label={t('title')}
      >
        <NotificationIcon />
        {hasUnread && (
          <span
            className='absolute right-1.5 top-1.5 size-2 rounded-full border-2 border-white bg-destructive'
            aria-hidden='true'
          />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        className='w-80 bg-white border border-border rounded-xl shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] p-0 overflow-hidden'
      >
        <div className='px-4 py-3 border-b border-border'>
          <h3 className='font-semibold text-sm leading-[21px] text-gray-900'>{t('title')}</h3>
        </div>
        <div className='max-h-96 overflow-y-auto' role='list' aria-label={t('title')}>
          {loading ? (
            Array.from({ length: TOP_NOTIFICATIONS_LIMIT }).map((_, index) => (
              <NotificationSkeleton key={index} />
            ))
          ) : items.length > 0 ? (
            items.map((notification, index) => (
              <DropdownMenuItem
                key={notification.id}
                role='listitem'
                className={`flex-col items-start px-4 py-3 cursor-pointer hover:bg-sidebar-accent focus:bg-sidebar-accent rounded-none ${
                  index !== items.length - 1 ? 'border-b border-border' : ''
                }`}
              >
                <div className='mb-1 flex w-full items-start justify-between'>
                  <p className='font-medium text-sm leading-[21px] text-gray-900'>
                    {getNotificationTitle(notification.title)}
                  </p>
                  <time
                    dateTime={new Date(notification.createdAt).toISOString()}
                    className='text-xs leading-[18px] text-muted-foreground ml-2'
                  >
                    {formatDateLocalized(new Date(notification.createdAt).toISOString(), locale)}
                  </time>
                </div>
                <p className='text-xs leading-[18px] text-muted-foreground'>
                  {notification.message}
                </p>
              </DropdownMenuItem>
            ))
          ) : (
            <div className='px-4 py-8 text-center' aria-live='polite'>
              <p className='text-sm leading-[21px] text-muted-foreground'>{t('empty')}</p>
            </div>
          )}
        </div>
        <div className='border-t border-border px-4 py-3'>
          <Link
            role='menuitem'
            href={ProtectedRoute.ALERTS}
            className='block w-full text-center font-medium text-sm leading-[21px] text-primary transition-colors hover:text-[--blue-medium]'
          >
            {t('viewAll')}
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
