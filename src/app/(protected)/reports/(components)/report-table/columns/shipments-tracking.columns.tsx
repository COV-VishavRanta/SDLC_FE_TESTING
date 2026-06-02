'use client';
'use no memo';

import { CreatedDateCell, SortableHeader } from '@/components';
import type { ShipmentTrackingLineItemType } from '@/graphql';
import { ColumnDef } from '@tanstack/react-table';
import { CSSProperties } from 'react';

export function getShipmentsTrackingColumns(): ColumnDef<ShipmentTrackingLineItemType>[] {
  return [
    {
      accessorKey: 'shipmentNumber',
      header: ({ column }) => <SortableHeader column={column}>Shipment Number</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-primary'>{row.original.shipmentNumber ?? '-'}</span>
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
      accessorKey: 'orderNumber',
      header: ({ column }) => <SortableHeader column={column}>Order Number</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>{row.original.orderNumber ?? '-'}</span>
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
      accessorKey: 'trackingNumber',
      header: ({ column }) => <SortableHeader column={column}>Tracking Number</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>{row.original.trackingNumber ?? '-'}</span>
      ),
    },
    {
      accessorKey: 'carrierName',
      header: ({ column }) => <SortableHeader column={column}>Carrier Name</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>{row.original.carrierName ?? '-'}</span>
      ),
    },
    {
      accessorKey: 'eta',
      header: ({ column }) => <SortableHeader column={column}>ETA</SortableHeader>,
      cell: ({ row }) => <CreatedDateCell value={row.original.eta} />,
    },
    {
      accessorKey: 'quantityShipped',
      header: ({ column }) => <SortableHeader column={column}>Quantity Shipped</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>{row.original.quantityShipped ?? '-'}</span>
      ),
    },
    {
      accessorKey: 'shippedOn',
      header: ({ column }) => <SortableHeader column={column}>Shipped On</SortableHeader>,
      cell: ({ row }) => <CreatedDateCell value={row.original.shippedOn} />,
    },
    {
      accessorKey: 'deliveredOn',
      header: ({ column }) => <SortableHeader column={column}>Delivered On</SortableHeader>,
      cell: ({ row }) => <CreatedDateCell value={row.original.deliveredOn} />,
    },
    {
      accessorKey: 'shipmentStatus',
      header: ({ column }) => <SortableHeader column={column}>Shipment Status</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>{row.original.shipmentStatus ?? '-'}</span>
      ),
    },
    {
      accessorKey: 'partialShipment',
      header: ({ column }) => <SortableHeader column={column}>Partial Shipment</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>
          {row.original.partialShipment ? 'Yes' : 'No'}
        </span>
      ),
    },
  ];
}

export const SHIPMENT_TRACKING_COLUMN_STYLE: Record<string, CSSProperties> = {
  shipmentNumber: { minWidth: '200px', maxWidth: '200px' },
  campaignName: { minWidth: '200px', maxWidth: '200px' },
  orderNumber: { minWidth: '200px', maxWidth: '200px' },
  storeName: { minWidth: '200px', maxWidth: '200px' },
  storeNumber: { minWidth: '200px', maxWidth: '200px' },
  trackingNumber: { minWidth: '200px', maxWidth: '200px' },
  carrierName: { minWidth: '200px', maxWidth: '200px' },
  eta: { minWidth: '200px', maxWidth: '200px' },
  quantityShipped: { minWidth: '200px', maxWidth: '200px' },
  shippedOn: { minWidth: '200px', maxWidth: '200px' },
  deliveredOn: { minWidth: '200px', maxWidth: '200px' },
  shipmentStatus: { minWidth: '200px', maxWidth: '200px' },
  partialShipment: { minWidth: '200px', maxWidth: '200px' },
};
