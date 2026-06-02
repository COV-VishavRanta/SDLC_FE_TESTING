'use client';
'use no memo';

import { TablePagination } from '@/components';
import { Card } from '@/components/ui/card';
import {
  DataTableBody,
  Table,
  TableCaption,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getAriaSort } from '@/lib/utils';
import { SurveyListItemType } from '@/types';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { CSSProperties, useContext, useState } from 'react';

import { useCapabilities } from '@/hooks';
import {
  DEFAULT_SURVEY_CAPABILITIES,
  SURVEY_CAPABILITIES_MAP,
} from '@/lib/permissions/capabilities/survey.capabilities';

import { SurveyManagementContext } from '../../context/SurveyManagementContext';
import { DeleteSurveyDialog } from '../dialog/delete-survey-dialog/delete-survey-dialog';
import { ViewResponseDialog } from '../dialog/view-response-dialog/view-response-dialog';
import { getSurveyColumns } from './survey-table-columns';
import { SurveyTableInlineLoading } from './survey-table.loading';

const COLUMN_STYLE: Record<string, CSSProperties> = {
  name: { maxWidth: '320px' },
  responseCount: { maxWidth: '160px' },
  brandAssigned: { maxWidth: '200px' },
  status: { maxWidth: '120px' },
  actions: { width: '280px' },
};

export function SurveyTable() {
  const t = useTranslations('surveyManagement');
  const capabilities = useCapabilities(SURVEY_CAPABILITIES_MAP, DEFAULT_SURVEY_CAPABILITIES);
  const {
    surveyList,
    surveyPaginationInfo,
    surveyLoading,
    surveySorting,
    setSurveySorting,
    surveyPagination,
    setSurveyPagination,
    handleDeleteSurvey,
    setSurveyToDelete,
    surveyToDelete,
  } = useContext(SurveyManagementContext);

  const [localSurveyToDelete, setLocalSurveyToDelete] = useState<SurveyListItemType | null>(null);
  const [surveyForViewResponse, setSurveyForViewResponse] = useState<SurveyListItemType | null>(
    null,
  );

  const columns = getSurveyColumns({
    t,
    onDelete: setLocalSurveyToDelete,
    onViewResponse: setSurveyForViewResponse,
    capabilities,
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: surveyList,
    columns,
    getCoreRowModel: getCoreRowModel(),

    /* ── Server-side: disable all client-side processing ── */
    manualSorting: true,
    manualPagination: true,

    /* ── Page / row counts from the API ── */
    pageCount: surveyPaginationInfo?.totalPages ?? 0,
    rowCount: surveyPaginationInfo?.totalCount,

    /* ── Controlled state ── */
    state: {
      sorting: surveySorting,
      pagination: surveyPagination,
    },
    onSortingChange: setSurveySorting,
    onPaginationChange: setSurveyPagination,
  });

  const totalCount = surveyPaginationInfo?.totalCount ?? 0;
  const startRow = totalCount > 0 ? surveyPagination.pageIndex * surveyPagination.pageSize + 1 : 0;
  const endRow = Math.min((surveyPagination.pageIndex + 1) * surveyPagination.pageSize, totalCount);

  const rowsOnPage =
    totalCount > 0 &&
    Math.ceil(totalCount / surveyPagination.pageSize) === surveyPagination.pageIndex + 1
      ? endRow - startRow + 1
      : surveyPagination.pageSize;

  const surveyForDelete = localSurveyToDelete ?? surveyToDelete;

  return (
    <>
      <Card className='overflow-clip rounded-xl border border-border p-0'>
        {/* sr-only live region announces loading state to screen readers (WCAG 4.1.3) */}
        <div aria-live='polite' aria-atomic='true' className='sr-only'>
          {surveyLoading ? t('table.loadingState') : ''}
        </div>

        <Table containerClassName='max-h-[70vh]' aria-busy={surveyLoading}>
          <TableCaption>{t('table.caption')}</TableCaption>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    aria-sort={getAriaSort(header)}
                    style={COLUMN_STYLE[header.id]}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <DataTableBody
            table={table}
            isLoading={surveyLoading}
            loadingContent={<SurveyTableInlineLoading rowCount={rowsOnPage} columnCount={columns.length} />}
            emptyMessage={t('table.emptyState')}
          />
        </Table>

        {/* Pagination Footer */}
        <TableFooter role='navigation' aria-label='Table pagination'>
          <TablePagination
            table={table}
            totalCount={totalCount}
            startRow={startRow}
            endRow={endRow}
            entityLabel={t('table.paginationLabel')}
          />
        </TableFooter>
      </Card>

      {surveyForDelete !== null && (
        <DeleteSurveyDialog
          surveyName={surveyForDelete.name}
          onConfirm={() => {
            handleDeleteSurvey(surveyForDelete.id).catch(() => undefined);
            setLocalSurveyToDelete(null);
            setSurveyToDelete(null);
          }}
          onCancel={() => {
            setLocalSurveyToDelete(null);
            setSurveyToDelete(null);
          }}
        />
      )}

      {surveyForViewResponse !== null && (
        <ViewResponseDialog
          surveyResponseId={surveyForViewResponse.surveyResponseId ?? ''}
          onClose={() => {
            setSurveyForViewResponse(null);
          }}
        />
      )}
    </>
  );
}
