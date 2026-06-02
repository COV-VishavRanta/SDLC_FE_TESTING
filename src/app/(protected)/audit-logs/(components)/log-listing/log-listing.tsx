'use client';
'use no memo';

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
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { CSSProperties, useContext } from 'react';

import { TablePagination } from '@/components';
import { getAriaSort } from '@/lib/utils';
import { AuditLogContext } from '../../context/AuditLogContext';
import { useAuditLogTableColumns } from './log-table-columns';
import { LogTableInlineLoading } from './log-table.loading';

const COLUMN_STYLE: Record<string, CSSProperties> = {
  actorUserId: { maxWidth: '200px' },
  role: { maxWidth: '140px' },
  action: { maxWidth: '200px' },
  createdAt: { maxWidth: '140px' },
  entityType: { maxWidth: '150px' },
  actorType: { maxWidth: '130px' },
  details: { maxWidth: '60px' },
};

export default function LogListing() {
  const t = useTranslations('auditLogs');
  const translatedColumns = useAuditLogTableColumns();
  const { logs, paginationInfo, loading, pagination, setPagination } = useContext(AuditLogContext);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: logs,
    columns: translatedColumns,
    getCoreRowModel: getCoreRowModel(),

    /* ── Server-side: disable all client-side processing ── */
    manualSorting: true,
    manualPagination: true,

    /* ── Page / row counts from the API ── */
    pageCount: paginationInfo?.totalPages ?? 0,
    rowCount: paginationInfo?.totalCount,

    /* ── Controlled state ── */
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
  });

  const totalCount = paginationInfo?.totalCount ?? 0;
  const startRow = totalCount > 0 ? pagination.pageIndex * pagination.pageSize + 1 : 0;
  const endRow = Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalCount);

  return (
    <Card className='overflow-clip rounded-xl border border-border p-0'>
      {/* sr-only live region announces loading state to screen readers (WCAG 4.1.3) */}
      <div aria-live='polite' aria-atomic='true' className='sr-only'>
        {loading ? t('listing.loadingState') : ''}
      </div>

      {/* Table */}
      {/* aria-busy informs AT that content is being updated (WCAG 4.1.2) */}
      <div className='overflow-x-auto'>
        <Table className='' aria-busy={loading}>
          <TableCaption>{t('listing.caption')}</TableCaption>
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
            isLoading={loading}
            emptyMessage={t('listing.empty')}
            loadingContent={
              <LogTableInlineLoading rowCount={endRow - startRow + 1 || pagination.pageSize} />
            }
          />
        </Table>
      </div>

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
  );
}
