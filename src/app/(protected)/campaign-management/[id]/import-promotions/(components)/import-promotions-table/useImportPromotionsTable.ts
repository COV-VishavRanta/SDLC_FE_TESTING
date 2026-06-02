'use no memo';

import { DEFAULT_PAGE_SIZE, INITIAL_PAGE_INDEX, SEARCH_DEBOUNCE_MS, SortOrder } from '@/constant';
import {
  GET_PROMOTIONS_BY_CAMPAIGN,
  GetPromotionsByCampaignResponse,
  GetPromotionsByCampaignVariables,
} from '@/graphql';
import { PromotionType } from '@/types';
import { useQuery } from '@apollo/client/react';
import {
  getCoreRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useDebounce } from '@uidotdev/usehooks';
import { useTranslations } from 'next-intl';
import { useContext, useEffect, useMemo, useRef, useState, useTransition } from 'react';

import { ImportPromotionsContext } from '../../context/ImportPromotionsContext';
import { getImportPromotionsColumns } from './import-promotions-table-columns';

export default function useImportPromotionsTable() {
  const { t, sourceCampaignId, rowSelection, setRowSelection, hasSelection } =
    useContext(ImportPromotionsContext);
  const tColumns = useTranslations('campaignManagement.importPromotions.columns');
  /* ── Promotions state ── */
  const [search, setSearch] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const skipDebounceRef = useRef(false);
  const [, startTransition] = useTransition();
  const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: false }]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: INITIAL_PAGE_INDEX,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [viewItem, setViewItem] = useState<PromotionType | null>(null);

  const columns = useMemo(
    () =>
      getImportPromotionsColumns({
        onViewDetails: (item) => setViewItem(item),
        t: tColumns,
      }),
    [tColumns],
  );
  const debouncedSearch = useDebounce(search, SEARCH_DEBOUNCE_MS);

  const sortOrder =
    sorting.length > 0 ? (sorting[0].desc ? SortOrder.DESC : SortOrder.ASC) : SortOrder.ASC;

  /* ── Fetch promotions from source campaign (server-side) ── */
  const { data: promotionsData, loading: isLoadingPromotions } = useQuery<
    GetPromotionsByCampaignResponse,
    GetPromotionsByCampaignVariables
  >(GET_PROMOTIONS_BY_CAMPAIGN, {
    variables: {
      campaignId: sourceCampaignId,
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      sortOrder,
      search: activeSearch || undefined,
    },
    skip: !sourceCampaignId,
  });

  const promotions = promotionsData?.promotionsByCampaign?.promotions ?? [];
  const paginationInfo = promotionsData?.promotionsByCampaign?.pagination;
  const totalCount = paginationInfo?.totalCount ?? 0;
  const startRow = totalCount > 0 ? pagination.pageIndex * pagination.pageSize + 1 : 0;
  const endRow = Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalCount);
  const rowsOnPage =
    totalCount > 0 && Math.ceil(totalCount / pagination.pageSize) === pagination.pageIndex + 1
      ? endRow - startRow + 1
      : pagination.pageSize;

  /* ── Table ── */
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: promotions,
    columns,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualPagination: true,
    pageCount: paginationInfo?.totalPages ?? 0,
    rowCount: paginationInfo?.totalCount,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    state: { sorting, pagination, rowSelection },
  });

  /* ── Handlers ── */
  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
  }

  function handleClearSearch() {
    skipDebounceRef.current = true;
    startTransition(() => {
      setSearch('');
      setActiveSearch('');
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    });
  }

  function handleClear() {
    table.resetRowSelection();
  }

  useEffect(() => {
    if (skipDebounceRef.current) {
      skipDebounceRef.current = false;
      return;
    }
    startTransition(() => {
      setActiveSearch(debouncedSearch);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    });
  }, [debouncedSearch]);

  /* ── Reset state when source campaign changes ── */
  useEffect(() => {
    setPagination({ pageIndex: INITIAL_PAGE_INDEX, pageSize: DEFAULT_PAGE_SIZE });
    setRowSelection({});
    setSearch('');
    setActiveSearch('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceCampaignId]);

  return {
    // source campaign
    sourceCampaignId,
    // table
    table,
    columns,
    search,
    isLoadingPromotions,
    totalCount,
    startRow,
    endRow,
    rowsOnPage,
    paginationInfo,
    hasSelection,
    viewItem,
    setViewItem,

    // handlers
    handleSearchChange,
    handleClearSearch,
    handleClear,

    // translations
    t,
  };
}
