'use client';
'use no memo';

import {
  ActionButtonCell,
  ActionCellContainer,
  Checkbox,
  EyeIcon,
  SortableHeader,
} from '@/components';
import { PromotionType } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

type ColumnTranslateFn = ReturnType<
  typeof useTranslations<'campaignManagement.importPromotions.columns'>
>;

interface ColumnOptions {
  onViewDetails: (item: PromotionType) => void;
  t: ColumnTranslateFn;
}

export function getImportPromotionsColumns(options: ColumnOptions): ColumnDef<PromotionType>[] {
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
          checked={row.getIsSelected()}
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
      cell: ({ row }) => <span>{row.original.material ?? '—'}</span>,
      enableSorting: false,
    },
    {
      id: 'needDesign',
      header: () => <span>{t('needDesign')}</span>,
      cell: ({ row }) => (
        <span
          className={
            row.original.needDesign
              ? 'text-[12px] font-normal leading-[18px] text-[var(--green-500)]'
              : 'text-[12px] font-normal leading-[18px] text-text-secondary'
          }
        >
          {row.original.needDesign ? t('needDesignYes') : t('needDesignNo')}
        </span>
      ),
      enableSorting: false,
    },

    {
      accessorKey: 'isReusable',
      id: 'reusable',
      header: ({ column }) => <SortableHeader column={column}>{t('reusable')}</SortableHeader>,
      cell: ({ row }) => (
        <div className='flex w-[60px]'>
          {row.original.isReusable ? (
            <span className='text-[12px] font-medium leading-[18px] text-text-heading'>
              {t('reusableYes')}
            </span>
          ) : (
            <span className='text-[12px] font-medium leading-[18px] text-text-heading'>
              {t('reusableNo')}
            </span>
          )}
        </div>
      ),
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
