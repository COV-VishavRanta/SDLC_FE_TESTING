'use client';

import {
  DEFAULT_PAGE_SIZE,
  EntityType,
  ExceptionRequestSortField,
  INITIAL_PAGE_INDEX,
  SEARCH_DEBOUNCE_MS,
  ShipmentReorderStatusEnum,
  SortOrder,
  UserRole,
} from '@/constant';
import {
  LIST_EXCEPTION_REQUESTS,
  ListExceptionRequestsResponse,
  ListExceptionRequestsVariables,
} from '@/graphql';
import { skipToken, useSuspenseQuery } from '@apollo/client/react';
import { PaginationState, SortingState } from '@tanstack/react-table';
import { useDebounce } from '@uidotdev/usehooks';
import { useEffect, useMemo, useRef, useState, useTransition } from 'react';

/* ── Column ID → GraphQL sort field mapping ── */
const COLUMN_SORT_MAP: Record<string, ExceptionRequestSortField> = {
  issueNumber: ExceptionRequestSortField.ISSUE_NUMBER,
  shipmentId: ExceptionRequestSortField.SHIPMENT_NUMBER,
  orderNumber: ExceptionRequestSortField.ORDER_NUMBER,
};

/* ── Sentinel values ── */
const ALL_CAMPAIGNS = '__ALL_CAMPAIGNS__';
const ALL_STATUSES = '__ALL_STATUSES__';
const ALL_STORES = '__ALL_STORES__';

/* ── Filter state ── */
interface FilterState {
  search: string;
  campaignId: string;
  status: string;
  storeId: string;
}

const DEFAULT_FILTER_STATE: FilterState = {
  search: '',
  campaignId: ALL_CAMPAIGNS,
  status: ALL_STATUSES,
  storeId: ALL_STORES,
};

export default function useExceptionRequestContext({
  roleName,
  entityId,
  entityType,
}: {
  roleName: string;
  entityId?: string;
  entityType?: EntityType;
}) {
  /* ────── TanStack table state ────── */
  const [sorting, setSorting] = useState<SortingState>([{ id: 'issueNumber', desc: true }]);
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
  const variables = useMemo<ListExceptionRequestsVariables | null>(() => {
    if (!entityId) return null;

    const sortField =
      sorting.length > 0
        ? (COLUMN_SORT_MAP[sorting[0].id] ?? ExceptionRequestSortField.CAMPAIGN_NAME)
        : ExceptionRequestSortField.CAMPAIGN_NAME;

    const sortOrder =
      sorting.length > 0 ? (sorting[0].desc ? SortOrder.DESC : SortOrder.ASC) : SortOrder.DESC;

    return {
      [entityType ?? '']: entityId,
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      filter: {
        search: activeSearch || undefined,
        campaignId: filterState.campaignId !== ALL_CAMPAIGNS ? filterState.campaignId : undefined,
        status:
          filterState.status !== ALL_STATUSES
            ? (filterState.status as ShipmentReorderStatusEnum)
            : undefined,
        storeId:
          roleName === UserRole.BRAND_ADMIN && filterState.storeId !== ALL_STORES
            ? filterState.storeId
            : undefined,
      },
      sort: { field: sortField, order: sortOrder },
    };
  }, [
    entityId,
    sorting,
    entityType,
    pagination.pageIndex,
    pagination.pageSize,
    activeSearch,
    filterState.campaignId,
    filterState.status,
    filterState.storeId,
    roleName,
  ]);

  /* ────── Query ────── */
  const { data, refetch } = useSuspenseQuery<
    ListExceptionRequestsResponse,
    ListExceptionRequestsVariables
  >(LIST_EXCEPTION_REQUESTS, variables ? { variables, fetchPolicy: 'network-only' } : skipToken);

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

  const clearSearch = () => {
    skipDebounceRef.current = true;
    startTransition(() => {
      setFilterState((prev) => ({ ...prev, search: '' }));
      setActiveSearch('');
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    });
  };

  const updateCampaign = (campaignId: string) => {
    startTransition(() => {
      setFilterState((prev) => ({ ...prev, campaignId }));
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    });
  };

  const updateStatus = (status: string) => {
    startTransition(() => {
      setFilterState((prev) => ({ ...prev, status }));
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    });
  };

  const updateStore = (storeId: string) => {
    startTransition(() => {
      setFilterState((prev) => ({ ...prev, storeId }));
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    });
  };

  const resetFilters = () => {
    startTransition(() => {
      setFilterState(DEFAULT_FILTER_STATE);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    });
  };

  const refetchExceptionRequests = () => {
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
    exceptionRequestList: data?.listExceptionRequests?.exceptionRequests ?? [],
    paginationInfo: data?.listExceptionRequests?.pagination,
    statusCounts: data?.listExceptionRequests?.statusCounts,
    filterOptions: data?.listExceptionRequests?.filterOptions,

    /* ── table state ── */
    sorting,
    setSorting: handleSortingChange,
    pagination,
    setPagination: handlePaginationChange,

    /* ── filter state ── */
    filterState,
    updateSearch,
    clearSearch,
    updateCampaign,
    updateStatus,
    updateStore,
    resetFilters,
    ALL_CAMPAIGNS,
    ALL_STATUSES,
    ALL_STORES,
    isBrandAdmin: roleName === UserRole.BRAND_ADMIN,

    /* ── loading states ── */
    loading: isPending,

    /* ── actions ── */
    refetchExceptionRequests,
  } as const;
}
