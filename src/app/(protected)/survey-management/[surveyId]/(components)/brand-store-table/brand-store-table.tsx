'use no memo';
'use client';

import { ViewResponseDialog } from '@/app/(protected)/survey-management/(components)/dialog/view-response-dialog/view-response-dialog';
import {
  Card,
  DataTableBody,
  Skeleton,
  Table,
  TableCaption,
  TableFooter,
  TableHead,
  TableHeader,
  TablePagination,
  TableRow,
} from '@/components';
import { DEFAULT_PAGE_SIZE, INITIAL_PAGE_INDEX } from '@/constant';
import { getAriaSort } from '@/lib/utils';
import { SurveyStoreDetailRow } from '@/types';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { getBrandStoreColumns } from './brand-store-columns';

const COLUMN_STYLE: Record<string, React.CSSProperties> = {
  storeName: { width: '300px' },
  status: { width: '160px' },
  actions: { width: '160px' },
};

interface BrandStoreTableProps {
  stores: SurveyStoreDetailRow[];
  brandName: string;
}

function BrandStoreTableSkeletonRows({ count }: { count: number }) {
  return Array.from({ length: count }).map((_, i) => (
    <TableRow key={`sk-${i}`} className='h-[56px] border-b border-border last:border-b-0'>
      <td className='px-5 py-3'>
        <Skeleton className='h-4 w-36 rounded-full' />
      </td>
      <td className='px-5 py-3'>
        <Skeleton className='h-6 w-20 rounded-full' />
      </td>
      <td className='px-5 py-3 text-right'>
        <Skeleton className='ml-auto h-4 w-24 rounded-full' />
      </td>
    </TableRow>
  ));
}

export function BrandStoreTable({ stores, brandName }: BrandStoreTableProps) {
  const t = useTranslations('surveyManagement.details');

  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: INITIAL_PAGE_INDEX,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [responseRow, setResponseRow] = useState<SurveyStoreDetailRow | null>(null);

  const columns = getBrandStoreColumns({ t, onViewResponse: setResponseRow });

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: stores,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
  });

  const totalCount = stores.length;
  const { pageIndex, pageSize } = pagination;
  const startRow = totalCount > 0 ? pageIndex * pageSize + 1 : 0;
  const endRow = Math.min((pageIndex + 1) * pageSize, totalCount);

  return (
    <>
      <Card className='overflow-clip rounded-xl border border-[#e5e7eb] bg-white p-px'>
        <Table aria-label={t('storesOf', { brandName })}>
          <TableCaption>{t('responses.columns.storeName')}</TableCaption>
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
            isLoading={false}
            loadingContent={<BrandStoreTableSkeletonRows count={pageSize} />}
            emptyMessage={t('responses.empty')}
          />
        </Table>

        <TableFooter role='navigation' aria-label='Store table pagination'>
          <TablePagination
            table={table}
            totalCount={totalCount}
            startRow={startRow}
            endRow={endRow}
            entityLabel={t('responses.paginationLabel')}
          />
        </TableFooter>
      </Card>

      {responseRow !== null && (
        <ViewResponseDialog
          storeName={responseRow.storeName}
          surveyResponseId={responseRow.surveyResponseId ?? ''}
          onClose={() => setResponseRow(null)}
        />
      )}
    </>
  );
}
