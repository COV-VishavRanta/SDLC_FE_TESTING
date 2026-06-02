'use client';
'use no memo';

import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SortableHeader,
} from '@/components';
import { INPUT_BLOCKED_KEYS, ShipmentExceptionEnum, ShipmentStatusEnum } from '@/constant';
import { ShipmentDetailItemType } from '@/graphql';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

const MIN_QUANTITY = 0;

export const EXCEPTION_CLEAR_SENTINEL = null;

const EXCEPTION_TYPE_LABEL_KEY = {
  [ShipmentExceptionEnum.MISSING]: 'exceptionMissing',
  [ShipmentExceptionEnum.INCORRECT]: 'exceptionIncorrect',
  [ShipmentExceptionEnum.DAMAGED]: 'exceptionDamaged',
} as const satisfies Record<
  ShipmentExceptionEnum,
  'exceptionMissing' | 'exceptionIncorrect' | 'exceptionDamaged'
>;

export interface ReceiveShipmentTableMeta {
  validReceivedQtys: Record<string, number>;
  discrepancyQtys: Record<string, number>;
  exceptionTypes: Record<string, ShipmentExceptionEnum>;
  invalidExceptionItems: Set<string>;
  onValidReceivedChange: (itemId: string, rawValue: string) => void;
  onDiscrepancyChange: (itemId: string, rawValue: string) => void;
  onExceptionTypeChange: (itemId: string, value: string | null) => void;
  disabled: boolean;
  isReadOnly: boolean;
  status?: string;
}

type ColumnTranslateFn = ReturnType<typeof useTranslations<'shipmentDetails.receiveTable.columns'>>;

export function getShipmentReceiveColumns(
  t: ColumnTranslateFn,
): ColumnDef<ShipmentDetailItemType>[] {
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
      accessorKey: 'quantityShipped',
      header: () => (
        <span className='uppercase text-xs font-medium tracking-[-0.15px] text-[var(--neutral-600)]'>
          {t('shippedQuantity')}
        </span>
      ),
      enableSorting: false,
      cell: ({ row }) => (
        <span className='text-[14px] font-normal leading-[20px] tracking-[-0.15px] text-[var(--neutral-700)]'>
          {row.original.quantityShipped}
        </span>
      ),
    },
    {
      id: 'validReceivedQty',
      header: () => (
        <span className='uppercase text-xs font-medium tracking-[-0.15px] text-[var(--neutral-600)]'>
          {t('validReceivedQty')}
        </span>
      ),
      enableSorting: false,
      cell: ({ row, table }) => {
        const item = row.original;
        const { validReceivedQtys, onValidReceivedChange, disabled, isReadOnly, status } = table
          .options.meta as ReceiveShipmentTableMeta;

        const value = validReceivedQtys[item.shipmentItemId] ?? MIN_QUANTITY;
        const readOnlyValue = item.receivedQuantity ?? MIN_QUANTITY;

        if (isReadOnly) {
          return (
            <span className='text-[14px] font-normal leading-[20px] tracking-[-0.15px] text-[var(--neutral-700)]'>
              {status === ShipmentStatusEnum.SHIPPED ? 0 : readOnlyValue}
            </span>
          );
        }
        return (
          <Input
            type='number'
            min={MIN_QUANTITY}
            step={1}
            value={value}
            disabled={disabled}
            onChange={(e) => {
              const newValue = Number(e.target.value);

              // If already 0 and user is trying to keep it 0 → do nothing
              if (value === 0 && newValue === 0) return;

              onValidReceivedChange(item.shipmentItemId, e.target.value);
            }}
            onKeyDown={(e) => {
              if (INPUT_BLOCKED_KEYS.includes(e.key)) e.preventDefault();
            }}
            className='h-[44px] w-full rounded-[8px] border-[var(--neutral-300)] bg-[var(--neutral-200)] text-[14px] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
            aria-label={t('validReceivedQtyAriaLabel', { promotionName: item.promotionName })}
          />
        );
      },
    },
    {
      id: 'exceptionType',
      header: () => (
        <span className='uppercase text-xs font-medium tracking-[-0.15px] text-[var(--neutral-600)]'>
          {t('exceptionType')}
        </span>
      ),
      enableSorting: false,
      cell: ({ row, table }) => {
        const item = row.original;
        const {
          exceptionTypes,
          onExceptionTypeChange,
          disabled,
          isReadOnly,
          invalidExceptionItems,
        } = table.options.meta as ReceiveShipmentTableMeta;
        const value = exceptionTypes[item.shipmentItemId];
        const hasError = invalidExceptionItems.has(item.shipmentItemId);
        const readOnlyValue = item.exceptionType;
        if (isReadOnly) {
          return (
            <span className='text-[14px] font-normal leading-[20px] tracking-[-0.15px] text-[var(--neutral-700)]'>
              {readOnlyValue ? t(EXCEPTION_TYPE_LABEL_KEY[readOnlyValue]) : '—'}
            </span>
          );
        }
        return (
          <Select
            value={value as string | undefined}
            onValueChange={(val) => onExceptionTypeChange(item.shipmentItemId, val)}
            disabled={disabled}
            aria-label={t('exceptionTypeAriaLabel', { promotionName: item.promotionName })}
            itemToStringLabel={(selectedItem: string) =>
              t(EXCEPTION_TYPE_LABEL_KEY[selectedItem as ShipmentExceptionEnum])
            }
          >
            <SelectTrigger
              className={`h-[44px] w-full rounded-[8px] bg-[var(--neutral-200)] ${hasError ? 'border-[var(--error-500)] ring-1 ring-[var(--error-500)]' : 'border-[var(--neutral-300)]'}`}
              aria-label={t('exceptionTypeAriaLabel', { promotionName: item.promotionName })}
              aria-invalid={hasError}
            >
              <SelectValue placeholder={t('exceptionTypePlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={EXCEPTION_CLEAR_SENTINEL}>
                {t('exceptionTypePlaceholder')}
              </SelectItem>
              <SelectItem value={ShipmentExceptionEnum.DAMAGED}>{t('exceptionDamaged')}</SelectItem>
              <SelectItem value={ShipmentExceptionEnum.INCORRECT}>
                {t('exceptionIncorrect')}
              </SelectItem>
              <SelectItem value={ShipmentExceptionEnum.MISSING}>{t('exceptionMissing')}</SelectItem>
            </SelectContent>
          </Select>
        );
      },
    },
    {
      id: 'discrepancyQty',
      header: () => (
        <span className='uppercase text-xs font-medium tracking-[-0.15px] text-[var(--neutral-600)]'>
          {t('discrepancyQty')}
        </span>
      ),
      enableSorting: false,
      cell: ({ row, table }) => {
        const item = row.original;
        const { discrepancyQtys, onDiscrepancyChange, disabled, isReadOnly, status } = table.options
          .meta as ReceiveShipmentTableMeta;
        const value = discrepancyQtys[item.shipmentItemId] ?? MIN_QUANTITY;

        const readOnlyValue = Math.max(
          MIN_QUANTITY,
          (item.quantityShipped ?? MIN_QUANTITY) - (item.receivedQuantity ?? MIN_QUANTITY),
        );

        if (isReadOnly) {
          return (
            <span className='text-[14px] font-normal leading-[20px] tracking-[-0.15px] text-[var(--neutral-700)]'>
              {status === ShipmentStatusEnum.SHIPPED ? 0 : readOnlyValue}
            </span>
          );
        }
        return (
          <Input
            type='number'
            min={MIN_QUANTITY}
            step={1}
            value={value}
            disabled={disabled}
            onChange={(e) => {
              const newValue = Number(e.target.value);

              // If already 0 and user is trying to keep it 0 → do nothing
              if (value === 0 && newValue === 0) return;

              onDiscrepancyChange(item.shipmentItemId, e.target.value);
            }}
            onKeyDown={(e) => {
              if (INPUT_BLOCKED_KEYS.includes(e.key)) e.preventDefault();
            }}
            className='h-[44px] w-full rounded-[8px] border-[var(--neutral-300)] bg-[var(--neutral-200)] text-[14px] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
            aria-label={t('discrepancyQtyAriaLabel', { promotionName: item.promotionName })}
          />
        );
      },
    },
  ];
}

/** Static column defs for skeleton (no translations needed) */
export const shipmentReceiveColumns: ColumnDef<ShipmentDetailItemType>[] = [
  { accessorKey: 'promotionName', header: 'Promotion Name' },
  { accessorKey: 'quantityShipped', header: 'Shipped QTY', enableSorting: false },
  { id: 'validReceivedQty', header: 'Valid Received Qty', enableSorting: false },
  { id: 'exceptionType', header: 'Exception Type', enableSorting: false },
  { id: 'discrepancyQty', header: 'Discrepancy Qty', enableSorting: false },
];
