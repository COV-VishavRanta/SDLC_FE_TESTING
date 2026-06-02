'use client';
'use no memo';

import {
  AdminCountCell,
  CreatedDateCell,
  ExternalLinkIcon,
  SortableHeader,
  StatusBadgeCell,
} from '@/components';
import { BrandType } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

import { ProtectedRoute } from '@/constant';
import { encodeId } from '@/lib';
import Link from 'next/link';
import BrandActionCell from './brand-action-cell';

type TranslateFn = ReturnType<typeof useTranslations<'brandManagement'>>;

/* ── Column Definitions ── */
export function getBrandColumns(t: TranslateFn): ColumnDef<BrandType>[] {
  return [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <SortableHeader column={column}>{t('table.columns.brandName')}</SortableHeader>
      ),
      cell: ({ row }) => {
        const brand = row.original;
        const id = encodeId(brand.id);
        return (
          <div className='flex flex-col gap-1'>
            <Link
              href={`${ProtectedRoute.BRAND_MANAGEMENT}/${id}`}
              className='text-table-link transition-colors hover:underline'
            >
              {brand?.name ?? '—'}
            </Link>
            {brand.website && (
              <a
                href={brand.website.startsWith('http') ? brand.website : `https://${brand.website}`}
                target='_blank'
                rel='noopener noreferrer'
                aria-label={t('table.websiteLinkAriaLabel', { website: brand.website })}
                className='inline-flex items-center gap-1 text-xs text-primary hover:underline'
              >
                <span aria-hidden='true'>{brand.website}</span>
                <ExternalLinkIcon className='size-3 text-primary' aria-hidden='true' />
              </a>
            )}
          </div>
        );
      },
    },
    {
      id: 'admins',
      header: () => <span className='uppercase'>{t('table.columns.users')}</span>,
      cell: ({ row }) => {
        const users = [
          ...(row.original.activeBrandAdmins ?? []),
          ...(row.original.inactiveBrandAdmins ?? []),
          ...(row.original.pendingBrandAdmins ?? []),
          ...(row.original.activeCampaignManagers ?? []),
          ...(row.original.inactiveCampaignManagers ?? []),
          ...(row.original.pendingCampaignManagers ?? []),
        ];
        const [firstAdmin] = users;

        const totalUsers = row.original.totalUsers ?? 0;
        const remainingCount = totalUsers - (firstAdmin ? 1 : 0);
        return <AdminCountCell firstAdminName={firstAdmin?.name} remainingCount={remainingCount} />;
      },
      enableSorting: false,
    },
    {
      accessorKey: 'isActive',
      header: () => <span>{t('table.columns.status')}</span>,
      cell: ({ row }) => <StatusBadgeCell isActive={row.getValue('isActive')} />,
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <SortableHeader column={column}>{t('table.columns.createdDate')}</SortableHeader>
      ),
      cell: ({ row }) => <CreatedDateCell value={row.getValue<string | Date>('createdAt')} />,
    },
    {
      id: 'actions',
      header: () => <span className='flex w-full justify-end'>{t('table.columns.actions')}</span>,
      cell: BrandActionCell,
    },
  ];
}

/**
 * Static column definitions (used by BrandTableSkeleton for skeleton column count).
 * Column headers here are intentionally untranslated placeholders.
 */
export const brandColumns: ColumnDef<BrandType>[] = [
  { accessorKey: 'name', header: 'Name' },
  { id: 'admins', header: 'Users' },
  { id: 'isActive', header: 'Status' },
  { accessorKey: 'createdAt', header: 'Created' },
  { id: 'actions', header: 'Actions' },
];
