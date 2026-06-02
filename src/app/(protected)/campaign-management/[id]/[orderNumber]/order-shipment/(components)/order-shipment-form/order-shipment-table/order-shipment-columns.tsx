'use client';
'use no memo';

import { Input, SortableHeader } from '@/components';
import { INPUT_BLOCKED_KEYS } from '@/constant';
import { StoreOrderItemType } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

export interface OrderShipmentTableMeta {
  quantities: Record<string, string>;
  onQuantityChange: (orderItemId: string, value: string, maxQty: number) => void;
  isSubmitting: boolean;
}

type ColumnTranslateFn = ReturnType<
  typeof useTranslations<'campaignManagement.createShipment.pendingShipment'>
>;

export function getOrderShipmentColumns(t: ColumnTranslateFn): ColumnDef<StoreOrderItemType>[] {
  return [
    {
      accessorKey: 'promotionName',
      filterFn: (row, _columnId, filterValue: string) =>
        row.original.promotionName.toLowerCase().includes(filterValue.toLowerCase()),
      header: ({ column }) => (
        <SortableHeader column={column}>{t('columns.promotionName')}</SortableHeader>
      ),
      cell: ({ row }) => (
        <span className='font-medium text-text-heading'>{row.original.promotionName}</span>
      ),
    },
    {
      accessorKey: 'totalQuantity',
      enableSorting: false,
      header: () => <>{t('columns.totalQuantity')}</>,
    },
    {
      accessorKey: 'shippedQuantity',
      enableSorting: false,
      header: () => <>{t('columns.shippedQuantity')}</>,
    },
    {
      accessorKey: 'remainingQuantity',
      enableSorting: false,
      header: () => <>{t('columns.remainingQuantity')}</>,
    },
    {
      id: 'shipQuantity',
      enableSorting: false,
      header: () => <>{t('columns.shipQuantity')}</>,
      cell: ({ row, table }) => {
        const item = row.original;
        const { quantities, onQuantityChange, isSubmitting } = table.options
          .meta as OrderShipmentTableMeta;
        const isDisabled = item.remainingQuantity === 0 || isSubmitting;
        return (
          <Input
            type='number'
            min={0}
            step={1}
            disabled={isDisabled}
            max={item.remainingQuantity}
            value={quantities[item.orderItemId] ?? '0'}
            onChange={(e) =>
              onQuantityChange(item.orderItemId, e.target.value, item.remainingQuantity)
            }
            onKeyDown={(e) => {
              if (INPUT_BLOCKED_KEYS.includes(e.key)) e.preventDefault();
            }}
            className='h-[44px] w-[210px] bg-[var(--neutral-200)] text-right text-[14px] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
            placeholder='0'
            aria-label={t('columns.shipQuantityAriaLabel', {
              promotionName: item.promotionName,
            })}
            aria-disabled={isDisabled ? 'true' : undefined}
          />
        );
      },
    },
  ];
}

/** Static column defs for skeleton (untranslated) */
export const orderShipmentColumns: ColumnDef<StoreOrderItemType>[] = [
  { accessorKey: 'promotionName', header: 'Promotion Name' },
  { accessorKey: 'totalQuantity', header: 'Total Qty', enableSorting: false },
  { accessorKey: 'shippedQuantity', header: 'Shipped Qty', enableSorting: false },
  { accessorKey: 'remainingQuantity', header: 'Remaining Qty', enableSorting: false },
  { id: 'shipQuantity', header: 'Ship Qty', enableSorting: false },
];
