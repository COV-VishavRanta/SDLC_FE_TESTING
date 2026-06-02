'use client';

import {
  DEFAULT_PAGE_SIZE,
  INITIAL_PAGE_INDEX,
  SEARCH_DEBOUNCE_MS,
  SortOrder,
  WebhookSortField,
} from '@/constant';
import {
  GET_WEBHOOK_CREDENTIALS,
  GetWebhookCredentialsResponse,
  GetWebhookCredentialsVariables,
} from '@/graphql';
import { useSuspenseQuery } from '@apollo/client/react';
import { PaginationState, SortingState } from '@tanstack/react-table';
import { useDebounce } from '@uidotdev/usehooks';
import { useEffect, useMemo, useRef, useState, useTransition } from 'react';

/* ── Column ID → GraphQL sort field mapping ── */
const COLUMN_SORT_MAP: Record<string, WebhookSortField> = {
  label: WebhookSortField.LABEL,
  createdAt: WebhookSortField.CREATED_AT,
  lastUsedAt: WebhookSortField.LAST_USED_AT,
};

/* ── Sentinel values ── */
const ALL_STATUSES = '__ALL_STATUSES__';

/* ── Filter state ── */
interface FilterState {
  search: string;
  status: string;
  pspId: string;
}

const ALL_PSPS = '__ALL_PSPS__';

const DEFAULT_FILTER_STATE: FilterState = {
  search: '',
  status: 'true',
  pspId: ALL_PSPS,
};

export default function useWebhookContext() {
  /* ────── TanStack table state ────── */
  const [sorting, setSorting] = useState<SortingState>([{ id: 'label', desc: false }]);
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
  const variables = useMemo<GetWebhookCredentialsVariables>(() => {
    const sortField =
      sorting.length > 0
        ? (COLUMN_SORT_MAP[sorting[0].id] ?? WebhookSortField.LABEL)
        : WebhookSortField.LABEL;

    const sortOrder =
      sorting.length > 0 ? (sorting[0].desc ? SortOrder.DESC : SortOrder.ASC) : SortOrder.ASC;

    return {
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      filter: {
        search: activeSearch || undefined,
        isActive: filterState.status === ALL_STATUSES ? undefined : filterState.status === 'true',
        pspId: filterState.pspId === ALL_PSPS ? undefined : filterState.pspId,
      },
      sort: { field: sortField, order: sortOrder },
    };
  }, [sorting, pagination, activeSearch, filterState]);

  /* ────── Query ────── */
  const { data, refetch } = useSuspenseQuery<
    GetWebhookCredentialsResponse,
    GetWebhookCredentialsVariables
  >(GET_WEBHOOK_CREDENTIALS, {
    variables,
    fetchPolicy: 'network-only',
  });

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

  const updateStatus = (status: string) => {
    startTransition(() => {
      setFilterState((prev) => ({ ...prev, status }));
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    });
  };

  const updatePsp = (pspId: string) => {
    startTransition(() => {
      setFilterState((prev) => ({ ...prev, pspId }));
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    });
  };

  const resetFilters = () => {
    skipDebounceRef.current = true;
    startTransition(() => {
      setFilterState(DEFAULT_FILTER_STATE);
      setActiveSearch('');
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    });
  };

  const refetchWebhooks = () => {
    startTransition(() => {
      refetch(variables).catch(() => undefined);
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
    credentials: data?.webhookCredentials?.credentials ?? [],
    paginationInfo: data?.webhookCredentials?.pagination,
    totalCredentials: data?.webhookCredentials?.totalCredentials ?? 0,
    activeCredentials: data?.webhookCredentials?.activeCredentials ?? 0,
    inactiveCredentials: data?.webhookCredentials?.inactiveCredentials ?? 0,

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
    updatePsp,
    resetFilters,
    ALL_STATUSES,
    ALL_PSPS,

    /* ── loading states ── */
    loading: isPending,

    /* ── actions ── */
    refetchWebhooks,
  } as const;
}
