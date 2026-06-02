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

import { InventoryManagementContext } from '../../context/InventoryManagementContext';
import { getInventoryColumns } from './inventory-table-columns';
import { InventoryTableInlineLoading } from './inventory-table.loading';

const COLUMN_STYLE: Record<string, CSSProperties> = {
  name: { maxWidth: '220px' },
  brandId: { maxWidth: '220px' },
  quantity: { maxWidth: '160px' },
  actions: { maxWidth: '140px' },
};

export function InventoryTable() {
  const t = useTranslations('inventoryManagement');
  const inventoryColumns = getInventoryColumns(t);
  const { inventoryList, paginationInfo, loading, sorting, setSorting, pagination, setPagination } =
    useContext(InventoryManagementContext);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: inventoryList,
    columns: inventoryColumns,
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
    onPaginationChange: setPagination,
  });

  const totalCount = paginationInfo?.totalCount ?? 0;
  const startRow = totalCount > 0 ? pagination?.pageIndex * pagination.pageSize + 1 : 0;
  const endRow = Math.min((pagination?.pageIndex + 1) * pagination.pageSize, totalCount);

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
          loadingContent={<InventoryTableInlineLoading rowCount={rowsOnPage} />}
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
