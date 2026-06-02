'use client';

import {
  CampaignStatusCell,
  CampaignTypeCell,
  CreatedDateCell,
  SortableHeader,
} from '@/components';
import { encodeId } from '@/lib';
import { type CampaignCapabilities } from '@/lib/permissions/route.permissions';
import { CampaignType } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { ProtectedRoute } from '@/constant';
import { CampaignActions } from './campaign-actions';

type TranslateFn = ReturnType<typeof useTranslations<'campaignManagement'>>;

/** Column definitions factory — varies included columns based on role capabilities. */
export function getCampaignColumns(
  t: TranslateFn,
  capabilities: CampaignCapabilities,
): ColumnDef<CampaignType>[] {
  const columns: ColumnDef<CampaignType>[] = [
    // ── Campaign name — always visible ─────────────────────────────────────────────
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <SortableHeader column={column}>{t('table.columns.campaignName')}</SortableHeader>
      ),
      cell: ({ row }) => {
        const id = encodeId(row.original.id);
        const name = row.getValue('name') as string;
        return (
          <Link
            href={`${ProtectedRoute.CAMPAIGN_MANAGEMENT}/${id}`}
            className='text-sm text-table-link transition-colors hover:underline'
          >
            {name}
          </Link>
        );
      },
    },

    // ── Brand — PSP Admin only ─────────────────────────────────────────────────────
    ...(capabilities.showBrandColumn
      ? ([
          {
            accessorKey: 'brandName',
            id: 'brandName',
            header: ({ column }) => (
              <SortableHeader column={column}>{t('table.columns.brand')}</SortableHeader>
            ),
            cell: ({ row }) => (
              <span className='text-[13px] leading-[19.5px] tracking-[-0.08px] text-text-heading'>
                {row.original.brandName ?? '—'}
              </span>
            ),
          },
        ] as ColumnDef<CampaignType>[])
      : []),

    // ── Type — always visible ─────────────────────────────────────────────────────────
    {
      accessorKey: 'type',
      header: () => <span>{t('table.columns.type')}</span>,
      cell: ({ row }) => <CampaignTypeCell isPermanent={row.original.isPermanent} />,
    },

    // ── Status — always visible ──────────────────────────────────────────────────────
    {
      accessorKey: 'status',
      header: () => <span>{t('table.columns.status')}</span>,
      cell: ({ row }) => <CampaignStatusCell status={row.original.status} />,
    },

    // ── Quantity (totalQuantity) — PSP Admin only ──────────────────────────────
    ...(capabilities.showQuantityColumn
      ? ([
          {
            id: 'totalQuantity',
            header: () => <span>{t('table.columns.quantity')}</span>,
            cell: ({ row }) => (
              <div className='flex items-center gap-1.5'>
                <span className='text-[13px] leading-[19.5px] tracking-[-0.08px] text-text-heading'>
                  {row.original.totalQuantity ?? 0}
                </span>
              </div>
            ),
          },
        ] as ColumnDef<CampaignType>[])
      : []),

    // ── Stores (storeCount) — Brand Admin only ─────────────────────────────────
    ...(capabilities.showStoreColumn
      ? ([
          {
            accessorKey: 'storeCount',
            header: () => <span>{t('table.columns.stores')}</span>,
            cell: ({ row }) => (
              <div className='flex items-center gap-1.5'>
                <span className='text-[13px] leading-[19.5px] tracking-[-0.08px] text-text-heading'>
                  {row.original.storeCount}
                </span>
              </div>
            ),
          },
        ] as ColumnDef<CampaignType>[])
      : []),

    // ── Promotions count — Brand Admin only ──────────────────────────────────
    ...(capabilities.showPromotionsColumn
      ? ([
          {
            accessorKey: 'promotions',
            header: () => <span>{t('table.columns.promotions')}</span>,
            cell: ({ row }) => (
              <div className='flex items-center gap-1.5'>
                <span className='text-[13px] leading-[19.5px] tracking-[-0.08px] text-text-heading'>
                  {row.original.promotionCount ?? 0}
                </span>
              </div>
            ),
          },
        ] as ColumnDef<CampaignType>[])
      : []),

    // ── Created date — always visible ────────────────────────────────────────────
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <SortableHeader column={column}>{t('table.columns.createdDate')}</SortableHeader>
      ),
      cell: ({ row }) => <CreatedDateCell value={row.getValue<string | Date>('createdAt')} />,
    },

    // ── Expected ship date — always visible ────────────────────────────────────
    {
      accessorKey: 'shipByDate',
      header: ({ column }) => (
        <SortableHeader column={column}>{t('table.columns.expectedShipDate')}</SortableHeader>
      ),
      cell: ({ row }) => <CreatedDateCell value={row.getValue<string | Date>('shipByDate')} />,
    },

    // ── Actions — always visible ─────────────────────────────────────────────────
    ...(capabilities.showActionsColumn
      ? ([
          {
            id: 'actions',
            header: () => (
              <span className='flex w-full justify-end'>{t('table.columns.actions')}</span>
            ),
            cell: ({ row }) => <CampaignActions campaign={row.original} />,
          },
        ] as ColumnDef<CampaignType>[])
      : []),
  ];

  return columns;
}
