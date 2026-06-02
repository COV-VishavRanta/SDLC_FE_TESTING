'use client';
'use no memo';

import { SortableHeader } from '@/components';
import { StoreDistributionItemType } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

type TranslateFn = ReturnType<
  typeof useTranslations<'campaignManagement.details.viewPromotion.participatingStores.columns'>
>;

export function getStoreColumns(t: TranslateFn): ColumnDef<StoreDistributionItemType>[] {
  return [
    {
      accessorKey: 'storeName',
      header: ({ column }) => <SortableHeader column={column}>{t('storeName')}</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-[14px] font-normal leading-5 tracking-[-0.15px] text-[var(--neutral-700)]'>
          {row.original.storeName}
        </span>
      ),
    },
    {
      accessorKey: 'assignedQuantity',
      header: () => <span className='block text-right uppercase'>{t('quantity')}</span>,
      cell: ({ row }) => (
        <span className='block text-right text-[12px] font-medium leading-5 tracking-[-0.15px] text-[var(--neutral-700)]'>
          {row.original.assignedQuantity}
        </span>
      ),
      enableSorting: false,
    },
  ];
}
