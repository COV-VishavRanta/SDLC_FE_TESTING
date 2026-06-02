'use client';
'use no memo';

import { ExceptionRequestStatusCell, SortableHeader } from '@/components';
import { ProtectedRoute } from '@/constant';
import { encodeId } from '@/lib';
import { ExceptionRequestListItemType } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

type TranslateFn = ReturnType<typeof useTranslations<'exceptionRequest'>>;

export interface GetExceptionRequestColumnsOptions {
  showStoreColumn?: boolean;
}

/* ── Column Definitions ── */
export function getExceptionRequestColumns(
  t: TranslateFn,
  { showStoreColumn = true }: GetExceptionRequestColumnsOptions = {},
): ColumnDef<ExceptionRequestListItemType>[] {
  const columns: ColumnDef<ExceptionRequestListItemType>[] = [
    {
      accessorKey: 'issueNumber',
      header: ({ column }) => (
        <SortableHeader column={column}>{t('table.columns.issueNumber')}</SortableHeader>
      ),
      cell: ({ row }) => {
        const encodedReorderId = encodeId(row.original.reorderId);
        return (
          <Link
            href={`${ProtectedRoute.EXCEPTION_REQUEST}/${encodedReorderId}`}
            className='text-[var(--primary-400)] transition-colors hover:underline'
          >
            {row.original?.issueNumber ?? '—'}
          </Link>
        );
      },
    },
    {
      accessorKey: 'campaignName',
      header: () => <span className='uppercase'>{t('table.columns.campaignName')}</span>,
      cell: ({ row }) => {
        const id = encodeId(row.original?.campaignId);

        const campaignName = row.getValue<string>('campaignName') ?? '—';
        if (!id) {
          return <span className='text-sm text-foreground'>{campaignName}</span>;
        }
        return (
          <Link
            href={`${ProtectedRoute.CAMPAIGN_MANAGEMENT}/${id}?tab=reorder`}
            className='text-[var(--primary-400)] transition-colors hover:underline'
          >
            {campaignName}
          </Link>
        );
      },
      enableSorting: false,
    },

    {
      accessorKey: 'shipmentNumber',
      header: ({ column }) => (
        <SortableHeader column={column}>{t('table.columns.shipmentNo')}</SortableHeader>
      ),
      cell: ({ row }) => {
        const { shipmentNumber, totalQuantity } = row.original;

        return (
          <div className='flex flex-col gap-0.5'>
            {shipmentNumber ?? '—'}
            <span className='text-xs text-muted-foreground'>
              {totalQuantity} {t('table.units')}
            </span>
          </div>
        );
      },
    },

    {
      accessorKey: 'orderNumber',
      header: ({ column }) => (
        <SortableHeader column={column}>{t('table.columns.orderNumber')}</SortableHeader>
      ),
      cell: ({ row }) => (
        <span className='text-sm text-foreground'>
          {row.getValue<number>('orderNumber') ?? '—'}
        </span>
      ),
    },
    {
      id: 'storeName',
      accessorKey: 'storeName',
      header: () => <span className='uppercase'>{t('table.columns.storeName')}</span>,
      cell: ({ row }) => (
        <span className='text-sm text-foreground'>{row.original.storeName ?? '—'}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: () => <span className='uppercase'>{t('table.columns.status')}</span>,
      cell: ({ row }) => {
        const status = row.getValue<string>('status');
        return <ExceptionRequestStatusCell status={status} />;
      },
      enableSorting: false,
    },
  ];

  return showStoreColumn
    ? columns
    : columns.filter((col) =>
        'id' in col
          ? col.id !== 'storeName'
          : 'accessorKey' in col
            ? col.accessorKey !== 'storeName'
            : true,
      );
}
