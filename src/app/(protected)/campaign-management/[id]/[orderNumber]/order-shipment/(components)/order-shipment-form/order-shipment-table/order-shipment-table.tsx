'use client';

import {
  Button,
  CloseIcon,
  Input,
  NoRecordFound,
  SearchIcon,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TablePagination,
  TableRow,
} from '@/components';
import { flexRender } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { useContext } from 'react';

import { OrderShipmentContext } from '../../../context/OrderShipmentContext';

// ─── Column width constants (matching Figma proportions) ──────────────────────
const columnWidths: Record<string, string> = {
  promotionName: 'w-[38%] min-w-[200px]',
  totalQuantity: 'w-[15%] min-w-[120px]',
  shippedQuantity: 'w-[15%] min-w-[120px]',
  remainingQuantity: 'w-[15%] min-w-[120px]',
  shipQuantity: 'w-[17%] min-w-[140px]',
};

export function OrderShipmentTable() {
  const t = useTranslations('campaignManagement.createShipment');
  const tTable = useTranslations('campaignManagement.createShipment.pendingShipment');
  const {
    table,
    storeName,
    handleClearAll,
    isSubmitting,
    hasAnyShipQty,
    hasAnyRemainingQty,
    onShipAll,
    handleCancel,
    searchQuery,
    handleSearch,
    startRow,
    endRow,
    totalCount,
  } = useContext(OrderShipmentContext);

  const { rows } = table.getRowModel();

  return (
    <>
      {/* ── Promotions Pending Shipment ── */}
      <div className='flex flex-col gap-3'>
        {/* Heading row */}
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <h3 className='shrink-0 text-base font-semibold text-text-heading'>{tTable('title')}</h3>
          <div className='flex w-full items-center gap-3 sm:w-auto'>
            {/* Search input */}
            <div className='relative flex-1 sm:w-full sm:max-w-[260px] sm:flex-none'>
              <div className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary'>
                <SearchIcon className='size-[16px]' aria-hidden='true' />
              </div>
              <Input
                type='text'
                placeholder={tTable('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className='pl-9 sm:h-[47px] pr-9 text-[14px] bg-white'
                aria-label={tTable('searchAriaLabel')}
              />
              {searchQuery && (
                <button
                  type='button'
                  onClick={() => handleSearch('')}
                  aria-label={tTable('clearSearchAriaLabel')}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-heading'
                >
                  <CloseIcon className='size-[14px]' />
                </button>
              )}
            </div>
            <Button
              type='button'
              variant='outline'
              className='shrink-0 rounded-lg border-[var(--primary-500)] bg-transparent px-3 sm:px-6 bg-gradient-to-b from-[var(--primary-500)] to-[var(--primary-600)] bg-clip-text text-sm sm:text-base font-medium text-transparent hover:opacity-80'
              onClick={onShipAll}
              disabled={isSubmitting || !hasAnyRemainingQty}
              aria-label={tTable('shipAllAriaLabel')}
            >
              {tTable('shipAll')}
            </Button>
            <Button
              type='button'
              variant='outline'
              className='shrink-0 rounded-lg border-[var(--primary-500)] bg-transparent px-3 sm:px-6 bg-gradient-to-b from-[var(--primary-500)] to-[var(--primary-600)] bg-clip-text text-sm sm:text-base font-medium text-transparent hover:opacity-80'
              onClick={handleClearAll}
              aria-label={tTable('clearAllAriaLabel')}
            >
              {tTable('clearAll')}
            </Button>
          </div>
        </div>

        {/* Bordered table container */}
        {rows.length === 0 ? (
          <NoRecordFound message={tTable('noPromotions')} />
        ) : (
          <div className='overflow-hidden rounded-lg border border-border'>
            <div className='overflow-x-auto overflow-y-auto'>
              <Table className='min-w-[800px]' aria-label={tTable('tableCaption', { storeName })}>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className={columnWidths[header.id]}
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

                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <TableFooter role='navigation' aria-label='Table pagination'>
              <TablePagination
                table={table}
                totalCount={totalCount}
                startRow={startRow}
                endRow={endRow}
                entityLabel={tTable('entityLabel')}
              />
            </TableFooter>
          </div>
        )}
      </div>

      {/* ── Footer Actions ── */}
      <div className='flex items-center justify-end gap-5'>
        <Button
          type='button'
          variant='outline'
          className='border border-[var(--neutral-300)] bg-[var(--neutral-200)] text-[var(--neutral-900)] hover:bg-[var(--neutral-300)]'
          onClick={handleCancel}
          aria-label={t('cancelButton')}
        >
          {t('cancelButton')}
        </Button>
        <Button
          type='submit'
          disabled={isSubmitting || !hasAnyShipQty}
          aria-disabled={isSubmitting || !hasAnyShipQty}
          aria-label={isSubmitting ? t('creatingButton') : t('createButton')}
        >
          {isSubmitting ? t('creatingButton') : t('createButton')}
        </Button>
      </div>
    </>
  );
}
