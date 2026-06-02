'use client';
'use no memo';

import {
  DataTableBody,
  Table,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getAriaSort } from '@/lib/utils';
import {
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import {
  GET_STORE_DISTRIBUTION_BY_PROMOTION,
  GetStoreDistributionByPromotionResponse,
  GetStoreDistributionByPromotionVariables,
} from '@/graphql';
import { useSuspenseQuery } from '@apollo/client/react';

import { getStoreColumns } from './store-table-columns';
import { StoreTableInlineLoading } from './store-table.loading';

interface StoreTableProps {
  promotionId: string;
}

const INITIAL_SORTING: SortingState = [{ id: 'storeName', desc: false }];

export function StoreTable({ promotionId }: StoreTableProps) {
  const { data } = useSuspenseQuery<
    GetStoreDistributionByPromotionResponse,
    GetStoreDistributionByPromotionVariables
  >(GET_STORE_DISTRIBUTION_BY_PROMOTION, { variables: { promotionId } });

  const distribution = data?.storeDistributionByPromotion;
  const items = distribution?.items ?? [];
  const total = distribution?.totalDistributedQuantity ?? 0;

  const t = useTranslations('campaignManagement.details.viewPromotion.participatingStores');
  const tColumns = useTranslations(
    'campaignManagement.details.viewPromotion.participatingStores.columns',
  );
  const [sorting, setSorting] = useState<SortingState>(INITIAL_SORTING);

  const columns = getStoreColumns(tColumns);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
    onSortingChange: setSorting,
  });

  return (
    <div className='flex flex-col gap-4 rounded-[12px] border border-[var(--neutral-300)] bg-[var(--neutral-200)] px-5 pt-5 pb-1'>
      {/* Section header */}
      <div className='flex items-center justify-between'>
        <p className='text-[16px] font-semibold leading-6 text-[var(--neutral-900)]'>
          {t('title')}
        </p>
        <span className='rounded-full bg-[rgba(0,136,204,0.1)] px-3 py-1 text-[13px] font-semibold leading-5 text-[var(--primary-500)]'>
          {t('storesBadge', { count: items.length })}
        </span>
      </div>

      {/* Table */}
      <div className='overflow-clip rounded-[8px] border border-[var(--neutral-300)]'>
        {/* sr-only live region for screen readers (WCAG 4.1.3) */}
        <div aria-live='polite' aria-atomic='true' className='sr-only'>
          {t('title')}
        </div>

        <Table>
          <TableCaption>{t('title')}</TableCaption>
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
            isLoading={false}
            emptyMessage={t('noStores')}
            loadingContent={<StoreTableInlineLoading rowCount={1} />}
          />
        </Table>

        {/* Total row */}
        {table.getRowModel().rows.length > 0 && (
          <div className='flex w-full items-center justify-between border-t border-[var(--neutral-300)] bg-[var(--neutral-100)] px-8 py-3'>
            <p className='text-[14px] font-semibold tracking-[-0.15px] text-[var(--neutral-700)]'>
              {t('totalDistributed')}
            </p>
            <p className='text-right text-[14px] font-bold tracking-[-0.15px] text-[var(--neutral-700)]'>
              {total}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
