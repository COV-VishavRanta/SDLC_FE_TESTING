'use client';
'use no memo';

import { CreatedDateCell, SortableHeader } from '@/components';
import type { ExceptionQueueLineItemType } from '@/graphql';
import { ColumnDef } from '@tanstack/react-table';
import { CSSProperties } from 'react';

export function getExceptionQueueColumns(): ColumnDef<ExceptionQueueLineItemType>[] {
  return [
    {
      accessorKey: 'issueNumber',
      header: ({ column }) => <SortableHeader column={column}>Issue Number</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-primary'>{row.original.issueNumber ?? '-'}</span>
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
      accessorKey: 'campaignName',
      header: ({ column }) => <SortableHeader column={column}>Campaign Name</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>{row.original.campaignName ?? '-'}</span>
      ),
    },
    {
      accessorKey: 'shipmentNumber',
      header: ({ column }) => <SortableHeader column={column}>Shipment Number</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>{row.original.shipmentNumber ?? '-'}</span>
      ),
    },
    {
      accessorKey: 'exceptionType',
      header: ({ column }) => <SortableHeader column={column}>Exception Type</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>{row.original.exceptionType ?? '-'}</span>
      ),
    },

    {
      accessorKey: 'dueDate',
      header: ({ column }) => <SortableHeader column={column}>Due Date</SortableHeader>,
      cell: ({ row }) => <CreatedDateCell value={row.original.dueDate} />,
    },
    {
      accessorKey: 'daysOverdue',
      header: ({ column }) => <SortableHeader column={column}>Days Overdue</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>{row.original.daysOverdue ?? '-'}</span>
      ),
    },
    {
      accessorKey: 'assignedRegionalAdmin',
      header: ({ column }) => (
        <SortableHeader column={column}>Assigned Regional Admin</SortableHeader>
      ),
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>
          {row.original.assignedRegionalAdmin ?? '-'}
        </span>
      ),
    },
    {
      accessorKey: 'lastActionTaken',
      header: ({ column }) => <SortableHeader column={column}>Last Action Taken</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>{row.original.lastActionTaken ?? '-'}</span>
      ),
    },
    {
      accessorKey: 'lastActionDate',
      header: ({ column }) => <SortableHeader column={column}>Last Action Date</SortableHeader>,
      cell: ({ row }) => <CreatedDateCell value={row.original.lastActionDate} />,
    },
    {
      accessorKey: 'reorderStatus',
      header: ({ column }) => <SortableHeader column={column}>Reorder Status</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>{row.original.reorderStatus ?? '-'}</span>
      ),
    },
    {
      accessorKey: 'affectedQuantity',
      header: ({ column }) => <SortableHeader column={column}>Affected Quantity</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>{row.original.affectedQuantity ?? '-'}</span>
      ),
    },
  ];
}

export const EXCEPTION_QUEUE_COLUMN_STYLE: Record<string, CSSProperties> = {
  issueNumber: { minWidth: '200px', maxWidth: '200px' },
  storeName: { minWidth: '200px', maxWidth: '200px' },
  storeNumber: { minWidth: '200px', maxWidth: '200px' },
  campaignName: { minWidth: '200px', maxWidth: '200px' },
  shipmentNumber: { minWidth: '200px', maxWidth: '200px' },
  exceptionType: { minWidth: '200px', maxWidth: '200px' },
  dueDate: { minWidth: '200px', maxWidth: '200px' },
  daysOverdue: { minWidth: '200px', maxWidth: '200px' },
  assignedRegionalAdmin: { minWidth: '200px', maxWidth: '200px' },
  lastActionTaken: { minWidth: '200px', maxWidth: '200px' },
  lastActionDate: { minWidth: '200px', maxWidth: '200px' },
  reorderStatus: { minWidth: '200px', maxWidth: '200px' },
  affectedQuantity: { minWidth: '200px', maxWidth: '200px' },
};
