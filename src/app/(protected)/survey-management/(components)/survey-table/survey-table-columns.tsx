'use client';

import { AdminCountCell, SortableHeader, SurveyStatusBadge } from '@/components';
import { SurveyListItemType } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

import { ProtectedRoute } from '@/constant/enums/route.enum';
import { encodeId, SurveyCapabilities } from '@/lib';
import Link from 'next/link';
import SurveyActionCell from './survey-action-cell';

type TranslateFn = ReturnType<typeof useTranslations<'surveyManagement'>>;

interface GetSurveyColumnsArgs {
  t: TranslateFn;
  onDelete: (survey: SurveyListItemType) => void;
  onViewResponse: (survey: SurveyListItemType) => void;
  capabilities: SurveyCapabilities;
}

export function getSurveyColumns({
  t,
  onDelete,
  onViewResponse,
  capabilities,
}: GetSurveyColumnsArgs): ColumnDef<SurveyListItemType>[] {
  return [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <SortableHeader column={column}>{t('table.columns.surveyName')}</SortableHeader>
      ),
      cell: ({ row }) => {
        const id = encodeId(row.original.id);
        const name = row.getValue('name') as string;

        if (!capabilities.canViewSurveyDetailsPage) {
          return <span className='text-[14px] font-medium leading-normal '>{name}</span>;
        }
        return (
          <Link
            href={`${ProtectedRoute.SURVEY_MANAGEMENT}/${id}`}
            className='text-sm text-table-link transition-colors hover:underline'
          >
            {name}
          </Link>
        );
      },
    },
    ...(capabilities.showResponseCountColumn
      ? ([
          {
            accessorKey: 'responseCount',
            header: () => (
              <span className='block uppercase'>{t('table.columns.responseCount')}</span>
            ),
            cell: ({ row }) => (
              <span className='text-sm font-normal leading-[20px] tracking-[-0.15px] text-[var(--neutral-700)]'>
                {row.original.responseCount}
              </span>
            ),
            enableSorting: false,
          } as ColumnDef<SurveyListItemType>,
        ] as ColumnDef<SurveyListItemType>[])
      : []),
    ...(capabilities.showBrandAssignedColumn
      ? ([
          {
            id: 'brandAssigned',
            header: () => (
              <span className='block uppercase'>{t('table.columns.brandAssigned')}</span>
            ),
            cell: ({ row }) => {
              const firstAdmin = row.original.firstBrandName;
              const totalUsers = row.original.brandCount ?? 0;
              const remainingCount = totalUsers - (firstAdmin ? 1 : 0);
              return <AdminCountCell firstAdminName={firstAdmin} remainingCount={remainingCount} />;
            },
            enableSorting: false,
          },
        ] as ColumnDef<SurveyListItemType>[])
      : []),
    ...(capabilities.showStoreAssignedColumn
      ? ([
          {
            id: 'storeAssigned',
            header: () => (
              <span className='block uppercase'>{t('table.columns.storeAssigned')}</span>
            ),
            cell: ({ row }) => {
              const firstAdmin = row.original.firstStoreName;
              const totalUsers = row.original.storeCount ?? 0;
              const remainingCount = totalUsers - (firstAdmin ? 1 : 0);
              return <AdminCountCell firstAdminName={firstAdmin} remainingCount={remainingCount} />;
            },
            enableSorting: false,
          },
        ] as ColumnDef<SurveyListItemType>[])
      : []),

    {
      accessorKey: 'status',
      header: () => <span className='block uppercase'>{t('table.columns.status')}</span>,
      cell: ({ row }) => <SurveyStatusBadge status={row.original.status} />,
      enableSorting: false,
    },
    {
      id: 'actions',
      header: () => (
        <span className='block text-right uppercase'>{t('table.columns.actions')}</span>
      ),
      cell: ({ row }) => (
        <SurveyActionCell onDelete={onDelete} onViewResponse={onViewResponse} row={row} />
      ),
      enableSorting: false,
    },
  ];
}
