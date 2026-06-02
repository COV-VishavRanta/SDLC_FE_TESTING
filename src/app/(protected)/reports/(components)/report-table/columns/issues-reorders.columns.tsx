'use client';
'use no memo';

import { CreatedDateCell, SortableHeader } from '@/components';
import type { IssueReorderLineItemType } from '@/graphql';
import { ColumnDef } from '@tanstack/react-table';
import { CSSProperties } from 'react';

export function getIssuesReordersColumns(): ColumnDef<IssueReorderLineItemType>[] {
  return [
    {
      accessorKey: 'issueNumber',
      header: ({ column }) => <SortableHeader column={column}>Issue No.</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-primary'>{row.original.issueNumber ?? '-'}</span>
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
      accessorKey: 'storeName',
      header: ({ column }) => <SortableHeader column={column}>Store Name</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>{row.original.storeName ?? '-'}</span>
      ),
    },
    {
      accessorKey: 'storeNumber',
      header: ({ column }) => <SortableHeader column={column}>Store No.</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>{row.original.storeNumber ?? '-'}</span>
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
      accessorKey: 'issueType',
      header: ({ column }) => <SortableHeader column={column}>Issue Type</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary '>{row.original.issueType ?? '-'}</span>
      ),
    },
    {
      accessorKey: 'affectedQuantity',
      header: ({ column }) => <SortableHeader column={column}>Affected Qty</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>{row.original.affectedQuantity ?? '-'}</span>
      ),
    },
    {
      accessorKey: 'issueRaisedOn',
      header: ({ column }) => <SortableHeader column={column}>Issue Raised On</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>
          <CreatedDateCell value={row.original.issueRaisedOn} />
        </span>
      ),
    },
    {
      accessorKey: 'approvalStatus',
      header: ({ column }) => <SortableHeader column={column}>Approval Status</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>{row.original.approvalStatus ?? '-'}</span>
      ),
    },
    {
      accessorKey: 'approvedBy',
      header: ({ column }) => <SortableHeader column={column}>Approved By</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>{row.original.approvedBy ?? '-'}</span>
      ),
    },
    {
      accessorKey: 'decisionDate',
      header: ({ column }) => <SortableHeader column={column}>Decision Date</SortableHeader>,
      cell: ({ row }) => <CreatedDateCell value={row.original.decisionDate} />,
      enableSorting: false,
    },
    {
      accessorKey: 'reorderNumber',
      header: ({ column }) => <SortableHeader column={column}>Reorder No.</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>{row.original.reorderNumber ?? '-'}</span>
      ),
    },
    {
      accessorKey: 'replacementShipmentNumber',
      header: ({ column }) => (
        <SortableHeader column={column}>Replacement Shipment No.</SortableHeader>
      ),
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>
          {row.original.replacementShipmentNumber ?? '-'}
        </span>
      ),
    },
  ];
}

export const ISSUE_REORDER_COLUMN_STYLE: Record<string, CSSProperties> = {
  issueNumber: { minWidth: '200px', maxWidth: '200px' },
  campaignName: { minWidth: '200px', maxWidth: '200px' },
  storeName: { minWidth: '200px', maxWidth: '200px' },
  storeNumber: { minWidth: '200px', maxWidth: '200px' },
  itemName: { minWidth: '200px', maxWidth: '200px' },
  issueType: { minWidth: '200px', maxWidth: '200px' },
  affectedQuantity: { minWidth: '200px', maxWidth: '200px' },
  issueRaisedOn: { minWidth: '200px', maxWidth: '200px' },
  approvalStatus: { minWidth: '200px', maxWidth: '200px' },
  approvedBy: { minWidth: '200px', maxWidth: '200px' },
  decisionDate: { minWidth: '200px', maxWidth: '200px' },
  reorderNumber: { minWidth: '200px', maxWidth: '200px' },
  replacementShipmentNumber: { minWidth: '200px', maxWidth: '200px' },
};
