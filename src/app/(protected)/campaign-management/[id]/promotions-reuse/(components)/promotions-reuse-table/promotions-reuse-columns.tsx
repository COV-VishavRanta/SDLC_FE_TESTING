'use client';
'use no memo';

import {
  ActionButtonCell,
  ActionCellContainer,
  Checkbox,
  EyeIcon,
  SortableHeader,
} from '@/components';
import { InventoryType } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

type ColumnTranslateFn = ReturnType<
  typeof useTranslations<'campaignManagement.promotionsReuse.columns'>
>;

/* ── Column options ── */
interface ColumnOptions {
  onViewDetails: (item: InventoryType) => void;
  alreadyAddedInventoryIds: Set<string>;
  t: ColumnTranslateFn;
}

/* ── Dynamic columns (with callbacks) ── */
export function getInventoryReuseColumns(options: ColumnOptions): ColumnDef<InventoryType>[] {
  const { onViewDetails, t } = options;
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <>
          <span className='sr-only'>{t('selectAll')}</span>
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            indeterminate={table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()}
            onCheckedChange={(checked) => table.toggleAllPageRowsSelected(!!checked)}
            aria-label={t('selectAll')}
          />
        </>
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected() || !row.getCanSelect()}
          disabled={!row.getCanSelect()}
          onCheckedChange={(checked) => row.toggleSelected(!!checked)}
          aria-label={t('selectRow', { name: row.original.name })}
        />
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => <SortableHeader column={column}>{t('promotionName')}</SortableHeader>,
      cell: ({ row }) => <span className='font-medium text-text-heading'>{row.original.name}</span>,
      enableSorting: true,
    },
    {
      accessorKey: 'height',
      header: () => <span>{t('height')}</span>,
      cell: ({ row }) => <span>{row.original.height ?? '—'}</span>,
      enableSorting: false,
    },
    {
      accessorKey: 'width',
      header: () => <span>{t('width')}</span>,
      cell: ({ row }) => <span>{row.original.width ?? '—'}</span>,
      enableSorting: false,
    },
    {
      accessorKey: 'material',
      header: () => <span>{t('material')}</span>,
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      cell: ({ row }) => <span>{row.original.material || '—'}</span>,
      enableSorting: false,
    },

    {
      id: 'actions',
      header: () => <span className='flex w-full justify-end'>{t('actions')}</span>,
      cell: ({ row }) => (
        <ActionCellContainer className='justify-end'>
          <ActionButtonCell
            icon={<EyeIcon className='size-4 text-primary' aria-hidden='true' />}
            tooltip={t('viewDetailsAriaLabel', { name: row.original.name })}
            onClick={() => onViewDetails(row.original)}
            className='hover:bg-muted'
          />
        </ActionCellContainer>
      ),
      enableSorting: false,
    },
  ];
}

/* ── Static columns (for skeleton column count) ── */
export const inventoryReuseStaticColumns: ColumnDef<InventoryType>[] = [
  { id: 'select', enableSorting: false },
  { accessorKey: 'name', enableSorting: false },
  { accessorKey: 'height', enableSorting: false },
  { accessorKey: 'width', enableSorting: false },
  { accessorKey: 'material', enableSorting: false },
  { id: 'needDesign', enableSorting: false },
  { id: 'photo', enableSorting: false },
  { id: 'actions', enableSorting: false },
];
