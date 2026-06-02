'use client';
'use no memo';

import { CreatedDateCell, SortableHeader } from '@/components';
import type { StoreOrderLineItemType } from '@/graphql';
import { ColumnDef } from '@tanstack/react-table';
import { CSSProperties } from 'react';

export function getStoreOrdersColumns(): ColumnDef<StoreOrderLineItemType>[] {
  return [
    {
      accessorKey: 'campaignName',
      header: ({ column }) => <SortableHeader column={column}>Campaign Name</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-primary'>{row.original.campaignName ?? '-'}</span>
      ),
    },

    {
      accessorKey: 'storeName',
      header: ({ column }) => <SortableHeader column={column}>Store Name</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>{row.original.storeName ?? '-'}</span>
      ),
    },

    {
      accessorKey: 'storeNumber',
      header: ({ column }) => <SortableHeader column={column}>Store Number</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>{row.original.storeNumber ?? '-'}</span>
      ),
    },

    {
      accessorKey: 'storeAlias',
      header: ({ column }) => <SortableHeader column={column}>Store Alias</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>{row.original.storeAlias ?? '-'}</span>
      ),
    },

    {
      accessorKey: 'itemName',
      header: ({ column }) => <SortableHeader column={column}>Item Name</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>{row.original.itemName ?? '-'}</span>
      ),
    },
    {
      accessorKey: 'quantity',
      header: ({ column }) => <SortableHeader column={column}>Quantity</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>{row.original.quantity ?? '-'}</span>
      ),
    },
    {
      accessorKey: 'orderNumber',
      header: ({ column }) => <SortableHeader column={column}>Order Number</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>{row.original.orderNumber ?? '-'}</span>
      ),
    },
    {
      accessorKey: 'orderCreatedAt',
      header: ({ column }) => <SortableHeader column={column}>Order Created At</SortableHeader>,
      cell: ({ row }) => <CreatedDateCell value={row.original.orderCreatedAt} />,
    },
    {
      accessorKey: 'isReorder',
      header: ({ column }) => <SortableHeader column={column}>Is Reorder</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>{row.original.isReorder ? 'Yes' : 'No'}</span>
      ),
    },
    {
      accessorKey: 'pspOrderReference',
      header: ({ column }) => <SortableHeader column={column}>PSP Order Reference</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>{row.original.pspOrderReference ?? '-'}</span>
      ),
    },
    {
      accessorKey: 'pspAcknowledgedOn',
      header: ({ column }) => <SortableHeader column={column}>PSP Acknowledged On</SortableHeader>,
      cell: ({ row }) => <CreatedDateCell value={row.original.pspAcknowledgedOn} />,
    },
    {
      accessorKey: 'orderLineNumber',
      header: ({ column }) => <SortableHeader column={column}>Order Line Number</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>{row.original.orderLineNumber ?? '-'}</span>
      ),
    },
    {
      accessorKey: 'orderStatus',
      header: ({ column }) => <SortableHeader column={column}>Order Status</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>{row.original.orderStatus ?? '-'}</span>
      ),
    },
  ];
}

export const STORE_ORDERS_COLUMN_STYLE: Record<string, CSSProperties> = {
  campaignName: { minWidth: '200px', maxWidth: '200px' },
  storeName: { minWidth: '200px', maxWidth: '200px' },
  storeNumber: { minWidth: '200px', maxWidth: '200px' },
  storeAlias: { minWidth: '200px', maxWidth: '200px' },
  itemName: { minWidth: '200px', maxWidth: '200px' },
  quantity: { minWidth: '200px', maxWidth: '200px' },
  orderNumber: { minWidth: '200px', maxWidth: '200px' },
  orderCreatedAt: { minWidth: '200px', maxWidth: '200px' },
  isReorder: { minWidth: '200px', maxWidth: '200px' },
  pspOrderReference: { minWidth: '200px', maxWidth: '200px' },
  pspAcknowledgedOn: { minWidth: '200px', maxWidth: '200px' },
  orderLineNumber: { minWidth: '200px', maxWidth: '200px' },
  orderStatus: { minWidth: '200px', maxWidth: '200px' },
};
