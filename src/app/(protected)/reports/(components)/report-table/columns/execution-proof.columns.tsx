'use client';
'use no memo';

import {
  ActionButtonCell,
  CreatedDateCell,
  SortableHeader,
  ViewInstallationProof,
} from '@/components';
import type { ExecutionProofLineItemType } from '@/graphql';
import { ColumnDef } from '@tanstack/react-table';
import { CSSProperties } from 'react';

interface GetExecutionProofColumnsOptions {
  onViewImages?: (urls: string[]) => void;
}

export function getExecutionProofColumns(
  options?: GetExecutionProofColumnsOptions,
): ColumnDef<ExecutionProofLineItemType>[] {
  const { onViewImages } = options ?? {};
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
      accessorKey: 'orderNumber',
      header: ({ column }) => <SortableHeader column={column}>Order Number</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>{row.original.orderNumber ?? '-'}</span>
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
      accessorKey: 'itemQuantity',
      header: ({ column }) => <SortableHeader column={column}>Item Quantity</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>{row.original.itemQuantity ?? '-'}</span>
      ),
    },
    {
      accessorKey: 'proofSubmittedOn',
      header: ({ column }) => <SortableHeader column={column}>Proof Submitted On</SortableHeader>,
      cell: ({ row }) => <CreatedDateCell value={row.original.proofSubmittedOn} />,
    },
    {
      accessorKey: 'proofVerificationStatus',
      header: ({ column }) => (
        <SortableHeader column={column}>Proof Verification Status</SortableHeader>
      ),
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>
          {row.original.proofVerificationStatus ?? '-'}
        </span>
      ),
    },
    {
      accessorKey: 'installationRejectionReason',
      header: () => <span className='uppercase'>Installation Rejection Reason</span>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>
          {row.original.installationRejectionReason ?? '-'}
        </span>
      ),
    },
    {
      accessorKey: 'approvedPhotoCount',
      header: ({ column }) => <SortableHeader column={column}>Approved Photo Count</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>
          {row.original.approvedPhotoCount ?? '-'}
        </span>
      ),
    },

    {
      accessorKey: 'attestedBy',
      header: ({ column }) => <SortableHeader column={column}>Attested By</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>{row.original.attestedBy ?? '-'}</span>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'attestedOn',
      header: ({ column }) => <SortableHeader column={column}>Attested On</SortableHeader>,
      cell: ({ row }) => <CreatedDateCell value={row.original.attestedOn} />,
    },
    ...(onViewImages
      ? [
          {
            accessorKey: 'proofImageLinks',
            header: () => (
              <span className='flex w-full justify-end uppercase'>Proof Image Links</span>
            ),
            cell: ({ row }: { row: { original: ExecutionProofLineItemType } }) => {
              const urls = row.original.proofImageLinks ?? [];
              if (urls.length === 0) return null;
              return (
                <div className='flex items-center justify-end'>
                  <ActionButtonCell
                    icon={
                      <ViewInstallationProof className='size-4 text-primary' aria-hidden='true' />
                    }
                    tooltip={`View proof images for ${row.original.itemName ?? 'item'}`}
                    onClick={() => onViewImages(urls)}
                    className='hover:bg-muted'
                  />
                </div>
              );
            },
          } satisfies ColumnDef<ExecutionProofLineItemType>,
        ]
      : []),
  ];
}

export const EXCEPTION_PROOF_COLUMN_STYLE: Record<string, CSSProperties> = {
  campaignName: { minWidth: '200px', maxWidth: '200px' },
  storeName: { minWidth: '200px', maxWidth: '200px' },
  storeNumber: { minWidth: '200px', maxWidth: '200px' },
  orderNumber: { minWidth: '200px', maxWidth: '200px' },
  itemName: { minWidth: '200px', maxWidth: '200px' },
  itemQuantity: { minWidth: '200px', maxWidth: '200px' },
  proofSubmittedOn: { minWidth: '200px', maxWidth: '200px' },
  proofVerificationStatus: { minWidth: '200px', maxWidth: '200px' },
  installationRejectionReason: { minWidth: '260px', maxWidth: '260px' },
  approvedPhotoCount: { minWidth: '220px', maxWidth: '220px' },
  attestedBy: { minWidth: '200px', maxWidth: '200px' },
  attestedOn: { minWidth: '200px', maxWidth: '200px' },
  proofImageLinks: { minWidth: '200px', maxWidth: '200px' },
};
