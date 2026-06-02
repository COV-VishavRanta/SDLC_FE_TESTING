'use client';
'use no memo';

import { AdminCountCell, CreatedDateCell, SortableHeader, StatusBadgeCell } from '@/components';
import { WebhookCapabilities } from '@/lib/permissions/capabilities/webhook.capabilities';
import { WebhookCredentialType } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

import { ProtectedRoute } from '@/constant';
import { encodeId } from '@/lib';
import Link from 'next/link';
import WebhookActionCell from './webhook-action-cell';

type TranslateFn = ReturnType<typeof useTranslations<'webhooks'>>;

/* ── Column Definitions ── */
export function getWebhookColumns(
  t: TranslateFn,
  caps: Pick<WebhookCapabilities, 'showPspColumn'>,
): ColumnDef<WebhookCredentialType>[] {
  const columns: ColumnDef<WebhookCredentialType>[] = [
    {
      accessorKey: 'label',
      header: ({ column }) => (
        <SortableHeader column={column}>{t('table.columns.name')}</SortableHeader>
      ),
      cell: ({ row }) => {
        const webhook = row.original;
        const id = encodeId(webhook.id);
        return (
          <Link
            href={`${ProtectedRoute.WEB_HOOKS}/${id}`}
            className='text-table-link transition-colors hover:underline'
          >
            {webhook?.label ?? '—'}
          </Link>
        );
      },
    },
  ];

  if (caps.showPspColumn) {
    columns.push({
      id: 'psp',
      header: () => <span className='uppercase'>{t('table.columns.psp')}</span>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>{row.original.pspName ?? '-'}</span>
      ),
      enableSorting: false,
    });
  }

  columns.push(
    {
      accessorKey: 'isActive',
      header: () => <span className='uppercase'>{t('table.columns.status')}</span>,
      cell: ({ row }) => <StatusBadgeCell isActive={row.getValue<boolean>('isActive')} />,
      enableSorting: false,
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <SortableHeader column={column}>{t('table.columns.createdAt')}</SortableHeader>
      ),
      cell: ({ row }) => <CreatedDateCell value={row.getValue<string | Date>('createdAt')} />,
    },
    {
      id: 'tokenExpiration',
      header: () => <span className='uppercase'>{t('table.columns.tokenExpiration')}</span>,
      cell: ({ row }) => {
        const hours = row.original.tokenExpirationHours;

        return (
          <span className='text-sm text-text-secondary'>
            {hours !== null && hours !== undefined ? `${hours} Hour${hours === 1 ? '' : 's'}` : '—'}
          </span>
        );
      },
      enableSorting: false,
    },
    {
      id: 'allowedIps',
      header: () => <span className='uppercase'>{t('table.columns.allowedIps')}</span>,
      cell: ({ row }) => {
        const ips = row.original.ipAllowlist ?? [];
        const [firstIp] = ips;
        const remainingCount = ips.length > 1 ? ips.length - 1 : 0;

        if (ips.length === 0) {
          return <span className='text-sm text-text-secondary'>All</span>;
        }

        return <AdminCountCell firstAdminName={firstIp} remainingCount={remainingCount} />;
      },
      enableSorting: false,
    },
    {
      id: 'actions',
      header: () => (
        <span className='uppercase flex w-full justify-end'>{t('table.columns.actions')}</span>
      ),
      cell: ({ row }) => <WebhookActionCell credential={row.original} />,
      enableSorting: false,
    },
  );

  return columns;
}
