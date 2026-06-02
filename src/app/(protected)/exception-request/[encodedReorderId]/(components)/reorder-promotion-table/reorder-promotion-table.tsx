'use client';
'use no memo';

import {
  Button,
  CloseIcon,
  DataTableBody,
  Input,
  SearchIcon,
  Table,
  TableFooter,
  TableHead,
  TableHeader,
  TablePagination,
  TableRow,
} from '@/components';
import ViewImagesDialog from '@/components/dialog/view-images-dialog/view-images-dialog';
import { flexRender } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import ExceptionRequestDialog, {
  ExceptionDialogMode,
} from '../../../../shipments/[id]/(components)/exception-request-dialog/exception-request-dialog';
import { useReorderDetails } from '../../context/ReorderDetailsContext';
import useReorderPromotionTable from './useReorderPromotionTable';

export default function ReorderPromotionTable() {
  const {
    exceptionRequest,
    caps,
    isExceptionDialogOpen,
    setIsExceptionDialogOpen,
    isViewPhotosOpen,
    setIsViewPhotosOpen,
    handleReUpload,
  } = useReorderDetails();
  const t = useTranslations('reorderDetails');

  const items = useMemo(() => exceptionRequest?.items ?? [], [exceptionRequest?.items]);

  const { table, searchQuery, handleSearch, totalDiscrepancyQty, totalCount, startRow, endRow } =
    useReorderPromotionTable(items);

  const totalPromotions = exceptionRequest?.items?.length ?? 0;
  const imageUrls = useMemo(
    () => (exceptionRequest?.images ?? []).map((img) => img.url),
    [exceptionRequest?.images],
  );

  const shipmentId = exceptionRequest?.shipmentId ?? '';

  return (
    <>
      {/* Section Header */}
      <div className='flex flex-wrap items-center gap-3'>
        <h2 className='mr-auto text-[20px] font-semibold leading-[30px] text-[#1a1d21]'>
          {t('table.title')}
        </h2>

        {/* Search input */}
        <div className='relative w-full sm:w-[260px]'>
          <div className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary'>
            <SearchIcon className='size-[16px]' aria-hidden='true' />
          </div>
          <Input
            type='text'
            placeholder={t('table.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className='h-9 pl-9 pr-8 text-[14px] bg-white sm:h-[47px]'
            aria-label={t('table.searchAriaLabel')}
          />
          {searchQuery && (
            <button
              type='button'
              onClick={() => handleSearch('')}
              aria-label={t('table.clearSearchAriaLabel')}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-heading'
            >
              <CloseIcon className='size-[14px]' />
            </button>
          )}
        </div>

        {/* View Photos button */}
        {caps.canViewPhotos && imageUrls.length > 0 && (
          <Button type='button' onClick={() => setIsViewPhotosOpen(true)}>
            {t('table.viewPhotos')}
          </Button>
        )}

        {/* Promotions count badge */}

        <span className='inline-flex items-center gap-1 rounded-full border border-[var(--primary-500)] bg-[var(--primary-300)] px-2 py-0.5 text-[12px] font-medium leading-[20px] text-[var(--primary-500)]'>
          {t('table.badge', { count: totalPromotions })}
        </span>
      </div>

      {/* Table */}
      <div className='overflow-hidden rounded-[8px] border border-[var(--neutral-300)]'>
        <Table>
          <TableHeader className='bg-[var(--neutral-200)]'>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className='border-b border-[var(--neutral-300)]'>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className='px-6 py-3 text-[12px] font-medium uppercase tracking-[-0.15px] text-[var(--neutral-600)]'
                    aria-sort={
                      header.column.getCanSort()
                        ? header.column.getIsSorted() === 'asc'
                          ? 'ascending'
                          : header.column.getIsSorted() === 'desc'
                            ? 'descending'
                            : 'none'
                        : undefined
                    }
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <DataTableBody table={table} emptyMessage={t('table.noItems')} loadingContent={<div />} />

          {/* Total Items row */}
          {totalCount > 0 && (
            <tfoot>
              <tr className='border-t border-[var(--neutral-300)] bg-[var(--neutral-200)]'>
                <td
                  colSpan={4}
                  className='px-[var(--table-cell-px)] py-[var(--table-cell-py)] text-[14px] font-semibold leading-[20px] text-[var(--neutral-900)]'
                >
                  {t('table.totalItems')}
                </td>
                <td className='px-[var(--table-cell-px)] py-[var(--table-cell-py)] text-[14px] font-semibold leading-[20px] text-[var(--neutral-900)]'>
                  {totalDiscrepancyQty}
                </td>
              </tr>
            </tfoot>
          )}
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
      </div>

      {/* Store Admin: Re Upload Photos dialog */}
      <ExceptionRequestDialog
        type={ExceptionDialogMode.EXCEPTION_REQUEST}
        isOpen={isExceptionDialogOpen}
        shipmentId={shipmentId}
        onSubmit={handleReUpload}
        onClose={() => setIsExceptionDialogOpen(false)}
      />

      {/* Brand Admin: View Photos dialog */}
      <ViewImagesDialog
        open={isViewPhotosOpen}
        onClose={() => setIsViewPhotosOpen(false)}
        title={t('table.viewPhotosTitle')}
        imageUrls={imageUrls}
      />
    </>
  );
}
