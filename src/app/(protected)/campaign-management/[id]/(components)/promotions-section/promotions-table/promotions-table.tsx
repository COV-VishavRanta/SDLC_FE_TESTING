'use no memo';
'use client';

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
import { TablePagination } from '@/components/ui/table-cell';
import { GetPromotionsByCampaignResponse } from '@/graphql';
import { getAriaSort } from '@/lib/utils';
import {
  flexRender,
  getCoreRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { CSSProperties, useContext } from 'react';

import { CampaignDetailsContext } from '../../../context/CampaignDetailsContext';
import { promotionColumns } from './promotions-table-columns';
import { PromotionsTableInlineLoading } from './promotions-table.loading';

interface PromotionsTableProps {
  data?: GetPromotionsByCampaignResponse;
  loading: boolean;
  pagination: PaginationState;
  setPagination: (updater: PaginationState | ((old: PaginationState) => PaginationState)) => void;
  sorting: SortingState;
  setSorting: (updater: SortingState | ((old: SortingState) => SortingState)) => void;
}

export default function PromotionsTable({
  data,
  loading,
  pagination,
  setPagination,
  sorting,
  setSorting,
}: PromotionsTableProps) {
  const t = useTranslations('campaignManagement.details.promotionsTable');
  const { campaignData } = useContext(CampaignDetailsContext);
  const campaignStatus = campaignData?.status;

  const promotions = data?.promotionsByCampaign?.promotions ?? [];
  const paginationInfo = data?.promotionsByCampaign?.pagination;

  const totalCount = paginationInfo?.totalCount ?? 0;
  const startRow = totalCount > 0 ? pagination.pageIndex * pagination.pageSize + 1 : 0;
  const endRow = Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalCount);
  const rowsOnPage =
    totalCount > 0 && Math.ceil(totalCount / pagination.pageSize) === pagination.pageIndex + 1
      ? endRow - startRow + 1
      : pagination.pageSize;

  const COLUMN_STYLE: Record<string, CSSProperties> = {
    name: { minWidth: '280px' },
    stores: { minWidth: '100px' },
    distributedQty: { minWidth: '130px' },
    reusable: { minWidth: '100px' },
    actions: { minWidth: '160px' },
  };

  const columns = promotionColumns(campaignStatus, t);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: promotions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualPagination: true,
    pageCount: paginationInfo?.totalPages ?? 0,
    rowCount: paginationInfo?.totalCount,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    state: { sorting, pagination },
  });

  return (
    <Card className='overflow-clip rounded-xl border border-border p-0'>
      <div aria-live='polite' aria-atomic='true' className='sr-only'>
        {loading ? t('loadingMessage') : ''}
      </div>
      <Table aria-busy={loading}>
        <TableCaption>{t('caption')}</TableCaption>
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
          emptyMessage={t('noPromotions')}
          loadingContent={<PromotionsTableInlineLoading rowCount={rowsOnPage} />}
        />
      </Table>
      <TableFooter role='navigation' aria-label='Table pagination'>
        <TablePagination
          table={table}
          totalCount={totalCount}
          startRow={startRow}
          endRow={endRow}
          entityLabel={t('entityLabel')}
        />
      </TableFooter>
    </Card>
  );
}
