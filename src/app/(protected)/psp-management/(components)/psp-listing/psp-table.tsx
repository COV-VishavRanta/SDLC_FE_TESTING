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
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { CSSProperties, useContext } from 'react';

import { PspManagementContext } from '../../context/PspManagementContext';
import { usePspTableColumns } from './psp-table-columns';
import { PspTableInlineLoading } from './psp-table.loading';

const COLUMN_STYLE: Record<string, CSSProperties> = {
  name: { maxWidth: '200px' },
  admins: { maxWidth: '220px' },
  isActive: { maxWidth: '105px' },
  createdAt: { maxWidth: '130px' },
  actions: { maxWidth: '130px' },
};

export function PspTable() {
  const t = useTranslations('pspManagement');
  const translatedColumns = usePspTableColumns();
  const { pspList, paginationInfo, loading, sorting, setSorting, pagination, setPagination } =
    useContext(PspManagementContext);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: pspList,
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
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: (e) => setPagination(e),
  });

  const totalCount = paginationInfo?.totalCount ?? 0;
  const startRow = totalCount > 0 ? pagination.pageIndex * pagination.pageSize + 1 : 0;
  const endRow = Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalCount);

  // calculate number of rows to show while loading
  // use pageSize unless we are on the last page and know the total count
  const rowsOnPage =
    totalCount > 0 && Math.ceil(totalCount / pagination.pageSize) === pagination.pageIndex + 1
      ? endRow - startRow + 1
      : pagination.pageSize;

  return (
    <Card className='overflow-clip rounded-xl border border-border p-0'>
      {/* sr-only live region announces loading state to screen readers (WCAG 4.1.3) */}
      <div aria-live='polite' aria-atomic='true' className='sr-only'>
        {loading ? t('table.loadingState') : ''}
      </div>

      {/* Table */}
      {/* aria-busy informs AT that content is being updated (WCAG 4.1.2) */}
      <Table aria-busy={loading}>
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
          isLoading={loading}
          emptyMessage={t('table.emptyState')}
          loadingContent={<PspTableInlineLoading rowCount={rowsOnPage} />}
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
  );
}
