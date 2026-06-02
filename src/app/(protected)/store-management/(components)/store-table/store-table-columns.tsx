'use client';
'use no memo';

import { AdminCountCell, CreatedDateCell, SortableHeader, StatusBadgeCell } from '@/components';
import { encodeId } from '@/lib';
import { StoreType } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { ProtectedRoute } from '@/constant';
import StoreActionCell from './store-action-cell';

export function useStoreTableColumns(): ColumnDef<StoreType>[] {
  const t = useTranslations('storeManagement.table.columns');

  return [
    {
      accessorKey: 'name',
      header: ({ column }) => <SortableHeader column={column}>{t('name')}</SortableHeader>,
      cell: ({ row }) => {
        const id = encodeId(row.original.id);
        const name = row.getValue('name') as string;

        return (
          <Link
            href={`${ProtectedRoute.STORE_MANAGEMENT}/${id}`}
            className='text-sm text-table-link transition-colors hover:underline'
          >
            {name}
          </Link>
        );
      },
    },
    {
      accessorKey: 'storeNumber',
      header: ({ column }) => <SortableHeader column={column}>{t('storeNumber')}</SortableHeader>,
      cell: ({ row }) => (
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        <span className='text-sm text-text-secondary'>{row.getValue('storeNumber') || '—'}</span>
      ),
    },
    {
      id: 'admins',
      header: () => <span className='uppercase'>{t('users')}</span>,
      cell: ({ row }) => {
        const users = [
          ...(row?.original?.activeStoreAdmins ?? []),
          ...(row?.original?.inactiveStoreAdmins ?? []),
          ...(row?.original?.pendingStoreAdmins ?? []),
          ...(row?.original?.activeStoreOperators ?? []),
          ...(row?.original?.inactiveStoreOperators ?? []),
          ...(row?.original?.pendingStoreOperators ?? []),
          ...(row?.original?.activeRegionalManagers ?? []),
          ...(row?.original?.inactiveRegionalManagers ?? []),
          ...(row?.original?.pendingRegionalManagers ?? []),
        ];
        const firstAdmin = users?.[0];
        const totalUsers = row.original.totalUsers ?? 0;
        const remainingCount = totalUsers - (firstAdmin ? 1 : 0);
        return <AdminCountCell firstAdminName={firstAdmin?.name} remainingCount={remainingCount} />;
      },
      enableSorting: false,
    },
    {
      id: 'isActive',
      accessorFn: (row) => row.isActive,
      header: () => <span className='uppercase'>{t('status')}</span>,
      cell: ({ row }) => <StatusBadgeCell isActive={row.getValue('isActive')} />,
      enableSorting: false,
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => <SortableHeader column={column}>{t('createdDate')}</SortableHeader>,
      cell: ({ row }) => <CreatedDateCell value={row.getValue<string | Date>('createdAt')} />,
    },
    {
      id: 'actions',
      header: () => <span className='flex w-full justify-end uppercase'>{t('actions')}</span>,
      cell: StoreActionCell,
      enableSorting: false,
    },
  ];
}

/**
 * Static column definitions (used by StoreTableLoading for skeleton column count).
 * Column headers here are intentionally untranslated placeholders.
 */
export const storeColumns: ColumnDef<StoreType>[] = [
  { accessorKey: 'name', header: 'Store Name' },
  { accessorKey: 'storeNumber', header: 'Store Number' },
  { id: 'admins', header: 'Users' },
  { id: 'isActive', header: 'Status' },
  { accessorKey: 'createdAt', header: 'Created' },
  { id: 'actions', header: 'Actions' },
];
