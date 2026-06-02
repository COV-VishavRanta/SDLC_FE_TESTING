'use client';
'use no memo';

import { CreatedDateCell, SortableHeader } from '@/components';
import type { OpsDashboardMetricsLineItemType } from '@/graphql';
import { ColumnDef } from '@tanstack/react-table';
import { CSSProperties } from 'react';

export function getOpsDashboardColumns(): ColumnDef<OpsDashboardMetricsLineItemType>[] {
  return [
    {
      accessorKey: 'weekLabel',
      header: ({ column }) => <SortableHeader column={column}>Week</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-primary'>{row.original.weekLabel ?? '-'}</span>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'weekStartDate',
      header: ({ column }) => <SortableHeader column={column}>Week Start</SortableHeader>,
      cell: ({ row }) => <CreatedDateCell value={row.original.weekStartDate} />,
    },

    {
      accessorKey: 'totalShipments',
      header: ({ column }) => <SortableHeader column={column}>Total Shipments</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>{row.original.totalShipments ?? '-'}</span>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'lateShipments',
      header: ({ column }) => <SortableHeader column={column}>Late Shipments</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>{row.original.lateShipments ?? '-'}</span>
      ),
    },
    {
      accessorKey: 'ordersPendingFulfillment',
      header: ({ column }) => (
        <SortableHeader column={column}>Orders Pending Fulfillment</SortableHeader>
      ),
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>
          {row.original.ordersPendingFulfillment ?? '-'}
        </span>
      ),
    },
    {
      accessorKey: 'reorderRequestsRaised',
      header: ({ column }) => (
        <SortableHeader column={column}>Reorder Requests Raised</SortableHeader>
      ),
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>
          {row.original.reorderRequestsRaised ?? '-'}
        </span>
      ),
    },
    {
      accessorKey: 'slaCompliancePercentage',
      header: ({ column }) => <SortableHeader column={column}>SLA Compliance %</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>
          {row.original.slaCompliancePercentage !== null &&
          row.original.slaCompliancePercentage !== undefined
            ? `${row.original.slaCompliancePercentage}%`
            : '—'}
        </span>
      ),
    },
  ];
}

export const OPS_DASHBOARD_COLUMN_STYLE: Record<string, CSSProperties> = {
  weekLabel: { minWidth: '200px', maxWidth: '200px' },
  weekStartDate: { minWidth: '200px', maxWidth: '200px' },
  totalShipments: { minWidth: '200px', maxWidth: '200px' },
  lateShipments: { minWidth: '200px', maxWidth: '200px' },
  ordersPendingFulfillment: { minWidth: '200px', maxWidth: '200px' },
  reorderRequestsRaised: { minWidth: '200px', maxWidth: '200px' },
  slaCompliancePercentage: { minWidth: '200px', maxWidth: '200px' },
};
