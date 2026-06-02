'use client';
'use no memo';

import { SortableHeader } from '@/components';
import { ShipmentExceptionEnum } from '@/constant';
import { ExceptionRequestItemType } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

const MIN_QUANTITY = 0;

const EXCEPTION_TYPE_LABEL_KEY = {
  [ShipmentExceptionEnum.MISSING]: 'exceptionMissing',
  [ShipmentExceptionEnum.INCORRECT]: 'exceptionIncorrect',
  [ShipmentExceptionEnum.DAMAGED]: 'exceptionDamaged',
} as const satisfies Record<
  ShipmentExceptionEnum,
  'exceptionMissing' | 'exceptionIncorrect' | 'exceptionDamaged'
>;

type ColumnTranslateFn = ReturnType<typeof useTranslations<'reorderDetails.table.columns'>>;

export function getReorderPromotionColumns(
  t: ColumnTranslateFn,
): ColumnDef<ExceptionRequestItemType>[] {
  return [
    {
      accessorKey: 'promotionName',
      filterFn: (row, _columnId, filterValue: string) =>
        row.original.promotionName.toLowerCase().includes(filterValue.toLowerCase()),
      header: ({ column }) => <SortableHeader column={column}>{t('promotionName')}</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-[14px] font-normal leading-[20px] tracking-[-0.15px] text-[var(--neutral-700)]'>
          {row.original.promotionName}
        </span>
      ),
    },
    {
      accessorKey: 'originalQuantity',
      header: () => (
        <span className='text-xs font-medium uppercase tracking-[-0.15px] text-[var(--neutral-600)]'>
          {t('shippedQty')}
        </span>
      ),
      enableSorting: false,
      cell: ({ row }) => (
        <span className='text-[14px] font-normal leading-[20px] tracking-[-0.15px] text-[var(--neutral-700)]'>
          {row.original.originalQuantity}
        </span>
      ),
    },
    {
      id: 'validReceivedQty',
      header: () => (
        <span className='text-xs font-medium uppercase tracking-[-0.15px] text-[var(--neutral-600)]'>
          {t('validReceivedQty')}
        </span>
      ),
      enableSorting: false,
      cell: ({ row }) => {
        const validReceived = Math.max(
          MIN_QUANTITY,
          (row.original.originalQuantity ?? MIN_QUANTITY) -
            (row.original.requestedQuantity ?? MIN_QUANTITY),
        );
        return (
          <span className='text-[14px] font-normal leading-[20px] tracking-[-0.15px] text-[var(--neutral-700)]'>
            {validReceived}
          </span>
        );
      },
    },
    {
      id: 'exceptionType',
      header: () => (
        <span className='text-xs font-medium uppercase tracking-[-0.15px] text-[var(--neutral-600)]'>
          {t('exceptionType')}
        </span>
      ),
      enableSorting: false,
      cell: ({ row }) => {
        const { exceptionType } = row.original;
        return (
          <span className='text-[14px] font-normal leading-[20px] tracking-[-0.15px] text-[var(--neutral-700)]'>
            {exceptionType ? t(EXCEPTION_TYPE_LABEL_KEY[exceptionType]) : '—'}
          </span>
        );
      },
    },
    {
      accessorKey: 'requestedQuantity',
      header: () => (
        <span className='text-xs font-medium uppercase tracking-[-0.15px] text-[var(--neutral-600)]'>
          {t('discrepancyQty')}
        </span>
      ),
      enableSorting: false,
      cell: ({ row }) => (
        <span className='text-[14px] font-normal leading-[20px] tracking-[-0.15px] text-[var(--neutral-700)]'>
          {row.original.requestedQuantity}
        </span>
      ),
    },
  ];
}
