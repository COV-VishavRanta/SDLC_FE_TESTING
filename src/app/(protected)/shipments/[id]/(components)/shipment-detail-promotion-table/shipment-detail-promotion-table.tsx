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
import { flexRender } from '@tanstack/react-table';

import ExceptionRequestDialog, {
  ExceptionDialogMode,
} from '../exception-request-dialog/exception-request-dialog';
import useShipmentReceive from './useShipmentReceive';

export default function ShipmentDetailPromotionTable() {
  const {
    table,
    totalPromotions,
    hasAnyDiscrepancy,
    allRowsFilled,
    receiving,
    canReceive,
    handleReceiveAll,
    handleClearAll,
    isExceptionDialogOpen,
    openExceptionDialog,
    closeExceptionDialog,
    submitException,
    shipmentId,
    searchQuery,
    handleSearch,
    startRow,
    endRow,
    totalCount,
    t,
  } = useShipmentReceive();

  return (
    <>
      {/* Section Header */}
      <div className='flex flex-wrap items-center gap-3'>
        <h2 className='mr-auto text-[20px] font-semibold leading-[30px] text-[#1a1d21]'>
          {t('receiveTable.title')}
        </h2>
        {/* Search input */}
        <div className='relative w-full sm:w-[260px]'>
          <div className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary'>
            <SearchIcon className='size-[16px]' aria-hidden='true' />
          </div>
          <Input
            type='text'
            placeholder={t('receiveTable.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className='h-9 pl-9 pr-8 text-[14px] bg-white'
            aria-label={t('receiveTable.searchAriaLabel')}
          />
          {searchQuery && (
            <button
              type='button'
              onClick={() => handleSearch('')}
              aria-label={t('receiveTable.clearSearchAriaLabel')}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-heading'
            >
              <CloseIcon className='size-[14px]' />
            </button>
          )}
        </div>
        {/* Promotions count badge */}
        <span className='inline-flex items-center gap-1 rounded-full border border-[var(--primary-500)] bg-[var(--primary-300)] px-2 py-0.5 text-[12px] font-medium leading-[20px] text-[var(--primary-500)]'>
          {t('promotions.badge', { count: totalPromotions })}
        </span>
      </div>

      {/* Promotions In Shipment Table */}
      <div className='overflow-hidden rounded-[8px] border border-[var(--neutral-300)]'>
        <div aria-live='polite' aria-atomic='true' className='sr-only'>
          {receiving ? t('receiveTable.submitting') : ''}
        </div>
        <Table aria-busy={receiving}>
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
          <DataTableBody
            table={table}
            emptyMessage={t('receiveTable.noItems')}
            loadingContent={<div />}
          />
        </Table>
        <TableFooter role='navigation' aria-label='Table pagination'>
          <TablePagination
            table={table}
            totalCount={totalCount}
            startRow={startRow}
            endRow={endRow}
            entityLabel={t('receiveTable.entityLabel')}
          />
        </TableFooter>
      </div>

      {/* Footer Actions */}
      {canReceive && (
        <div className='flex justify-end gap-5'>
          <Button
            type='button'
            variant='outline'
            onClick={handleClearAll}
            disabled={receiving}
            className='inline-flex h-[44px] items-center gap-2 rounded-[8px] border border-[var(--primary-500)] px-6 text-[16px] font-medium transition-opacity disabled:opacity-50'
          >
            <span className='bg-gradient-to-b from-[var(--primary-500)] to-[var(--primary-600)] bg-clip-text text-transparent'>
              {t('receiveTable.clearAll')}
            </span>
          </Button>

          <Button
            type='button'
            variant='outline'
            onClick={handleReceiveAll}
            className='inline-flex h-[44px] items-center gap-2 rounded-[8px] border border-[var(--primary-500)] px-6 text-[16px] font-medium transition-opacity disabled:opacity-50 bg-gradient-to-b from-[var(--primary-500)] to-[var(--primary-600)] bg-clip-text text-transparent'
            disabled={receiving}
          >
            {t('receiveTable.receiveAll')}
          </Button>

          <Button
            className='h-[44px] rounded-[8px] px-6 text-[16px] font-medium text-white transition-all enabled:bg-gradient-to-b enabled:from-[var(--btn-primary-from)] enabled:to-[var(--btn-primary-to)] enabled:hover:from-[var(--primary-700)] enabled:hover:to-[var(--blue-dark)] disabled:cursor-not-allowed disabled:bg-[var(--neutral-400)] disabled:opacity-100'
            onClick={openExceptionDialog}
            disabled={!hasAnyDiscrepancy || !allRowsFilled || receiving}
          >
            {t('receiveTable.raiseException')}
          </Button>
        </div>
      )}

      <ExceptionRequestDialog
        type={ExceptionDialogMode.SHIPMENT}
        isOpen={isExceptionDialogOpen}
        shipmentId={shipmentId}
        onSubmit={submitException}
        onClose={closeExceptionDialog}
      />
    </>
  );
}
