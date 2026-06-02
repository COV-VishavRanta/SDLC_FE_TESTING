'use client';
'use no memo';

import {
  ArrowRightIcon,
  Card,
  ExceptionRequestStatusCell,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components';
import {
  EntityType,
  ExceptionRequestSortField,
  ProtectedRoute,
  SortOrder,
  UserRole,
} from '@/constant';
import { useGlobalProtected } from '@/contexts';
import {
  LIST_EXCEPTION_REQUESTS,
  ListExceptionRequestsResponse,
  ListExceptionRequestsVariables,
} from '@/graphql';
import { useCapabilities } from '@/hooks';
import { DEFAULT_EXCEPTION_REQUEST_CAPABILITIES, EXCEPTION_REQUEST_CAPABILITIES_MAP } from '@/lib';
import { skipToken, useSuspenseQuery } from '@apollo/client/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { CSSProperties } from 'react';

const DASHBOARD_EXCEPTION_REQUEST_PAGE_SIZE = 5;

const COLUMN_STYLE: Record<string, CSSProperties> = {
  issueNumber: { width: '140px', minWidth: '100px' },
  campaignName: { width: '200px', minWidth: '160px' },
  shipmentNumber: { width: '160px', minWidth: '120px' },
  orderNumber: { width: '160px', minWidth: '120px' },
  storeName: { width: '180px', minWidth: '140px' },
  status: { width: '140px', minWidth: '100px' },
};

/* ─── Skeleton ─── */
export function ExceptionRequestsSkeleton() {
  return (
    <Card className='border border-[var(--neutral-300)] bg-[var(--neutral-100)] p-[15px] sm:p-6'>
      <div className='mb-5 flex items-center justify-between'>
        <Skeleton className='h-5 w-40' />
        <Skeleton className='h-5 w-20' />
      </div>
      <div className='space-y-0'>
        <Skeleton className='h-11 w-full rounded-t-lg' />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className='h-11 w-full' />
        ))}
      </div>
    </Card>
  );
}

/* ─── Main Component ─── */
export default function ExceptionRequests() {
  const t = useTranslations('exceptionRequest');
  const { selectedBrandId, selectedStoreId, currentUserData } = useGlobalProtected();
  const caps = useCapabilities(
    EXCEPTION_REQUEST_CAPABILITIES_MAP,
    DEFAULT_EXCEPTION_REQUEST_CAPABILITIES,
  );

  const roleName = currentUserData?.me?.roles?.[0]?.name ?? '';

  let entityId: string | undefined;
  let entityType: EntityType | undefined;
  switch (roleName) {
    case UserRole.BRAND_ADMIN:
    case UserRole.CAMPAIGN_MANAGER:
      entityId = selectedBrandId ?? undefined;
      entityType = EntityType.BRAND;
      break;
    case UserRole.STORE_ADMIN:
      entityId = selectedStoreId ?? undefined;
      entityType = EntityType.STORE;
      break;
    default:
      entityId = undefined;
      entityType = undefined;
  }

  const variables = entityId
    ? ({
        [entityType ?? '']: entityId,
        page: 1,
        pageSize: DASHBOARD_EXCEPTION_REQUEST_PAGE_SIZE,
        sort: { field: ExceptionRequestSortField.SUBMITTED_DATE, order: SortOrder.DESC },
      } as ListExceptionRequestsVariables)
    : null;

  const { data } = useSuspenseQuery<ListExceptionRequestsResponse, ListExceptionRequestsVariables>(
    LIST_EXCEPTION_REQUESTS,
    variables ? { variables, fetchPolicy: 'network-only' } : skipToken,
  );

  const exceptionRequests = data?.listExceptionRequests?.exceptionRequests ?? [];

  const columnCount = caps.showStoreColumn ? 6 : 5;

  return (
    <Card className='overflow-clip rounded-xl border border-border p-0'>
      <div className='flex items-center justify-between border-b border-border px-5 py-4'>
        <p className='text-[16px] font-[var(--font-weight-semibold)] leading-5 text-[var(--neutral-900)]'>
          {t('page.title')}
        </p>
        <Link
          href={ProtectedRoute.EXCEPTION_REQUEST}
          className='inline-flex items-center gap-2 text-[16px] font-[var(--font-weight-medium)] text-[var(--primary-700)] transition-colors hover:underline'
        >
          {t('page.view-all')}
          <ArrowRightIcon className='size-[18px]' />
        </Link>
      </div>

      <div className='overflow-x-auto'>
        <Table aria-label={t('table.caption')}>
          <TableHeader>
            <TableRow>
              <TableHead scope='col' style={COLUMN_STYLE.issueNumber}>
                <span className='uppercase'>{t('table.columns.issueNumber')}</span>
              </TableHead>
              <TableHead scope='col' style={COLUMN_STYLE.campaignName}>
                <span className='uppercase'>{t('table.columns.campaignName')}</span>
              </TableHead>
              <TableHead scope='col' style={COLUMN_STYLE.shipmentNumber}>
                <span className='uppercase'>{t('table.columns.shipmentNo')}</span>
              </TableHead>
              <TableHead scope='col' style={COLUMN_STYLE.orderNumber}>
                <span className='uppercase'>{t('table.columns.orderNumber')}</span>
              </TableHead>
              {caps.showStoreColumn && (
                <TableHead scope='col' style={COLUMN_STYLE.storeName}>
                  <span className='uppercase'>{t('table.columns.storeName')}</span>
                </TableHead>
              )}
              <TableHead scope='col' style={COLUMN_STYLE.status}>
                <span className='uppercase'>{t('table.columns.status')}</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exceptionRequests.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columnCount}
                  className='h-24 text-center text-sm text-muted-foreground'
                >
                  {t('table.emptyState')}
                </TableCell>
              </TableRow>
            ) : (
              exceptionRequests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className='text-sm text-foreground'>
                    {req.issueNumber ?? '—'}
                  </TableCell>
                  <TableCell className='text-sm text-foreground'>
                    {req.campaignName ?? '—'}
                  </TableCell>
                  <TableCell>
                    <div className='flex flex-col gap-0.5'>
                      <span className='text-sm text-foreground'>{req.shipmentNumber ?? '—'}</span>
                      <span className='text-xs text-muted-foreground'>
                        {req.totalQuantity} {t('table.units')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className='text-sm text-foreground'>
                    {req.orderNumber ?? '—'}
                  </TableCell>
                  {caps.showStoreColumn && (
                    <TableCell className='text-sm text-foreground'>
                      {req.storeName ?? '—'}
                    </TableCell>
                  )}
                  <TableCell>
                    <ExceptionRequestStatusCell status={req.status} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
