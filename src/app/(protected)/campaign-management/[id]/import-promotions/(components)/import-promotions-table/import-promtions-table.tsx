'use client';
'use no memo';

import {
  Card,
  DataTableBody,
  PageSearch,
  Table,
  TableCaption,
  TableFooter,
  TableHead,
  TableHeader,
  TablePagination,
  TableRow,
} from '@/components';
import { getAriaSort } from '@/lib/utils';
import { flexRender } from '@tanstack/react-table';

import { ViewPromotionDialog } from '../../../(components)/view-promotion-dialog/view-promotion-dialog';
import { ImportPromotionsTableInlineLoading } from './import-promotions-table.loading';
import NoCampaignSelectedCard from './no-campaign-selected-card';
import useImportPromotionsTable from './useImportPromotionsTable';

export default function ImportPromotionsTable() {
  const {
    // source campaign
    sourceCampaignId,
    // table
    table,
    search,
    isLoadingPromotions,
    totalCount,
    startRow,
    endRow,
    rowsOnPage,
    viewItem,
    setViewItem,

    // handlers
    handleSearchChange,
    handleClearSearch,

    // translations
    t,
  } = useImportPromotionsTable();

  return (
    <>
      <div className='flex flex-col gap-4'>
        <div className='flex items-center justify-between gap-4'>
          <h2 className='text-[18px] font-semibold leading-[27px] text-text-heading'>
            {t('promotionsListTitle')}
          </h2>

          {/* Search – only shown when source is selected */}
          {sourceCampaignId && (
            <div className='relative w-full max-w-xs'>
              <PageSearch
                className='w-full'
                placeholder={t('searchPlaceholder')}
                value={search}
                onChange={handleSearchChange}
                onClear={handleClearSearch}
              />
            </div>
          )}
        </div>

        {/* Content: info card or promotions table */}
        {!sourceCampaignId ? (
          <NoCampaignSelectedCard />
        ) : (
          <div>
            {/* Accessible live region */}
            <div aria-live='polite' aria-atomic='true' className='sr-only'>
              {isLoadingPromotions ? t('loadingMessage') : ''}
            </div>

            <Card className='overflow-clip rounded-xl border border-border p-0'>
              <Table aria-busy={isLoadingPromotions}>
                <TableCaption>{t('promotionsListTitle')}</TableCaption>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} aria-sort={getAriaSort(header)}>
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
                  isLoading={isLoadingPromotions}
                  emptyMessage={t('noPromotions')}
                  rowClassName='border-b border-border last:border-b-0'
                  loadingContent={<ImportPromotionsTableInlineLoading rowCount={rowsOnPage} />}
                />
              </Table>

              {totalCount > 0 && (
                <TableFooter role='navigation' aria-label='Table pagination'>
                  <TablePagination
                    table={table}
                    totalCount={totalCount}
                    startRow={startRow}
                    endRow={endRow}
                    entityLabel={t('entityLabel')}
                  />
                </TableFooter>
              )}
            </Card>
          </div>
        )}
      </div>

      {/* View Promotion Dialog */}
      {viewItem && (
        <ViewPromotionDialog
          open={!!viewItem}
          onOpenChange={(open) => {
            if (!open) setViewItem(null);
          }}
          promotion={viewItem}
        />
      )}
    </>
  );
}
