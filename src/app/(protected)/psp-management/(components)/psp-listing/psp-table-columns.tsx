'use client';
'use no memo';

import { AdminCountCell, CreatedDateCell, SortableHeader, StatusBadgeCell } from '@/components';
import { encodeId } from '@/lib';
import { PSPType } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import PspActionCell from './psp-action-cell';

export function usePspTableColumns(): ColumnDef<PSPType>[] {
  const t = useTranslations('pspManagement.table.columns');

  return [
    {
      accessorKey: 'name',
      header: ({ column }) => <SortableHeader column={column}>{t('name')}</SortableHeader>,
      cell: ({ row }) => {
        const id = encodeId(row.original.id);
        const name = row.getValue('name') as string;

        return (
          <Link
            href={`/psp-management/${id}`}
            className='text-sm text-table-link transition-colors hover:underline'
          >
            {name}
          </Link>
        );
      },
    },

    {
      id: 'admins',
      header: ({ column }) => <SortableHeader column={column}>{t('users')}</SortableHeader>,
      cell: ({ row }) => {
        const users = [
          ...(row.original.activePspAdmins ?? []),
          ...(row.original.inactivePspAdmins ?? []),
          ...(row.original.pendingPspAdmins ?? []),
          ...(row.original.activeProductionOperators ?? []),
          ...(row.original.inactiveProductionOperators ?? []),
          ...(row.original.pendingProductionOperators ?? []),
        ];
        const [firstAdmin] = users;
        const totalUsers = row.original.totalUsers ?? 0;
        const remainingCount = totalUsers - (firstAdmin ? 1 : 0);

        return <AdminCountCell firstAdminName={firstAdmin?.name} remainingCount={remainingCount} />;
      },
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
      header: () => <span className='uppercase'>{t('createdDate')}</span>,
      cell: ({ row }) => <CreatedDateCell value={row.getValue<string | Date>('createdAt')} />,
      enableSorting: false,
    },
    {
      id: 'actions',
      header: () => <span className='flex w-full justify-end uppercase'>{t('actions')}</span>,
      cell: PspActionCell,
      enableSorting: false,
    },
  ];
}

/**
 * Static column definitions (used by PspTableLoading for skeleton column count).
 * Column headers here are intentionally untranslated placeholders.
 */
export const pspColumns: ColumnDef<PSPType>[] = [
  { accessorKey: 'name', header: 'Company Name' },
  { id: 'admins', header: 'Users' },
  { id: 'isActive', header: 'Status' },
  { accessorKey: 'createdAt', header: 'Created' },
  { id: 'actions', header: 'Actions' },
];
