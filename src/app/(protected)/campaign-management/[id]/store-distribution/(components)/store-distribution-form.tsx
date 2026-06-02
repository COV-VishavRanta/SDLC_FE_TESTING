'use client';
'use no memo';

import {
  ArrowLeftIcon,
  Button,
  CampaignGuard,
  CloseIcon,
  Input,
  PageRoot,
  SearchIcon,
  TablePagination,
} from '@/components';
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
import { ProtectedRoute } from '@/constant';
import { flexRender } from '@tanstack/react-table';
import Link from 'next/link';

import { useRouter } from 'next/navigation';
import { StoreDistributionTableInlineLoading } from './store-distribution-table.loading';
import useStoreDistributionForm from './useStoreDistributionForm';

export interface StoreDistributionFormProps {
  encodedCampaignId: string;
  campaignId: string;
  promotionId: string;
}

export default function StoreDistributionForm({
  encodedCampaignId,
  campaignId,
  promotionId,
}: StoreDistributionFormProps) {
  const {
    // data
    distribution,
    promotionName,
    totalQuantity,
    campaignStatus,
    searchQuery,
    saving,

    // table
    table,
    startRow,
    endRow,
    totalCount,
    rowsOnPage,

    // actions
    handleSearch,
    handleClearAll,
    handleSave,

    // translations
    t,
  } = useStoreDistributionForm({ campaignId, promotionId, encodedCampaignId });
  const router = useRouter();
  const handleCancel = () => {
    router.push(`${ProtectedRoute.CAMPAIGN_MANAGEMENT}/${encodedCampaignId}`);
  };

  return (
    <CampaignGuard status={campaignStatus}>
      <PageRoot>
        {/* Back link */}
        <Link
          href={`${ProtectedRoute.CAMPAIGN_MANAGEMENT}/${encodedCampaignId}`}
          className='inline-flex w-fit items-center gap-1.5 text-[14px] font-medium leading-[21px] text-primary hover:underline'
        >
          <ArrowLeftIcon className='size-4' aria-hidden='true' />
          {t('backLink')}
        </Link>

        {/* Page header */}
        <div className='flex flex-col gap-1'>
          <h1 className='text-[20px] font-semibold leading-[28px] text-text-heading sm:text-[28px] sm:leading-[42px]'>
            {t('title')}
          </h1>
          <p className='text-[14px] font-normal leading-[21px] text-text-secondary'>
            {distribution?.promotionName ?? promotionName}
          </p>
        </div>

        {/* Instruction + search row */}
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <p className='text-[14px] leading-[21px] text-text-secondary'>{t('instruction')}</p>
          {/* Search input */}

          <div className='flex items-center gap-3'>
            <div className='relative w-full sm:w-[260px]'>
              <div className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary'>
                <SearchIcon className='size-[16px]' aria-hidden='true' />
              </div>
              <Input
                type='text'
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className='pl-9 sm:h-[47px] pr-9 text-[14px] bg-white'
                aria-label={t('searchAriaLabel')}
              />
              {searchQuery && (
                <button
                  type='button'
                  onClick={() => handleSearch('')}
                  aria-label={t('clearSearchAriaLabel')}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-heading'
                >
                  <CloseIcon className='size-[14px]' />
                </button>
              )}
            </div>
            <Button
              variant='outline'
              className='shrink-0 rounded-lg border-[var(--primary-500)] bg-transparent px-6 bg-gradient-to-b from-[var(--primary-500)] to-[var(--primary-600)] bg-clip-text text-base font-medium text-transparent hover:opacity-80'
              onClick={handleClearAll}
              disabled={saving}
            >
              {t('clearAll')}
            </Button>
          </div>
        </div>

        {/* Table card */}
        <Card className='overflow-clip rounded-xl border border-border p-0 shadow-none'>
          <div aria-live='polite' aria-atomic='true' className='sr-only'>
            {saving ? t('savingMessage') : ''}
          </div>

          <Table aria-busy={saving}>
            <TableCaption>{t('tableCaption')}</TableCaption>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      aria-sort={
                        header.column.getCanSort()
                          ? header.column.getIsSorted() === 'asc'
                            ? 'ascending'
                            : header.column.getIsSorted() === 'desc'
                              ? 'descending'
                              : 'none'
                          : undefined
                      }
                      className={header.id === 'quantity' ? 'text-right' : undefined}
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
              isLoading={saving}
              emptyMessage={t('noStores')}
              // Pass the specific loader for this table
              loadingContent={<StoreDistributionTableInlineLoading rowCount={rowsOnPage} />}
              // Pass the specific styling for this table's rows
            />
          </Table>

          {/* Pagination footer */}
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

        {/* Total quantity row */}
        <div className='flex items-center justify-between rounded-xl border border-border bg-[var(--color-primary-50,#eff6ff)] px-6 py-4'>
          <span className='text-[14px] font-semibold leading-[21px] text-text-heading'>
            {t('totalQuantity')}
          </span>
          <span className='text-[18px] font-bold leading-[27px] text-primary'>{totalQuantity}</span>
        </div>

        {/* Action buttons */}
        <div className='flex justify-end gap-3'>
          <Button
            type='button'
            variant='outline'
            className='border border-[var(--neutral-300)] bg-[var(--neutral-200)] text-[var(--neutral-900)] hover:bg-[var(--neutral-300)]'
            onClick={handleCancel}
            aria-label={t('cancelButton')}
          >
            {t('cancelButton')}
          </Button>

          <Button onClick={handleSave} disabled={saving}>
            {saving ? t('savingButton') : t('saveButton')}
          </Button>
        </div>
      </PageRoot>
    </CampaignGuard>
  );
}
