'use client';

import {
  DEFAULT_PAGE_SIZE,
  INITIAL_PAGE_INDEX,
  InventorySortField,
  SEARCH_DEBOUNCE_MS,
  SortOrder,
} from '@/constant';
import {
  GET_BRANDS,
  GetBrandsResponse,
  GetBrandsVariables,
  LIST_INVENTORY,
  ListInventoryResponse,
  ListInventoryVariables,
} from '@/graphql';
import { skipToken, useSuspenseQuery } from '@apollo/client/react';
import { PaginationState, SortingState } from '@tanstack/react-table';
import { useDebounce } from '@uidotdev/usehooks';
import { useEffect, useMemo, useRef, useState, useTransition } from 'react';

/* ── Column ID → GraphQL sort field mapping ── */
const COLUMN_SORT_MAP: Record<string, InventorySortField> = {
  name: InventorySortField.NAME,
};

/* ── "All" sentinels ── */
const ALL_BRANDS = '__ALL__';

/* ── Filter state ── */
interface FilterState {
  search: string;
  brandId: string;
}

const DEFAULT_FILTER_STATE: FilterState = {
  search: '',
  brandId: ALL_BRANDS,
};

export default function useInventoryManagementContext(pspId: string | undefined) {
  /* ────── TanStack table state ────── */
  const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: false }]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: INITIAL_PAGE_INDEX,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [filterState, setFilterState] = useState<FilterState>(DEFAULT_FILTER_STATE);

  const [activeSearch, setActiveSearch] = useState('');
  /* Skip the debounce effect when clearSearch already handled the update directly */
  const skipDebounceRef = useRef(false);

  /* ── Transition keeps stale UI visible while refetching ── */
  const [isPending, startTransition] = useTransition();

  /* ── Debounce search ── */
  const debouncedSearch = useDebounce(filterState.search, SEARCH_DEBOUNCE_MS);

  /* ────── Derive GraphQL variables reactively ────── */
  const variables = useMemo<ListInventoryVariables | null>(() => {
    if (!pspId) return null;

    const sortField =
      sorting.length > 0
        ? (COLUMN_SORT_MAP[sorting[0].id] ?? InventorySortField.NAME)
        : InventorySortField.NAME;

    const sortOrder =
      sorting.length > 0 ? (sorting[0].desc ? SortOrder.DESC : SortOrder.ASC) : SortOrder.ASC;

    const brandIds = filterState.brandId !== ALL_BRANDS ? [filterState.brandId] : undefined;

    return {
      pspId,
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      filter: {
        search: activeSearch || undefined,
        brandIds,
      },
      sort: { field: sortField, order: sortOrder },
    };
  }, [pspId, sorting, pagination, activeSearch, filterState.brandId]);

  /* ── Brand list variables (for the brand filter dropdown) ── */
  const brandsVariables = useMemo<GetBrandsVariables | null>(() => {
    if (!pspId) return null;
    return { pspId, pageSize: -1 };
  }, [pspId]);

  /* ────── Queries ────── */
  const { data, refetch } = useSuspenseQuery<ListInventoryResponse, ListInventoryVariables>(
    LIST_INVENTORY,
    variables ? { variables, fetchPolicy: 'network-only' } : skipToken,
  );

  const { data: brandsData } = useSuspenseQuery<GetBrandsResponse, GetBrandsVariables>(
    GET_BRANDS,
    brandsVariables ? { variables: brandsVariables, fetchPolicy: 'network-only' } : skipToken,
  );

  /* ────── Handlers ────── */
  const handleSortingChange = (updater: SortingState | ((prev: SortingState) => SortingState)) => {
    startTransition(() => {
      setSorting(updater);
    });
  };

  const handlePaginationChange = (
    updater: PaginationState | ((prev: PaginationState) => PaginationState),
  ) => {
    startTransition(() => {
      setPagination(updater);
    });
  };

  const updateSearch = (search: string) => {
    setFilterState((prev) => ({ ...prev, search }));
  };

  /* ── Instantly clears search — bypasses debounce ── */
  const clearSearch = () => {
    skipDebounceRef.current = true;
    startTransition(() => {
      setFilterState((prev) => ({ ...prev, search: '' }));
      setActiveSearch('');
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    });
  };

  /* ── Resets all filters ── */
  const resetFilters = () => {
    startTransition(() => {
      setFilterState(() => DEFAULT_FILTER_STATE);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    });
  };

  const updateBrandId = (brandId: string) => {
    startTransition(() => {
      setFilterState((prev) => ({ ...prev, brandId }));
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    });
  };

  const refetchInventory = () => {
    startTransition(() => {
      refetch(variables ?? undefined).catch(() => undefined);
    });
  };

  /* ────── Search debounce effect ────── */
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

  return {
    /* ── data ── */
    pspId,
    inventoryList: data?.listInventory?.inventoryItems ?? [],
    paginationInfo: data?.listInventory?.pagination,
    brandList: brandsData?.listBrands?.brands ?? [],

    /* ── table state ── */
    sorting,
    setSorting: handleSortingChange,
    pagination,
    setPagination: handlePaginationChange,

    /* ── filter state ── */
    filterState,
    updateSearch,
    clearSearch,
    updateBrandId,
    resetFilters,
    ALL_BRANDS,

    /* ── loading states ── */
    loading: isPending,

    /* ── actions ── */
    refetchInventory,
  } as const;
}
