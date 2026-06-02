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
import { SurveyTemplateType } from '@/types';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { CSSProperties, useContext, useState } from 'react';

import { SurveyManagementContext } from '../../context/SurveyManagementContext';
import { DeleteTemplateDialog } from '../dialog/delete-template-dialog/delete-template-dialog';
import { getTemplateColumns } from './template-table-columns';
import { TemplateTableInlineLoading } from './template-table.loading';

const COLUMN_STYLE: Record<string, CSSProperties> = {
  name: { maxWidth: '450px' },
  surveyCount: { maxWidth: '240px' },
  createdAt: { maxWidth: '240px' },
  actions: { width: '250px' },
};

export function TemplateTable() {
  const t = useTranslations('surveyManagement');
  const {
    templateList,
    templatePaginationInfo,
    templateLoading,
    templateSorting,
    setTemplateSorting,
    templatePagination,
    setTemplatePagination,
    handleDeleteSurveyTemplate,
  } = useContext(SurveyManagementContext);

  const [templateToDelete, setTemplateToDelete] = useState<SurveyTemplateType | null>(null);

  const columns = getTemplateColumns({ t, onDelete: setTemplateToDelete });

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: templateList,
    columns,
    getCoreRowModel: getCoreRowModel(),

    /* ── Server-side: disable all client-side processing ── */
    manualSorting: true,
    manualPagination: true,

    /* ── Page / row counts from the API ── */
    pageCount: templatePaginationInfo?.totalPages ?? 0,
    rowCount: templatePaginationInfo?.totalCount,

    /* ── Controlled state ── */
    state: {
      sorting: templateSorting,
      pagination: templatePagination,
    },
    onSortingChange: setTemplateSorting,
    onPaginationChange: setTemplatePagination,
  });

  const totalCount = templatePaginationInfo?.totalCount ?? 0;
  const startRow =
    totalCount > 0 ? templatePagination.pageIndex * templatePagination.pageSize + 1 : 0;
  const endRow = Math.min(
    (templatePagination.pageIndex + 1) * templatePagination.pageSize,
    totalCount,
  );

  const rowsOnPage =
    totalCount > 0 &&
    Math.ceil(totalCount / templatePagination.pageSize) === templatePagination.pageIndex + 1
      ? endRow - startRow + 1
      : templatePagination.pageSize;

  return (
    <>
      <Card className='overflow-clip rounded-xl border border-border p-0'>
        {/* sr-only live region announces loading state to screen readers (WCAG 4.1.3) */}
        <div aria-live='polite' aria-atomic='true' className='sr-only'>
          {templateLoading ? t('template.table.loadingState') : ''}
        </div>

        <Table containerClassName='max-h-[70vh]' aria-busy={templateLoading}>
          <TableCaption>{t('template.table.caption')}</TableCaption>
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
            isLoading={templateLoading}
            loadingContent={<TemplateTableInlineLoading rowCount={rowsOnPage} />}
            emptyMessage={t('template.table.emptyState')}
          />
        </Table>

        {/* Pagination Footer */}
        <TableFooter role='navigation' aria-label='Table pagination'>
          <TablePagination
            table={table}
            totalCount={totalCount}
            startRow={startRow}
            endRow={endRow}
            entityLabel={t('template.table.paginationLabel')}
          />
        </TableFooter>
      </Card>

      {templateToDelete !== null && (
        <DeleteTemplateDialog
          templateName={templateToDelete.name}
          onConfirm={() => {
            handleDeleteSurveyTemplate(templateToDelete.id);
            setTemplateToDelete(null);
          }}
          onCancel={() => {
            setTemplateToDelete(null);
          }}
        />
      )}
    </>
  );
}
