'use client';

import { SortableHeader } from '@/components';
import { CampaignStatusEnum } from '@/constant';
import { PromotionType } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

import { PromotionActions } from './promotion-actions';

type PromotionsTableT = ReturnType<
  typeof useTranslations<'campaignManagement.details.promotionsTable'>
>;

export const promotionColumns = (
  campaignStatus?: CampaignStatusEnum,
  t?: PromotionsTableT,
): ColumnDef<PromotionType>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <SortableHeader column={column}>{t?.('columns.name') ?? 'Promotion Name'}</SortableHeader>
    ),
    cell: ({ row }) => (
      <div className='flex flex-col gap-0.5'>
        <span className='text-[14px] leading-[21px] text-sm text-text-secondary'>
          {row.original.name}
        </span>
      </div>
    ),
  },
  {
    id: 'stores',
    header: ({ column }) => (
      <SortableHeader column={column}>{t?.('columns.stores') ?? 'Stores'}</SortableHeader>
    ),
    cell: ({ row }) => (
      <div className='flex items-center gap-1.5'>
        <span className='flex text-[13px] font-medium w-[45px] leading-[19.5px] text-text-heading'>
          {row?.original?.storeCount ?? '0'}
        </span>
      </div>
    ),
  },
  {
    id: 'distributedQty',
    header: ({ column }) => (
      <SortableHeader column={column}>
        {t?.('columns.distributedQty') ?? 'Distributed Qty'}
      </SortableHeader>
    ),
    cell: ({ row }) => (
      <span className='flex text-[13px] font-medium w-[100px] leading-[19.5px] text-text-heading'>
        {row?.original?.totalDistributedQty ?? '0'}
      </span>
    ),
  },
  {
    accessorKey: 'isReusable',
    id: 'reusable',
    header: ({ column }) => (
      <SortableHeader column={column}>{t?.('columns.reusable') ?? 'Reusable'}</SortableHeader>
    ),
    cell: ({ row }) => (
      <div className='flex w-[60px]'>
        {row.original.isReusable ? (
          <span className='text-[12px] font-medium leading-[18px] text-text-heading'>
            {t?.('reusableValues.yes') ?? 'Yes'}
          </span>
        ) : (
          <span className='text-[12px] font-medium leading-[18px] text-text-heading'>
            {t?.('reusableValues.no') ?? 'No'}
          </span>
        )}
      </div>
    ),
  },
  {
    id: 'actions',
    header: () => (
      <span className='flex w-full justify-end text-[12px] font-medium uppercase leading-[18px] text-text-secondary'>
        {t?.('columns.actions') ?? 'Actions'}
      </span>
    ),
    cell: ({ row }) => (
      <PromotionActions promotion={row.original} campaignStatus={campaignStatus} />
    ),
  },
];
