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

import { CampaignManagementContext } from '../../context/CampaignManagementContext';
import { getCampaignColumns } from './campaign-table-columns';
import { CampaignTableInlineLoading } from './campaign-table.loading';

// External configuration for column styles (e.g. widths) to keep the component clean
const COLUMN_STYLE: Record<string, CSSProperties> = {
  name: {
    maxWidth: '200px',
  },
  brandName: {
    maxWidth: '160px',
  },
  totalQuantity: {
    maxWidth: '80px',
  },
  type: {
    maxWidth: '120px',
  },
  status: {
    maxWidth: '100px',
  },
  storeCount: {
    maxWidth: '80px',
  },
  promotions: {
    maxWidth: '80px',
  },
  createdAt: {
    maxWidth: '120px',
  },
  startDate: {
    maxWidth: '120px',
  },
  shipByDate: {
    maxWidth: '120px',
  },
  actions: {
    maxWidth: '120px',
  },
};

export function CampaignTable() {
  const {
    campaignList,
    paginationInfo,
    loading,
    sorting,
    setSorting,
    pagination,
    setPagination,
    capabilities,
  } = useContext(CampaignManagementContext);

  const t = useTranslations('campaignManagement');

  const columns = getCampaignColumns(t, capabilities);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: campaignList,
    columns,
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
      <div aria-live='polite' aria-atomic='true' className='sr-only' suppressHydrationWarning>
        {loading ? t('table.loadingMessage') : ''}
      </div>
      <Table suppressHydrationWarning>
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
          emptyMessage={t('table.noCampaigns')}
          // Pass the specific loader for this table
          loadingContent={<CampaignTableInlineLoading rowCount={rowsOnPage} />}
          // Pass the specific styling for this table's rows
        />
      </Table>

      <TableFooter role='navigation' aria-label='Table pagination'>
        <TablePagination
          table={table}
          totalCount={totalCount}
          startRow={startRow}
          endRow={endRow}
          entityLabel={t('table.entityLabel')}
        />
      </TableFooter>
    </Card>
  );
}
