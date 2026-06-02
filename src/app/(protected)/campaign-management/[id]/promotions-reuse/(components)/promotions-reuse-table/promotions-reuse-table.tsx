'use client';
'use no memo';

import { flexRender } from '@tanstack/react-table';
import { CSSProperties } from 'react';

import {
  Button,
  CampaignGuard,
  Card,
  CloseIcon,
  DataTableBody,
  Input,
  SearchIcon,
  Table,
  TableCaption,
  TableFooter,
  TableHead,
  TableHeader,
  TablePagination,
  TableRow,
} from '@/components';
import { getAriaSort } from '@/lib/utils';
import { InventoryImageType, InventoryType, PromotionType } from '@/types';

import { ViewPromotionDialog } from '../../../(components)/view-promotion-dialog/view-promotion-dialog';
import usePromotionsReuse from '../../usePromotionsReuse';
import { PromotionsReuseTableInlineLoading } from './promotions-reuse-table.loading';

const COLUMN_STYLE: Record<string, CSSProperties> = {
  select: { width: '44px' },
  name: { minWidth: '200px' },
  actions: { width: '80px' },
};

/* ── Helpers ── */
function mapInventoryToPromotion(
  item: InventoryType,
): Omit<PromotionType, 'storeCount' | 'totalDistributedQty'> {
  return {
    id: item.id,
    campaignId: '',
    name: item.name,
    width: item.width ?? 0,
    height: item.height ?? 0,
    material: item.material,
    specifications: item.specifications,
    description: item.description,
    needDesign: false,
    isReusable: true,
    createdFromInventoryId: item.id,
    images: item.images.map((img: InventoryImageType) => ({
      id: img.id,
      campaignPromotionId: img.inventoryId,
      name: img.name,
      type: img.type,
      key: img.key,
      url: img.url,
      isPrimary: img.isPrimary,
      createdBy: img.createdBy,
      createdAt: img.createdAt,
    })),

    createdBy: item.createdBy,
    createdAt: item.createdAt,
  };
}

/* ── Props ── */
export interface PromotionsReuseListProps {
  encodedCampaignId: string;
}

export default function PromotionsReuseTable({ encodedCampaignId }: PromotionsReuseListProps) {
  const {
    // table state
    table,
    searchQuery,
    viewItem,
    startRow,
    endRow,
    filteredCount,

    // handlers
    handleSearchChange,
    handleClearSearch,
    handleAddToCampaign,
    isCreating,
    hasSelection,
    setViewItem,

    // campaign access
    campaignStatus,

    // translations
    t,
  } = usePromotionsReuse({ encodedCampaignId });
  /* ── Render ── */
  return (
    <CampaignGuard status={campaignStatus}>
      <>
        {/* Card: search + table + footer */}
        <Card className='overflow-clip rounded-xl border border-border p-0'>
          {/* Search bar */}
          <div className='flex justify-end border-b border-border px-4 py-3'>
            <div className='relative w-full max-w-xs'>
              <SearchIcon
                className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-secondary'
                aria-hidden='true'
              />
              <Input
                type='text'
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={handleSearchChange}
                className='pl-9 pr-9'
                aria-label={t('searchAriaLabel')}
              />
              {searchQuery && (
                <button
                  type='button'
                  aria-label={t('clearSearchAriaLabel')}
                  onClick={handleClearSearch}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-heading'
                >
                  <CloseIcon className='size-4' />
                </button>
              )}
            </div>
          </div>

          {/* Accessible live region for loading state */}
          <div aria-live='polite' aria-atomic='true' className='sr-only'>
            {isCreating ? t('creatingMessage') : ''}
          </div>

          <Table aria-busy={isCreating}>
            <TableCaption>{t('title')}</TableCaption>
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
              emptyMessage={t('noPromotions')}
              rowClassName={`border-b border-border last:border-b-0`}
              loadingContent={
                <PromotionsReuseTableInlineLoading
                  rowCount={table.getState().pagination.pageSize}
                />
              }
            />
          </Table>
          {filteredCount > 0 && (
            <TableFooter>
              <TablePagination
                table={table}
                totalCount={filteredCount}
                startRow={startRow}
                endRow={endRow}
                entityLabel={t('entityLabel')}
              />
            </TableFooter>
          )}
        </Card>

        {/* Action buttons */}
        <div className='flex justify-end gap-3'>
          <Button
            variant='outline'
            onClick={() => table.resetRowSelection()}
            disabled={!hasSelection || isCreating}
          >
            {t('clearButton')}
          </Button>
          <Button
            onClick={handleAddToCampaign}
            disabled={!hasSelection || isCreating}
            aria-disabled={!hasSelection || isCreating}
          >
            {isCreating ? t('addingButton') : t('addButton')}
          </Button>
        </div>

        {/* View promotion dialog */}
        {viewItem && (
          <ViewPromotionDialog
            open={!!viewItem}
            onOpenChange={(open) => {
              if (!open) setViewItem(null);
            }}
            promotion={mapInventoryToPromotion(viewItem)}
            showNeedDesign={false}
          />
        )}
      </>
    </CampaignGuard>
  );
}
