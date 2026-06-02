'use client';
'use no memo';

import { SortableHeader } from '@/components';
import { InventoryType } from '@/types';
import { ColumnDef } from '@tanstack/react-table';

import { InventoryActionCell, TranslateFn } from './inventory-table-action-cell';

/* ── Column Definitions ── */
export function getInventoryColumns(t: TranslateFn): ColumnDef<InventoryType>[] {
  return [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <SortableHeader column={column}>{t('table.columns.itemName')}</SortableHeader>
      ),
      cell: ({ row }) => (
        <span className='text-sm font-medium text-text-primary'>{row.original.name ?? '—'}</span>
      ),
    },
    {
      accessorKey: 'brandId',
      header: () => <span className='uppercase'>{t('table.columns.brand')}</span>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>{row.original.brandName ?? '—'}</span>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'quantity',
      header: () => <span className='uppercase'>{t('table.columns.availableQuantity')}</span>,
      cell: ({ row }) => {
        const qty = row.original.quantity;
        return <span className='text-sm text-text-secondary'>{qty ?? '—'}</span>;
      },
      enableSorting: false,
    },
    {
      id: 'actions',
      header: () => <span className='flex w-full justify-end'>{t('table.columns.actions')}</span>,
      cell: ({ row }) => <InventoryActionCell row={row} t={t} />,
      enableSorting: false,
    },
  ];
}

/**
 * Static column definitions (used by InventoryTableSkeleton for skeleton column count).
 */
export const inventoryColumns: ColumnDef<InventoryType>[] = [
  { accessorKey: 'name', header: 'Item Name' },
  { accessorKey: 'brandId', header: 'Brand' },
  { accessorKey: 'quantity', header: 'Available QTY' },
  { id: 'actions', header: 'Actions' },
];
