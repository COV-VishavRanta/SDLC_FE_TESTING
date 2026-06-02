'use client';
'use no memo';

import { CreatedDateCell, ShipmentStatusCell, SortableHeader } from '@/components';
import { ProtectedRoute } from '@/constant';
import { ShipmentListItemType } from '@/graphql';
import { encodeId } from '@/lib';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

type TranslateFn = ReturnType<typeof useTranslations<'shipments'>>;

export interface GetShipmentColumnsOptions {
  showStoreColumn?: boolean;
}

/* ── Shipment status → Badge variant mapping ── */
export function getShipmentStatusVariant(status: string) {
  switch (status.toLowerCase()) {
    case 'shipped':
      return 'pending' as const;
    case 'delivered':
    case 'received':
      return 'active' as const;
    case 'pending':
      return 'warning' as const;
    default:
      return 'inactive' as const;
  }
}

/* ── Column Definitions ── */
export function getShipmentColumns(
  t: TranslateFn,
  { showStoreColumn = true }: GetShipmentColumnsOptions = {},
): ColumnDef<ShipmentListItemType>[] {
  const columns: ColumnDef<ShipmentListItemType>[] = [
    {
      accessorKey: 'shipmentNumber',
      header: ({ column }) => (
        <SortableHeader column={column}>{t('table.columns.shipmentNo')}</SortableHeader>
      ),
      cell: ({ row }) => {
        const { shipmentNumber, totalItems } = row.original;
        return (
          <div className='flex flex-col gap-0.5'>
            <Link
              href={`${ProtectedRoute.SHIPMENTS}/${shipmentNumber}`}
              className='text-[var(--primary-400)] transition-colors hover:underline'
            >
              {shipmentNumber ?? '—'}
            </Link>
            <span className='text-xs text-muted-foreground'>
              {totalItems} {t('table.units')}
            </span>
          </div>
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
            href={`${ProtectedRoute.CAMPAIGN_MANAGEMENT}/${id}?tab=order`}
            className='text-[var(--primary-400)] transition-colors hover:underline'
          >
            {campaignName}
          </Link>
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
          {row.getValue<string>('orderNumber') ?? '—'}
        </span>
      ),
    },
    {
      id: 'store',
      header: ({ column }) => (
        <SortableHeader column={column}>{t('table.columns.store')}</SortableHeader>
      ),
      cell: ({ row }) => {
        const { store } = row.original;
        const location = [store?.stateAbbr, store?.countryName].filter(Boolean).join(', ');
        return (
          <div className='flex flex-col gap-0.5'>
            <span className='text-sm font-normal text-foreground'>{store?.name ?? '—'}</span>
            {location && <span className='text-xs text-muted-foreground'>{location}</span>}
          </div>
        );
      },
    },
    {
      accessorKey: 'shipmentEta',
      header: ({ column }) => (
        <SortableHeader column={column}>{t('table.columns.shipmentEta')}</SortableHeader>
      ),
      cell: ({ row }) => <CreatedDateCell value={row.getValue<string | Date>('shipmentEta')} />,
    },
    {
      accessorKey: 'trackingNumber',
      header: () => <span className='uppercase'>{t('table.columns.trackingNumber')}</span>,
      cell: ({ row }) => (
        <span className='text-sm text-foreground'>
          {row.getValue<string>('trackingNumber') ?? '—'}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: () => <span className='uppercase'>{t('table.columns.status')}</span>,
      cell: ({ row }) => {
        const status = row.getValue<string>('status');

        return <ShipmentStatusCell status={status} />;
      },
      enableSorting: false,
    },
  ];

  return showStoreColumn
    ? columns
    : columns.filter((col) =>
        'id' in col
          ? col.id !== 'store'
          : 'accessorKey' in col
            ? col.accessorKey !== 'store'
            : true,
      );
}
