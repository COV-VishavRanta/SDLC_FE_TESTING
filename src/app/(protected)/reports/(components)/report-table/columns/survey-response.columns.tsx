'use client';
'use no memo';

import { CreatedDateCell, SortableHeader } from '@/components';
import type { SurveyResponseLineItemType } from '@/graphql';
import { ColumnDef } from '@tanstack/react-table';
import { CSSProperties } from 'react';

export function getSurveyResponseColumns(): ColumnDef<SurveyResponseLineItemType>[] {
  return [
    {
      accessorKey: 'surveyName',
      header: ({ column }) => <SortableHeader column={column}>Survey Name</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-primary'>{row.original.surveyName ?? '-'}</span>
      ),
    },
    {
      accessorKey: 'surveyStatus',
      header: ({ column }) => <SortableHeader column={column}>Survey Status</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>{row.original.surveyStatus ?? '-'}</span>
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
      accessorKey: 'responseStatus',
      header: ({ column }) => <SortableHeader column={column}>Response Status</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>{row.original.responseStatus ?? '-'}</span>
      ),
    },
    {
      accessorKey: 'assignedAt',
      header: ({ column }) => <SortableHeader column={column}>Assigned At</SortableHeader>,
      cell: ({ row }) => <CreatedDateCell value={row.original.assignedAt} />,
    },
    {
      accessorKey: 'assignedBy',
      header: ({ column }) => <SortableHeader column={column}>Assigned By</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>{row.original.assignedBy ?? '-'}</span>
      ),
    },
    {
      accessorKey: 'submittedBy',
      header: ({ column }) => <SortableHeader column={column}>Submitted By</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>{row.original.submittedBy ?? '-'}</span>
      ),
    },
    {
      accessorKey: 'submittedAt',
      header: ({ column }) => <SortableHeader column={column}>Submitted At</SortableHeader>,
      cell: ({ row }) => <CreatedDateCell value={row.original.submittedAt} />,
    },
    // {
    //   accessorKey: 'responseData',
    //   header: ({ column }) => <SortableHeader column={column}>Response Data</SortableHeader>,
    //   cell: ({ row }) => <CreatedDateCell value={row.original.responseData} />,
    // },
  ];
}

export const SURVEY_RESPONSE_COLUMN_STYLE: Record<string, CSSProperties> = {
  surveyName: { minWidth: '200px', maxWidth: '200px' },
  surveyStatus: { minWidth: '200px', maxWidth: '200px' },
  brandName: { minWidth: '200px', maxWidth: '200px' },
  storeName: { minWidth: '200px', maxWidth: '200px' },
  storeNumber: { minWidth: '200px', maxWidth: '200px' },
  responseStatus: { minWidth: '200px', maxWidth: '200px' },
  assignedAt: { minWidth: '200px', maxWidth: '200px' },
  assignedBy: { minWidth: '200px', maxWidth: '200px' },
  submittedBy: { minWidth: '200px', maxWidth: '200px' },
  submittedAt: { minWidth: '200px', maxWidth: '200px' },
};
