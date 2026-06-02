'use no memo';
'use client';

import {
  Button,
  CloseIcon,
  Input,
  NoRecordFound,
  SearchIcon,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TablePagination,
  TableRow,
} from '@/components';
import ViewImagesDialog from '@/components/dialog/view-images-dialog/view-images-dialog';
import { InstallationStatusEnum } from '@/constant';
import {
  GET_CAMPAIGN,
  GET_CAMPAIGN_STORE_ORDERS,
  REVIEW_INSTALLATION_PROOF,
  ReviewInstallationProofResponse,
  ReviewInstallationProofVariables,
} from '@/graphql';
import { getAriaSort } from '@/lib/utils';
import { StoreOrderItemType } from '@/types';
import { useMutation } from '@apollo/client/react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  RowSelectionState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { CSSProperties, useContext, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { VerifyInstallationProofContext } from '../../context/VerifyInstallationProofContext';
import RejectVerificationDialog from '../reject-verification-dialog/reject-verification-dialog';
import {
  Decision,
  DecisionEntry,
  getVerifyInstallationProofColumns,
} from './verify-installation-proof-table-columns';

/* ─── Constants ─── */
const DEFAULT_PAGE_SIZE = 10;
const INITIAL_PAGE_INDEX = 0;

const REVIEWABLE_STATUSES = new Set<InstallationStatusEnum>([
  InstallationStatusEnum.PENDING_APPROVAL,
  InstallationStatusEnum.REJECTED,
]);

/* ─── Column widths ─── */
const COLUMN_STYLE: Record<string, CSSProperties> = {
  select: { width: '48px', maxWidth: '48px' },
  promotionName: { minWidth: '200px' },
  totalQuantity: { maxWidth: '130px' },
  installationStatus: { maxWidth: '160px' },
  actions: { maxWidth: '140px' },
};

/* ─── Main Component ─── */
export function VerifyInstallationProofTable() {
  const t = useTranslations('campaignManagement.details.verifyInstallationProof');
  const router = useRouter();

  const { campaignId, storeId, encodedCampaignId, storeOrder } = useContext(
    VerifyInstallationProofContext,
  );

  const items: StoreOrderItemType[] = useMemo(() => storeOrder?.orderItems ?? [], [storeOrder]);

  /* ─── Local state ─── */
  const [decisions, setDecisions] = useState<Map<string, DecisionEntry>>(new Map());
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [viewProofItem, setViewProofItem] = useState<StoreOrderItemType | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: INITIAL_PAGE_INDEX,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [sorting, setSorting] = useState<SortingState>([{ id: 'promotionName', desc: false }]);
  const [globalFilter, setGlobalFilter] = useState('');

  /* ─── Mutation ─── */
  const [reviewInstallationProof, { loading: isSubmitting }] = useMutation<
    ReviewInstallationProofResponse,
    ReviewInstallationProofVariables
  >(REVIEW_INSTALLATION_PROOF, {
    refetchQueries: [
      { query: GET_CAMPAIGN, variables: { campaignId } },
      { query: GET_CAMPAIGN_STORE_ORDERS, variables: { campaignId, storeId } },
    ],
  });

  /* ─── Derived ─── */
  const eligibleItems = useMemo(
    () =>
      items.filter((item) =>
        REVIEWABLE_STATUSES.has(item.installationStatus as InstallationStatusEnum),
      ),
    [items],
  );

  const selectedEligibleIds = useMemo(
    () => Object.keys(rowSelection).filter((id) => rowSelection[id]),
    [rowSelection],
  );

  const allEligibleAddressed = useMemo(
    () =>
      eligibleItems
        .filter((item) => item.installationStatus === InstallationStatusEnum.PENDING_APPROVAL)
        .every((item) => decisions.has(item.orderItemId)),
    [eligibleItems, decisions],
  );

  const isSubmitDisabled = !allEligibleAddressed || isSubmitting || eligibleItems.length === 0;

  /* ─── Decision helpers ─── */
  const applyDecision = (ids: string[], decision: Decision, notes?: string) => {
    setDecisions((prev) => {
      const next = new Map(prev);
      ids.forEach((id) => next.set(id, { decision, notes }));
      return next;
    });
  };

  const handleAcceptRow = (item: StoreOrderItemType) => {
    applyDecision([item.orderItemId], 'accepted');
  };

  const handleAcceptSelected = () => {
    applyDecision(selectedEligibleIds, 'accepted');
    setRowSelection({});
  };

  const handleRejectSelected = () => {
    if (selectedEligibleIds.length === 0) return;
    setRejectDialogOpen(true);
  };

  const handleRejectRow = (item: StoreOrderItemType) => {
    setRowSelection({ [item.orderItemId]: true });
    setRejectDialogOpen(true);
  };

  const handleRejectDialogSubmit = (notes: string) => {
    applyDecision(selectedEligibleIds, 'rejected', notes);
    setRowSelection({});
    setRejectDialogOpen(false);
  };

  /* ─── Submit ─── */
  const handleSubmit = async () => {
    if (isSubmitDisabled) {
      toast.error(t('validationMessage'));
      return;
    }

    const orderId = items[0]?.orderId ?? '';

    const reviewItems = eligibleItems.map((item) => {
      const entry = decisions.get(item.orderItemId);
      return {
        orderItemId: item.orderItemId,
        approved: entry?.decision === 'accepted',
        notes: entry?.notes,
      };
    });

    await reviewInstallationProof({
      variables: {
        input: {
          orderId,
          items: reviewItems,
        },
      },
      onCompleted: () => {
        toast.success(t('successMessage'));
        router.push(`/campaign-management/${encodedCampaignId}?tab=installation-proof`);
      },
    });
  };

  /* ─── Columns ─── */
  const columns = getVerifyInstallationProofColumns({
    t,
    decisions,
    isSubmitting,
    setViewProofItem,
    handleAcceptRow,
    handleRejectRow,
  });

  /* ─── Table instance ─── */
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: items,
    columns,
    getRowId: (row) => row.orderItemId,
    enableRowSelection: (row) =>
      REVIEWABLE_STATUSES.has(row.original.installationStatus as InstallationStatusEnum),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: 'includesString',
    autoResetPageIndex: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    state: { pagination, rowSelection, sorting, globalFilter },
  });

  const totalCount = table.getFilteredRowModel().rows.length;
  const startRow = totalCount > 0 ? pagination.pageIndex * DEFAULT_PAGE_SIZE + 1 : 0;
  const endRow = Math.min((pagination.pageIndex + 1) * DEFAULT_PAGE_SIZE, totalCount);

  const selectedNames = selectedEligibleIds
    .map((id) => items.find((item) => item.orderItemId === id)?.promotionName ?? '')
    .filter(Boolean);

  return (
    <>
      {/* ─── Top action bar ─── */}
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        {/* Search */}
        <div className='relative w-full max-w-sm'>
          <SearchIcon className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            placeholder={t('searchPlaceholder')}
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className='pl-9 bg-white'
            aria-label={t('searchPlaceholder')}
          />
          {globalFilter && (
            <button
              type='button'
              onClick={() => setGlobalFilter('')}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-heading'
            >
              <CloseIcon className='size-[14px]' />
            </button>
          )}
        </div>

        {/* Batch actions */}
        <div className='flex shrink-0 items-center gap-2'>
          <Button
            type='button'
            variant='destructive'
            onClick={handleRejectSelected}
            disabled={selectedEligibleIds.length === 0 || isSubmitting}
            className='h-9 gap-1.5 rounded-lg border-destructive px-4 text-[13px] font-semibold disabled:text-white disabled:opacity-60 text-white sm:h-[38px]'
          >
            {t('rejectSelected')}
          </Button>
          <Button
            type='button'
            variant='outline'
            onClick={handleAcceptSelected}
            disabled={selectedEligibleIds.length === 0 || isSubmitting}
            className='h-9 flex-1 rounded-lg bg-gradient-to-b from-[var(--activate-green-from)] to-[var(--activate-green-to)] text-[13px] text-white hover:from-[#2D7A2F] hover:to-[#1e5e20] disabled:text-white disabled:opacity-60 disabled:bg-[var(--activate-green-from)]  sm:h-[38px]'
          >
            {t('acceptSelected')}
          </Button>
        </div>
      </div>

      {/* ─── Table ─── */}
      <div
        role='region'
        aria-label={t('columns.promotionName')}
        className='overflow-clip rounded-xl border border-border'
      >
        <Table>
          <TableCaption>{t('columns.promotionName')}</TableCaption>
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

          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => {
                const decision = decisions.get(row.original.orderItemId);
                const rowBg =
                  decision?.decision === 'accepted'
                    ? 'bg-green-50/50'
                    : decision?.decision === 'rejected'
                      ? 'bg-red-50/50'
                      : '';
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() ? 'selected' : undefined}
                    className={rowBg}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={table.getAllColumns().length} className='p-3'>
                  <NoRecordFound message={t('noRecords')} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <TableFooter className='flex items-center justify-between px-4 py-3'>
          <TablePagination
            table={table}
            totalCount={totalCount}
            startRow={startRow}
            endRow={endRow}
            entityLabel={t('entityLabel')}
          />
        </TableFooter>
      </div>

      {/* ─── Submit ─── */}
      <div className='flex justify-end'>
        <Button
          type='button'
          isLoading={isSubmitting}
          disabled={isSubmitDisabled}
          onClick={handleSubmit}
          aria-label={t('submitAriaLabel')}
          className='h-[40px] rounded-[8px] bg-gradient-to-b from-[var(--btn-primary-from)] to-[var(--btn-primary-to)] px-6 text-[13px] font-semibold text-white shadow-sm transition-opacity hover:opacity-90 sm:h-[44px] sm:text-[14px]'
        >
          {t('submitButton')}
        </Button>
      </div>

      {/* ─── Reject dialog ─── */}
      {rejectDialogOpen && (
        <RejectVerificationDialog
          open={rejectDialogOpen}
          onOpenChange={setRejectDialogOpen}
          promotionNames={selectedNames}
          onSubmit={handleRejectDialogSubmit}
        />
      )}

      {/* ─── View images dialog ─── */}
      {viewProofItem && (
        <ViewImagesDialog
          open={!!viewProofItem}
          onClose={() => setViewProofItem(null)}
          title={t('actions.viewProof')}
          imageUrls={viewProofItem.installationImageUrls}
          notes={
            viewProofItem?.installationNotes?.[viewProofItem?.installationNotes?.length - 1] ?? ''
          }
        />
      )}
    </>
  );
}
