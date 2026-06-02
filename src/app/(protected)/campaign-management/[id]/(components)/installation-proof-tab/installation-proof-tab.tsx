'use client';

import {
  Accordion,
  Card,
  CloseIcon,
  Input,
  NoRecordFound,
  SearchIcon,
  TablePagination,
} from '@/components';
import { TableFooter } from '@/components/ui/table';
import { CARD_PAGE_SIZE_OPTIONS, INSTALLATION_PROOF_TAB_ORDER_STATUSES } from '@/constant';
import { useGlobalProtected } from '@/contexts';
import {
  GET_CAMPAIGN_STORE_ORDERS,
  GetCampaignStoreOrdersResponse,
  GetCampaignStoreOrdersVariables,
} from '@/graphql';
import { useClientPagination } from '@/hooks';
import { StoreOrderType } from '@/types';
import { useSuspenseQuery } from '@apollo/client/react';
import { ColumnDef, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { useCallback, useContext } from 'react';

import { CampaignDetailsContext } from '../../context/CampaignDetailsContext';
import { InstallationProofStoreCard } from './installation-proof-store-card/installation-proof-store-card';

/* ── Empty column definitions — table is used only for pagination control ── */
const STORE_COLUMNS: ColumnDef<StoreOrderType>[] = [];

export default function InstallationProofTabContent() {
  const t = useTranslations('campaignManagement.details.installationProofTab');
  const { selectedStoreId } = useGlobalProtected();
  const { campaignData, encodedCampaignId } = useContext(CampaignDetailsContext);
  const campaignId = campaignData?.id ?? '';

  const { data } = useSuspenseQuery<
    GetCampaignStoreOrdersResponse,
    GetCampaignStoreOrdersVariables
  >(GET_CAMPAIGN_STORE_ORDERS, {
    variables: { campaignId, ...(selectedStoreId ? { storeId: selectedStoreId } : {}) },
    skip: !campaignId && !selectedStoreId,
  });

  const allStores = data?.campaignStoreOrders?.stores ?? [];
  const stores = allStores.filter((store) =>
    INSTALLATION_PROOF_TAB_ORDER_STATUSES.has(store.orderStatus),
  );

  /* ── Search predicate: match store name or order number ── */
  const searchFn = useCallback((store: StoreOrderType, query: string) => {
    const q = query.toLowerCase();
    return store.storeName.toLowerCase().includes(q) || store.orderNumber.toString().includes(q);
  }, []);

  const {
    pagedItems,
    totalCount,
    pageCount,
    pagination,
    setPagination,
    searchQuery,
    updateSearch,
    clearSearch,
    loading,
  } = useClientPagination(stores, searchFn);

  /* ── TanStack table — purely for pagination control ── */
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable<StoreOrderType>({
    data: pagedItems,
    columns: STORE_COLUMNS,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount,
    rowCount: totalCount,
    state: { pagination },
    onPaginationChange: setPagination,
  });

  /* ── Pagination calculations ── */
  const startRow = totalCount > 0 ? pagination.pageIndex * pagination.pageSize + 1 : 0;
  const endRow = Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalCount);

  const isEmpty = pagedItems.length === 0;
  const emptyMessage = t('noRecords');

  return (
    <div className='flex flex-col gap-6'>
      {/* Search input */}
      <div className='flex justify-end'>
        <div className='relative w-full max-w-[600px]'>
          <div className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary'>
            <SearchIcon className='size-4' aria-hidden='true' />
          </div>
          <Input
            type='text'
            value={searchQuery}
            onChange={(e) => updateSearch(e.target.value)}
            placeholder={t('search.placeholder')}
            className='pl-9 pr-9 text-sm bg-white'
            aria-label={t('search.placeholder')}
          />
          {searchQuery && (
            <button
              type='button'
              onClick={clearSearch}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-heading focus-visible:ring-offset-2 focus-visible:ring-offset-white'
              aria-label={t('search.clearAriaLabel')}
            >
              <CloseIcon className='size-4' />
            </button>
          )}
        </div>
      </div>

      {/* sr-only live region announces loading state to screen readers (WCAG 4.1.3) */}
      <div aria-live='polite' aria-atomic='true' className='sr-only'>
        {loading ? t('list.loadingState') : ''}
      </div>

      {/* Installation proof store cards */}
      <Card
        className='overflow-hidden rounded-[8px] border border-[var(--neutral-300)] bg-[var(--neutral-100)] p-0'
        aria-busy={loading}
      >
        <div className='p-6'>
          {isEmpty ? (
            <NoRecordFound message={emptyMessage} />
          ) : (
            <div className='overflow-hidden rounded-lg border border-border'>
              <Accordion className='gap-0' multiple>
                {pagedItems.map((store) => (
                  <InstallationProofStoreCard
                    key={store.storeId}
                    store={store}
                    decodedCampaignId={encodedCampaignId}
                    t={t}
                  />
                ))}
              </Accordion>
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        <TableFooter role='navigation' aria-label={t('list.paginationAriaLabel')}>
          <TablePagination
            table={table}
            totalCount={totalCount}
            startRow={startRow}
            endRow={endRow}
            entityLabel={t('list.paginationLabel')}
            pageSizeOptions={CARD_PAGE_SIZE_OPTIONS}
          />
        </TableFooter>
      </Card>
    </div>
  );
}
