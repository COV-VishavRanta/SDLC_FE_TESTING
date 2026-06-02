import {
  DEFAULT_PAGE_SIZE,
  INITIAL_PAGE_INDEX,
  PSPSortField,
  SEARCH_DEBOUNCE_MS,
  SortOrder,
} from '@/constant';
import {
  GET_PSPS,
  GetPSPsResponse,
  GetPSPsVariables,
  UPDATE_PSP_STATUS,
  UpdatePSPStatusArguments,
  UpdatePSPStatusResponse,
} from '@/graphql';
import { IncompleteCampaignType } from '@/types';
import { useMutation, useSuspenseQuery } from '@apollo/client/react';
import { PaginationState, SortingState } from '@tanstack/react-table';
import { useDebounce } from '@uidotdev/usehooks';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { toast } from 'sonner';

/* ── Column ID → GraphQL sort field mapping ── */
const COLUMN_SORT_MAP: Record<string, PSPSortField> = {
  name: PSPSortField.NAME,
  createdAt: PSPSortField.CREATED_AT,
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
  status: 'true',
};

export default function usePspManagementContext() {
  const t = useTranslations('pspManagement.messages');

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
  const variables = useMemo<GetPSPsVariables>(() => {
    const sortField =
      sorting.length > 0
        ? (COLUMN_SORT_MAP[sorting[0].id] ?? PSPSortField.CREATED_AT)
        : PSPSortField.CREATED_AT;

    const sortOrder =
      sorting.length > 0 ? (sorting[0].desc ? SortOrder.DESC : SortOrder.ASC) : SortOrder.DESC;

    return {
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      filter: {
        search: activeSearch || undefined,
        isActive: filterState.status !== ALL_STATUSES ? filterState.status === 'true' : undefined,
      },
      sort: { field: sortField, order: sortOrder },
    };
  }, [sorting, pagination, activeSearch, filterState.status]);

  /* ────── Queries ────── */
  const { data, refetch } = useSuspenseQuery<GetPSPsResponse, GetPSPsVariables>(GET_PSPS, {
    variables,
    fetchPolicy: 'network-only',
  });

  /* ────── Mutations ────── */

  const [updatePspStatusMutation, { loading: isUpdatingStatus }] = useMutation<
    UpdatePSPStatusResponse,
    UpdatePSPStatusArguments
  >(UPDATE_PSP_STATUS);

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
      setFilterState((prev) => ({ ...prev, status: DEFAULT_FILTER_STATE.status }));
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    });
  };

  const updateStatus = (status: string) => {
    startTransition(() => {
      setFilterState((prev) => ({ ...prev, status }));
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    });
  };

  const refetchPsps = () => {
    startTransition(() => {
      refetch({
        ...variables,
      }).catch(() => undefined);
    });
  };

  const handleDeactivatePsp = async (pspId: string): Promise<IncompleteCampaignType[] | null> => {
    const result = await updatePspStatusMutation({
      variables: { input: { id: pspId, isActive: false } },
    });

    const payload = result.data?.updatePspStatus;

    if (payload?.success === false && payload.incompleteCampaigns?.length) {
      return payload.incompleteCampaigns;
    }

    if (payload?.success) {
      toast.success(t('success.deactivated'));
      refetchPsps();
    }

    return null;
  };

  const handleActivatePsp = async (pspId: string) => {
    await updatePspStatusMutation({
      variables: { input: { id: pspId, isActive: true } },
      onCompleted: () => {
        toast.success(t('success.activated'));
        refetchPsps();
      },
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
    pspList: data?.psps?.psps ?? [],
    paginationInfo: data?.psps?.pagination,
    pspData: data?.psps,

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
    refetchPsps,
    handleCreatePsp: refetchPsps,
    handleUpdatePsp: refetchPsps,
    handleDeactivatePsp,
    handleActivatePsp,
  } as const;
}
