'use client';

import { DEFAULT_PAGE_SIZE } from '@/constant';
import { ExceptionRequestItemType } from '@/types';
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

import { getReorderPromotionColumns } from './reorder-promotion-columns';

const MIN_QUANTITY = 0;

export default function useReorderPromotionTable(items: ExceptionRequestItemType[]) {
  const tColumns = useTranslations('reorderDetails.table.columns');

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'promotionName',
      desc: false,
    },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const searchQuery = (columnFilters.find((f) => f.id === 'promotionName')?.value as string) ?? '';

  const handleSearch = (value: string) => {
    setColumnFilters(value ? [{ id: 'promotionName', value }] : []);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const totalDiscrepancyQty = useMemo(
    () => items.reduce((sum, item) => sum + (item.requestedQuantity ?? MIN_QUANTITY), MIN_QUANTITY),
    [items],
  );

  const columns = useMemo(() => getReorderPromotionColumns(tColumns), [tColumns]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: false,
    state: { sorting, columnFilters, pagination },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
  });

  const totalCount = table.getFilteredRowModel().rows.length;
  const lastPageIndex =
    totalCount > 0 ? Math.ceil(totalCount / pagination.pageSize) - 1 : MIN_QUANTITY;
  const safePageIndex = Math.min(pagination.pageIndex, lastPageIndex);
  const startRow = totalCount > 0 ? safePageIndex * pagination.pageSize + 1 : MIN_QUANTITY;
  const endRow =
    totalCount > 0 ? Math.min((safePageIndex + 1) * pagination.pageSize, totalCount) : MIN_QUANTITY;

  return {
    table,
    searchQuery,
    handleSearch,
    totalDiscrepancyQty,
    totalCount,
    startRow,
    endRow,
  } as const;
}
