'use client';
'use no memo';

import {
  ActionButtonCell,
  CreatedDateCell,
  SortableHeader,
  ViewInstallationProof,
} from '@/components';
import type { ProofReviewLineItemType } from '@/graphql';
import { ColumnDef } from '@tanstack/react-table';
import { CSSProperties } from 'react';

interface GetProofReviewColumnsOptions {
  onViewImages?: (urls: string[]) => void;
}

export function getProofReviewColumns(
  options?: GetProofReviewColumnsOptions,
): ColumnDef<ProofReviewLineItemType>[] {
  const { onViewImages } = options ?? {};
  return [
    {
      accessorKey: 'storeName',
      header: ({ column }) => <SortableHeader column={column}>Store Name</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-primary'>{row.original.storeName ?? '-'}</span>
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
      accessorKey: 'itemName',
      header: ({ column }) => <SortableHeader column={column}>Item Name</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>{row.original.itemName ?? '-'}</span>
      ),
    },
    {
      accessorKey: 'submissionDate',
      header: ({ column }) => <SortableHeader column={column}>Submission Date</SortableHeader>,
      cell: ({ row }) => <CreatedDateCell value={row.original.submissionDate} />,
    },
    {
      accessorKey: 'reviewStatus',
      header: ({ column }) => <SortableHeader column={column}>Review Status</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>{row.original.reviewStatus ?? '-'}</span>
      ),
    },
    {
      accessorKey: 'rejectionReason',
      header: () => <span className='uppercase'>Rejection Reason</span>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>{row.original.rejectionReason ?? '-'}</span>
      ),
    },
    {
      accessorKey: 'reviewerName',
      header: ({ column }) => <SortableHeader column={column}>Reviewer Name</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>{row.original.reviewerName ?? '-'}</span>
      ),
    },
    {
      accessorKey: 'reviewDate',
      header: ({ column }) => <SortableHeader column={column}>Review Date</SortableHeader>,
      cell: ({ row }) => <CreatedDateCell value={row.original.reviewDate} />,
    },
    {
      accessorKey: 'retakeRequired',
      header: ({ column }) => <SortableHeader column={column}>Retake Required</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>
          {row.original.retakeRequired ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      accessorKey: 'retakeStatus',
      header: ({ column }) => <SortableHeader column={column}>Retake Status</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>{row.original.retakeStatus ?? '-'}</span>
      ),
    },
    {
      accessorKey: 'retakeDueDate',
      header: ({ column }) => <SortableHeader column={column}>Retake Due Date</SortableHeader>,
      cell: ({ row }) => <CreatedDateCell value={row.original.retakeDueDate} />,
    },
    ...(onViewImages
      ? [
          {
            accessorKey: 'proofImageLinks',
            header: () => (
              <span className='flex w-full justify-end uppercase'>Proof Image Links</span>
            ),
            cell: ({ row }: { row: { original: ProofReviewLineItemType } }) => {
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
          } satisfies ColumnDef<ProofReviewLineItemType>,
        ]
      : []),
  ];
}

export const PROOF_REVIEW_COLUMN_STYLE: Record<string, CSSProperties> = {
  storeName: { minWidth: '200px', maxWidth: '200px' },
  storeNumber: { minWidth: '200px', maxWidth: '200px' },
  campaignName: { minWidth: '200px', maxWidth: '200px' },
  itemName: { minWidth: '200px', maxWidth: '200px' },
  submissionDate: { minWidth: '200px', maxWidth: '200px' },
  reviewStatus: { minWidth: '200px', maxWidth: '200px' },
  rejectionReason: { minWidth: '200px', maxWidth: '200px' },
  reviewerName: { minWidth: '200px', maxWidth: '200px' },
  reviewDate: { minWidth: '200px', maxWidth: '200px' },
  retakeRequired: { minWidth: '200px', maxWidth: '200px' },
  retakeStatus: { minWidth: '200px', maxWidth: '200px' },
  retakeDueDate: { minWidth: '200px', maxWidth: '200px' },
  proofImageLinks: { minWidth: '200px', maxWidth: '200px' },
};
