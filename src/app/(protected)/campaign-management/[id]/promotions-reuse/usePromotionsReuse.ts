import { ALL_RECORDS_PAGE_SIZE, DEFAULT_PAGE_SIZE, ProtectedRoute } from '@/constant';
import { useGlobalProtected } from '@/contexts';
import {
  CREATE_PROMOTIONS_FROM_INVENTORY,
  CreatePromotionsFromInventoryResponse,
  CreatePromotionsFromInventoryVariables,
  GET_CAMPAIGN,
  GET_PROMOTIONS_BY_CAMPAIGN,
  GetCampaignResponse,
  GetCampaignVariables,
  GetPromotionsByCampaignResponse,
  GetPromotionsByCampaignVariables,
  LIST_INVENTORY,
  ListInventoryResponse,
  ListInventoryVariables,
} from '@/graphql';
import { decodeId } from '@/lib';
import { InventoryType } from '@/types';
import { useMutation, useSuspenseQuery } from '@apollo/client/react';
import {
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
import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { getInventoryReuseColumns } from './(components)/promotions-reuse-table/promotions-reuse-columns';
import { PromotionsReuseListProps } from './(components)/promotions-reuse-table/promotions-reuse-table';

export default function usePromotionsReuse({ encodedCampaignId }: PromotionsReuseListProps) {
  const router = useRouter();
  const { selectedPspId, selectedBrandId } = useGlobalProtected();
  const t = useTranslations('campaignManagement.promotionsReuse');
  const tColumns = useTranslations('campaignManagement.promotionsReuse.columns');

  /* ── Decode IDs ── */
  const campaignId = useMemo(() => decodeId(encodedCampaignId), [encodedCampaignId]);

  /* ── Data fetch: campaign details for security ── */
  const { data: campaignQueryData } = useSuspenseQuery<GetCampaignResponse, GetCampaignVariables>(
    GET_CAMPAIGN,
    { variables: { campaignId }, skip: !campaignId },
  );

  /* ── Data fetch: all promotions already in the campaign (to detect duplicates) ── */
  const { data: campaignPromotionsData } = useSuspenseQuery<
    GetPromotionsByCampaignResponse,
    GetPromotionsByCampaignVariables
  >(GET_PROMOTIONS_BY_CAMPAIGN, {
    variables: { campaignId, pageSize: ALL_RECORDS_PAGE_SIZE },
    skip: !campaignId,
  });

  /* ── Data fetch (all inventory for the PSP + brand filter) ── */
  const { data } = useSuspenseQuery<ListInventoryResponse, ListInventoryVariables>(LIST_INVENTORY, {
    variables: {
      pspId: selectedPspId ?? '',
      pageSize: ALL_RECORDS_PAGE_SIZE,
      filter: selectedBrandId ? { brandIds: [selectedBrandId] } : undefined,
    },
    skip: !selectedPspId,
  });

  const inventoryItems = useMemo(
    () => data?.listInventory?.inventoryItems ?? [],
    [data?.listInventory?.inventoryItems],
  );

  /* ── Set of inventory IDs already added to this campaign ── */
  const alreadyAddedInventoryIds = useMemo(() => {
    const promotions = campaignPromotionsData?.promotionsByCampaign?.promotions ?? [];
    return new Set(
      promotions
        .map((p) => p.createdFromInventoryId)
        .filter((id): id is string => id !== null && id !== undefined),
    );
  }, [campaignPromotionsData?.promotionsByCampaign?.promotions]);

  /* ── Local state ── */
  const [searchQuery, setSearchQuery] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [viewItem, setViewItem] = useState<InventoryType | null>(null);

  /* ── Mutation ── */
  const [createPromotions, { loading: isCreating }] = useMutation<
    CreatePromotionsFromInventoryResponse,
    CreatePromotionsFromInventoryVariables
  >(CREATE_PROMOTIONS_FROM_INVENTORY);

  /* ── Column defs ── */
  const columns = useMemo(
    () =>
      getInventoryReuseColumns({
        onViewDetails: (item) => setViewItem(item),
        alreadyAddedInventoryIds,
        t: tColumns,
      }),
    [alreadyAddedInventoryIds, tColumns],
  );

  /* ── Table ── */
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: inventoryItems,
    columns,
    getRowId: (row) => row.id,
    enableRowSelection: (row) => !alreadyAddedInventoryIds.has(row.original.id),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: (row, _columnId, filterValue: string) =>
      row.original.name.toLowerCase().includes(filterValue.toLowerCase()),
    state: {
      sorting,
      pagination,
      rowSelection,
      globalFilter: searchQuery,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setSearchQuery,
    enableSortingRemoval: true,
  });

  /* ── Derived ── */
  const filteredCount = table.getFilteredRowModel().rows.length;
  const startRow = filteredCount > 0 ? pagination.pageIndex * pagination.pageSize + 1 : 0;
  const endRow = Math.min((pagination.pageIndex + 1) * pagination.pageSize, filteredCount);
  const selectedIds = Object.keys(rowSelection).filter((id) => rowSelection[id]);
  const hasSelection = selectedIds.length > 0;

  /* ── Handlers ── */
  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(e.target.value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }

  function handleClearSearch() {
    setSearchQuery('');
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }

  async function handleAddToCampaign() {
    if (!hasSelection) return;
    const result = await createPromotions({
      variables: {
        input: { campaignId, inventoryIds: selectedIds },
      },
    });
    if (result.data?.createPromotionsFromInventory.success) {
      toast.success(t('addSuccess'));
      router.push(`${ProtectedRoute.CAMPAIGN_MANAGEMENT}/${encodedCampaignId}`);
    } else {
      toast.error(result.data?.createPromotionsFromInventory.message ?? t('addFailed'));
    }
  }

  return {
    // table state
    table,
    columns,
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
    campaignStatus: campaignQueryData?.campaign?.campaign?.status,

    // translations
    t,
  };
}
