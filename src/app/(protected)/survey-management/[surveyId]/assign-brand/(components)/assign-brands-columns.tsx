'use no memo';
'use client';

import { Checkbox, SortableHeader } from '@/components';
import { SurveyUnassignedBrandItem } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

type TranslateFn = ReturnType<typeof useTranslations<'assignBrand'>>;

/* ── Column definitions ── */
export function getBrandColumns(t: TranslateFn): ColumnDef<SurveyUnassignedBrandItem>[] {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <>
          <span className='sr-only'>{t('columns.selectAll')}</span>
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            indeterminate={table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()}
            onCheckedChange={(checked) => table.toggleAllPageRowsSelected(!!checked)}
            aria-label={t('columns.selectAll')}
          />
        </>
      ),
      cell: ({ row }) => {
        return (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(checked) => row.toggleSelected(!!checked)}
            aria-label={t('columns.selectRow', { name: row.original.name })}
          />
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <SortableHeader column={column}>{t('columns.brandName')}</SortableHeader>
      ),
      cell: ({ row }) => (
        <span className='text-[14px] font-normal leading-[20px] text-[var(--neutral-700)]'>
          {row.original.name}
        </span>
      ),
    },
  ];
}
