'use client';
'use no memo';

import { Input, SortableHeader } from '@/components';
import { INPUT_BLOCKED_KEYS } from '@/constant';
import { StoreType } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

const MIN_QUANTITY = 0;

// Matches the fields returned by GET_STORES_BY_BRAND (StoreBasicFields fragment)
export type StoreBasicType = Pick<StoreType, 'id' | 'name' | 'storeNumber' | 'isActive'>;

export interface StoreDistributionTableMeta {
  quantities: Record<string, number>;
  onQuantityChange: (storeId: string, rawValue: string) => void;
  disabled: boolean;
}

type ColumnTranslateFn = ReturnType<
  typeof useTranslations<'campaignManagement.storeDistribution.columns'>
>;

export function getStoreDistributionColumns(t: ColumnTranslateFn): ColumnDef<StoreBasicType>[] {
  return [
    {
      accessorKey: 'name',
      filterFn: (row, _columnId, filterValue: string) => {
        const store = row.original;
        const fullLabel = store.storeNumber ? `${store.name} #${store.storeNumber}` : store.name;
        return fullLabel.toLowerCase().includes(filterValue.toLowerCase());
      },
      header: ({ column }) => <SortableHeader column={column}>{t('storeName')}</SortableHeader>,
      cell: ({ row }) => {
        const store = row.original;
        return (
          <span className='text-[14px] font-normal leading-[20px] tracking-[-0.15px] text-[var(--neutral-700)]'>
            {store.name}
            {store.storeNumber ? ` #${store.storeNumber}` : ''}
          </span>
        );
      },
    },
    {
      id: 'quantity',
      header: () => <span className='block text-right uppercase'>{t('quantity')}</span>,
      cell: ({ row, table }) => {
        const store = row.original;
        const { quantities, onQuantityChange, disabled } = table.options
          .meta as StoreDistributionTableMeta;
        const quantity = quantities[store.id] ?? MIN_QUANTITY;
        return (
          <div className='flex justify-end'>
            <Input
              type='number'
              min={MIN_QUANTITY}
              step={1}
              value={quantity}
              disabled={disabled}
              onChange={(e) => onQuantityChange(store.id, e.target.value)}
              onKeyDown={(e) => {
                if (INPUT_BLOCKED_KEYS.includes(e.key)) e.preventDefault();
              }}
              className='h-[44px] w-[100px] sm:w-[210px] bg-[var(--neutral-200)] text-right text-[14px] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
              aria-label={t('quantityAriaLabel', { storeName: store.name })}
            />
          </div>
        );
      },
      enableSorting: false,
    },
  ];
}

/** Static column defs for skeleton (untranslated) */
export const storeDistributionColumns: ColumnDef<StoreBasicType>[] = [
  { accessorKey: 'name', header: 'Store Name' },
  { id: 'quantity', header: 'QTY', enableSorting: false },
];
