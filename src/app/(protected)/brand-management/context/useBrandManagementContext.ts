'use client';

import {
  BrandSortField,
  DEFAULT_PAGE_SIZE,
  INITIAL_PAGE_INDEX,
  SEARCH_DEBOUNCE_MS,
  SortOrder,
} from '@/constant';
import {
  GET_BRANDS,
  GetBrandsResponse,
  GetBrandsVariables,
  UPDATE_BRAND_STATUS,
  UpdateBrandStatusResponse,
  UpdateBrandStatusVariables,
} from '@/graphql';
import { IncompleteCampaignType } from '@/types';
import { skipToken, useMutation, useSuspenseQuery } from '@apollo/client/react';
import { PaginationState, SortingState } from '@tanstack/react-table';
import { useDebounce } from '@uidotdev/usehooks';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { toast } from 'sonner';

/* ── Column ID → GraphQL sort field mapping ── */
const COLUMN_SORT_MAP: Record<string, BrandSortField> = {
  name: BrandSortField.NAME,
  createdAt: BrandSortField.CREATED_AT,
};

/* ── "All Status" sentinel ── */
const ALL_STATUSES = '__ALL__';

/* ── Filter state ── */
interface FilterState {
  search: string;
  status: string;
}

const DEFAULT_FILTER_STATE: FilterState = {
  search: '',
  status: 'true', // All brands by default
};

export default function useBrandManagementContext(pspId: string | undefined) {
  const t = useTranslations('brandManagement.messages');

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
  const variables = useMemo<GetBrandsVariables | null>(() => {
    const sortField =
      sorting.length > 0
        ? (COLUMN_SORT_MAP[sorting[0].id] ?? BrandSortField.NAME)
        : BrandSortField.NAME;

    const sortOrder =
      sorting.length > 0 ? (sorting[0].desc ? SortOrder.DESC : SortOrder.ASC) : SortOrder.ASC;

    const isActive =
      filterState.status !== ALL_STATUSES ? filterState.status === 'true' : undefined;

    if (!pspId) return null;

    return {
      pspId,
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      filter: {
        search: activeSearch || undefined,
        isActive,
      },
      sort: { field: sortField, order: sortOrder },
    };
  }, [pspId, sorting, pagination, activeSearch, filterState.status]);

  /* ────── Queries ────── */
  const { data, refetch } = useSuspenseQuery<GetBrandsResponse, GetBrandsVariables>(
    GET_BRANDS,
    variables ? { variables, fetchPolicy: 'network-only' } : skipToken,
  );

  /* ────── Mutations ────── */
  const [updateBrandStatusMutation, { loading: isUpdatingStatus }] = useMutation<
    UpdateBrandStatusResponse,
    UpdateBrandStatusVariables
  >(UPDATE_BRAND_STATUS);

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

  /* ── Resets all filters except search ── */
  const resetFilters = () => {
    startTransition(() => {
      setFilterState(() => DEFAULT_FILTER_STATE);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    });
  };

  const updateStatus = (status: string) => {
    startTransition(() => {
      setFilterState((prev) => ({ ...prev, status }));
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    });
  };

  const refetchBrands = () => {
    startTransition(() => {
      refetch(variables ?? undefined).catch(() => undefined);
    });
  };

  const handleActivateBrand = async (brandId: string) => {
    await updateBrandStatusMutation({
      variables: { input: { id: brandId, isActive: true } },
      onCompleted: () => {
        toast.success(t('success.activated'));
        refetchBrands();
      },
    });
  };

  const handleDeactivateBrand = async (
    brandId: string,
  ): Promise<IncompleteCampaignType[] | null> => {
    const result = await updateBrandStatusMutation({
      variables: { input: { id: brandId, isActive: false } },
    });

    const payload = result.data?.updateBrandStatus;

    if (payload?.success === false && payload.incompleteCampaigns?.length) {
      return payload.incompleteCampaigns;
    }

    if (payload?.success) {
      toast.success(t('success.deactivated'));
      refetchBrands();
    }

    return null;
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
    brandList: data?.listBrands?.brands ?? [],
    paginationInfo: data?.listBrands?.pagination,
    brandData: data?.listBrands,

    /* ── table state ── */
    sorting,
    setSorting: handleSortingChange,
    pagination,
    setPagination: handlePaginationChange,

    /* ── filter state ── */
    filterState,
    updateSearch,
    clearSearch,
    updateStatus,
    resetFilters,
    ALL_STATUSES,

    /* ── loading states ── */
    loading: isPending,
    isUpdatingStatus,

    /* ── actions ── */
    refetchBrands,
    handleCreateBrand: refetchBrands,
    handleUpdateBrand: refetchBrands,
    handleActivateBrand,
    handleDeactivateBrand,
    handleDeleteBrand: refetchBrands,
  } as const;
}
