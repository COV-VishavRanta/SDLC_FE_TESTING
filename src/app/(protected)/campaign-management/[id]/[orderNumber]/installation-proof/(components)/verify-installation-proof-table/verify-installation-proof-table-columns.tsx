'use client';
'use no memo';

import {
  ActionButtonCell,
  Checkbox,
  CheckCircleIcon,
  CloseIcon,
  InstallationStatusBadge,
  SortableHeader,
  ViewInstallationProof,
} from '@/components';
import { InstallationStatusEnum } from '@/constant';
import { StoreOrderItemType } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

/* ─── Decision types ─── */
export type Decision = 'accepted' | 'rejected';

export interface DecisionEntry {
  decision: Decision;
  notes?: string;
}

type TranslateFn = ReturnType<
  typeof useTranslations<'campaignManagement.details.verifyInstallationProof'>
>;

interface GetColumnsOptions {
  t: TranslateFn;
  decisions: Map<string, DecisionEntry>;
  isSubmitting: boolean;
  setViewProofItem: (item: StoreOrderItemType | null) => void;
  handleAcceptRow: (item: StoreOrderItemType) => void;
  handleRejectRow: (item: StoreOrderItemType) => void;
}

/* ── Column Definitions ── */
export function getVerifyInstallationProofColumns({
  t,
  decisions,
  isSubmitting,
  setViewProofItem,
  handleAcceptRow,
  handleRejectRow,
}: GetColumnsOptions): ColumnDef<StoreOrderItemType>[] {
  return [
    {
      id: 'select',
      header: ({ table }) => {
        const hasSelectableRows = table.getRowModel().rows.some((row) => row.getCanSelect());
        return (
          <>
            <span className='sr-only'>{t('columns.promotionName')}</span>
            <Checkbox
              checked={table.getIsAllPageRowsSelected()}
              indeterminate={table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()}
              onCheckedChange={(checked) => table.toggleAllPageRowsSelected(!!checked)}
              aria-label={t('columns.selectAll')}
              className={
                hasSelectableRows ? '' : 'opacity-50 cursor-not-allowed border-neutral-500'
              }
              disabled={!hasSelectableRows}
            />
          </>
        );
      },
      cell: ({ row }) => {
        if (!row.getCanSelect()) return null;
        return (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(checked) => row.toggleSelected(!!checked)}
            aria-label={t('columns.selectRow', { name: row.original.promotionName })}
          />
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: 'promotionName',
      header: ({ column }) => (
        <SortableHeader column={column}>{t('columns.promotionName')}</SortableHeader>
      ),
      cell: ({ row }) => {
        const decision = decisions.get(row.original.orderItemId);
        return (
          <div className='flex flex-col gap-0.5'>
            <span className='text-sm font-semibold text-text-heading'>
              {row.original.promotionName}
            </span>
            {decision && (
              <span
                className={`text-[10px] font-medium ${
                  decision.decision === 'accepted'
                    ? 'text-[var(--badge-active-text)]'
                    : 'text-destructive'
                }`}
              >
                {t(`localStatus.${decision.decision}`)}
              </span>
            )}
          </div>
        );
      },
      filterFn: 'includesString',
    },
    {
      accessorKey: 'totalQuantity',
      header: t('columns.totalQuantity'),
      cell: ({ row }) => (
        <span className='text-sm text-foreground'>{row.original.totalQuantity}</span>
      ),
      enableSorting: false,
    },
    {
      id: 'installationStatus',
      header: t('columns.status'),
      cell: ({ row }) => (
        <InstallationStatusBadge
          status={row.original.installationStatus as InstallationStatusEnum}
          className='whitespace-nowrap px-2.5 py-1 text-[11px] leading-[16.5px]'
        />
      ),
      enableSorting: false,
    },
    {
      id: 'actions',
      header: () => <span className='flex w-full justify-end'>{t('columns.actions')}</span>,
      cell: ({ row }) => {
        const item = row.original;
        const hasImages = (item.installationImageUrls?.length ?? 0) > 0;
        const isPendingApproval =
          item.installationStatus === InstallationStatusEnum.PENDING_APPROVAL;
        const isRejected = item.installationStatus === InstallationStatusEnum.REJECTED;
        const canAccept = isPendingApproval || isRejected;
        const canReject = isPendingApproval;

        return (
          <div className='flex items-center gap-1 justify-end'>
            {hasImages && (
              <ActionButtonCell
                icon={<ViewInstallationProof className='size-4 text-primary' aria-hidden='true' />}
                tooltip={t('actions.viewProofAriaLabel', { name: item.promotionName })}
                onClick={() => setViewProofItem(item)}
                className='hover:bg-muted'
              />
            )}
            {canAccept && (
              <ActionButtonCell
                icon={
                  <CheckCircleIcon
                    className='size-4 text-[var(--badge-active-text)]'
                    aria-hidden='true'
                  />
                }
                tooltip={t('actions.acceptAriaLabel', { name: item.promotionName })}
                onClick={() => handleAcceptRow(item)}
                className='hover:bg-green-50'
                disabled={isSubmitting}
              />
            )}
            {canReject && (
              <ActionButtonCell
                icon={<CloseIcon className='size-4 text-destructive' aria-hidden='true' />}
                tooltip={t('actions.rejectAriaLabel', { name: item.promotionName })}
                onClick={() => handleRejectRow(item)}
                className='hover:bg-red-50'
                disabled={isSubmitting}
              />
            )}
          </div>
        );
      },
      enableSorting: false,
    },
  ];
}

/**
 * Static column definitions (used by skeleton for column count).
 * Column headers here are intentionally untranslated placeholders.
 */
export const verifyInstallationProofColumns: ColumnDef<StoreOrderItemType>[] = [
  { id: 'select', header: 'Select' },
  { accessorKey: 'promotionName', header: 'Promotion Name' },
  { accessorKey: 'totalQuantity', header: 'Total QTY' },
  { id: 'installationStatus', header: 'Status' },
  { id: 'actions', header: 'Actions' },
];
