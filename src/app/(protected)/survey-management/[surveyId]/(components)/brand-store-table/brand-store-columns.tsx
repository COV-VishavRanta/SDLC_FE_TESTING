'use client';

import { SortableHeader, SurveyStatusBadge } from '@/components';
import { SurveyStatusEnum } from '@/constant';
import { SurveyStoreDetailRow } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

type TranslateFn = ReturnType<typeof useTranslations<'surveyManagement.details'>>;

interface GetBrandStoreColumnsArgs {
  t: TranslateFn;
  onViewResponse: (row: SurveyStoreDetailRow) => void;
}

export function getBrandStoreColumns({
  t,
  onViewResponse,
}: GetBrandStoreColumnsArgs): ColumnDef<SurveyStoreDetailRow>[] {
  return [
    {
      accessorKey: 'storeName',
      header: ({ column }) => (
        <SortableHeader column={column}>{t('responses.columns.storeName')}</SortableHeader>
      ),
      cell: ({ row }) => (
        <span className='text-[14px] font-medium leading-normal text-[var(--neutral-900)]'>
          {row.original.storeName}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: () => <span className='block uppercase'>{t('responses.columns.status')}</span>,
      cell: ({ row }) => <SurveyStatusBadge status={row.original.status as SurveyStatusEnum} />,
      enableSorting: false,
    },
    {
      id: 'actions',
      header: () => (
        <span className='block text-right uppercase'>{t('responses.columns.actions')}</span>
      ),
      cell: ({ row }) => {
        const hasResponse = Boolean(row.original.surveyResponseId);
        if (!hasResponse) return null;
        return (
          <div className='flex justify-end'>
            <button
              type='button'
              onClick={() => onViewResponse(row.original)}
              className='text-[14px] font-medium text-[var(--primary-500)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-border)] rounded-sm'
            >
              {t('responses.viewResponse')}
            </button>
          </div>
        );
      },
      enableSorting: false,
    },
  ];
}
