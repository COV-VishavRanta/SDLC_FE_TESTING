'use client';
'use no memo';

import { CreatedDateCell, SortableHeader } from '@/components';
import type { CampaignSummaryLineItemType } from '@/graphql';
import { ColumnDef } from '@tanstack/react-table';
import { CSSProperties } from 'react';

export function getCampaignSummaryColumns(): ColumnDef<CampaignSummaryLineItemType>[] {
  return [
    {
      accessorKey: 'campaignName',
      header: ({ column }) => <SortableHeader column={column}>Campaign Name</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-primary'>{row.original.campaignName ?? '-'}</span>
      ),
    },
    {
      accessorKey: 'campaignType',
      header: ({ column }) => <SortableHeader column={column}>Campaign Type</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>{row.original.campaignType ?? '-'}</span>
      ),
    },
    {
      accessorKey: 'campaignManagerName',
      header: ({ column }) => <SortableHeader column={column}>Campaign Manager</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>
          {row.original.campaignManagerName ?? '-'}
        </span>
      ),
    },
    {
      accessorKey: 'brandName',
      header: ({ column }) => <SortableHeader column={column}>Brand Name</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>{row.original.brandName ?? '-'}</span>
      ),
    },
    {
      accessorKey: 'pspName',
      header: ({ column }) => <SortableHeader column={column}>PSP Name</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>{row.original.pspName ?? '-'}</span>
      ),
    },
    {
      accessorKey: 'campaignStatus',
      header: ({ column }) => <SortableHeader column={column}>Campaign Status</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>{row.original.campaignStatus ?? '-'}</span>
      ),
    },
    {
      accessorKey: 'campaignStartDate',
      header: ({ column }) => <SortableHeader column={column}>Campaign Start Date</SortableHeader>,
      cell: ({ row }) => <CreatedDateCell value={row.original.campaignStartDate} />,
    },
    {
      accessorKey: 'shipByDate',
      header: ({ column }) => <SortableHeader column={column}>Ship By Date</SortableHeader>,
      cell: ({ row }) => <CreatedDateCell value={row.original.shipByDate} />,
    },
    {
      accessorKey: 'campaignEndDate',
      header: ({ column }) => <SortableHeader column={column}>Campaign End Date</SortableHeader>,
      cell: ({ row }) => <CreatedDateCell value={row.original.campaignEndDate} />,
    },
    {
      accessorKey: 'totalStoresAssigned',
      header: ({ column }) => (
        <SortableHeader column={column}>Total Stores Assigned</SortableHeader>
      ),
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>
          {row.original.totalStoresAssigned ?? '-'}
        </span>
      ),
    },
    {
      accessorKey: 'storesCompleted',
      header: ({ column }) => <SortableHeader column={column}>Stores Completed</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>{row.original.storesCompleted ?? '-'}</span>
      ),
    },
    {
      accessorKey: 'completionPercentage',
      header: ({ column }) => <SortableHeader column={column}>Completion %</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>
          {row.original.completionPercentage !== null &&
          row.original.completionPercentage !== undefined
            ? `${row.original.completionPercentage}%`
            : '-'}
        </span>
      ),
    },
    {
      accessorKey: 'lateShipments',
      header: ({ column }) => <SortableHeader column={column}>Late Shipments</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>{row.original.lateShipments ?? '-'}</span>
      ),
    },
    {
      accessorKey: 'anomaliesReported',
      header: ({ column }) => <SortableHeader column={column}>Anomalies Reported</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>{row.original.anomaliesReported ?? '-'}</span>
      ),
    },
    {
      accessorKey: 'reordersRaised',
      header: ({ column }) => <SortableHeader column={column}>Reorders Raised</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>{row.original.reordersRaised ?? '-'}</span>
      ),
    },
    {
      accessorKey: 'photosRejected',
      header: ({ column }) => <SortableHeader column={column}>Photos Rejected</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>{row.original.photosRejected ?? '-'}</span>
      ),
    },
  ];
}

export const CAMPAIGN_SUMMARY_COLUMN_STYLE: Record<string, CSSProperties> = {
  campaignName: { minWidth: '200px', maxWidth: '200px' },
  campaignType: { minWidth: '200px', maxWidth: '200px' },
  campaignManagerName: { minWidth: '200px', maxWidth: '200px' },
  brandName: { minWidth: '200px', maxWidth: '200px' },
  pspName: { minWidth: '200px', maxWidth: '200px' },
  campaignStatus: { minWidth: '200px', maxWidth: '200px' },
  campaignStartDate: { minWidth: '200px', maxWidth: '200px' },
  shipByDate: { minWidth: '200px', maxWidth: '200px' },
  campaignEndDate: { minWidth: '200px', maxWidth: '200px' },
  totalStoresAssigned: { minWidth: '200px', maxWidth: '200px' },
  storesCompleted: { minWidth: '200px', maxWidth: '200px' },
  completionPercentage: { minWidth: '200px', maxWidth: '200px' },
  lateShipments: { minWidth: '200px', maxWidth: '200px' },
  anomaliesReported: { minWidth: '200px', maxWidth: '200px' },
  reordersRaised: { minWidth: '200px', maxWidth: '200px' },
  photosRejected: { minWidth: '200px', maxWidth: '200px' },
};
