import {
  DateRangeEnum,
  DEFAULT_PAGE_SIZE,
  INITIAL_PAGE_INDEX,
  SEARCH_DEBOUNCE_MS,
} from '@/constant';
import { GET_AUDIT_LOGS } from '@/graphql';
import {
  GetAuditLogsResponse,
  GetAuditLogsVariables,
} from '@/graphql/queries/audit-logs/audit-logs.types';
import { useSuspenseQuery } from '@apollo/client/react';
import { PaginationState } from '@tanstack/react-table';
import { useDebounce } from '@uidotdev/usehooks';
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react';

export default function useAuditLogContext() {
  /* ────── TanStack table state ────── */
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: INITIAL_PAGE_INDEX,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  /* ── Filter state ── */
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState<DateRangeEnum | null>(
    DateRangeEnum.TODAY,
  );
  const [search, setSearch] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  /* Skip the debounce effect when clearSearch already handled the update directly */
  const skipDebounceRef = useRef(false);

  /* ── Transition keeps stale UI visible while refetching ── */
  const [isPending, startTransition] = useTransition();

  /* ── Debounce search ── */
  const debouncedSearch = useDebounce(search, SEARCH_DEBOUNCE_MS);

  /* ────── Derive GraphQL variables reactively ────── */
  const variables = useMemo<GetAuditLogsVariables>(() => {
    return {
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      filter: {
        ...(activeSearch ? { search: activeSearch } : {}),
        ...(selectedRoleId !== null ? { roleIds: [selectedRoleId] } : {}),
        ...(selectedDateRange !== null ? { dateRange: selectedDateRange } : {}),
      },
    };
  }, [pagination, activeSearch, selectedRoleId, selectedDateRange]);

  /* ────── Apollo drives data ── */
  const { data } = useSuspenseQuery<GetAuditLogsResponse, GetAuditLogsVariables>(GET_AUDIT_LOGS, {
    variables,
    fetchPolicy: 'network-only',
  });

  const initialData = useRef(data);
  /* ────── Handlers ── */

  const handlePaginationChange = (
    updater: PaginationState | ((prev: PaginationState) => PaginationState),
  ) => {
    startTransition(() => {
      setPagination(updater);
    });
  };

  const handleRoleChange = (roleId: string | null) => {
    startTransition(() => {
      setSelectedRoleId(roleId);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    });
  };

  const handleDateRangeChange = (dateRange: DateRangeEnum | null) => {
    startTransition(() => {
      setSelectedDateRange(dateRange);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    });
  };

  const updateSearch = (value: string) => {
    setSearch(value);
  };

  /* ── Instantly clears search — bypasses debounce ── */
  const clearSearch = useCallback(() => {
    skipDebounceRef.current = true;
    startTransition(() => {
      setSearch('');
      setActiveSearch('');
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    });
  }, []);

  /* ── Resets all filters except search ── */
  const resetFilters = useCallback(() => {
    startTransition(() => {
      setSelectedRoleId(null);
      setSelectedDateRange(DateRangeEnum.TODAY);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    });
  }, []);

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
    /* ── TanStack state ── */
    pagination,
    setPagination: handlePaginationChange,

    /* ── Filters ── */
    search,
    updateSearch,
    clearSearch,
    selectedRoleId,
    handleRoleChange,
    selectedDateRange,
    handleDateRangeChange,
    resetFilters,

    /* ── Data ── */
    // eslint-disable-next-line react-hooks/refs
    initialData: initialData?.current,
    loading: isPending,
    logs: data?.auditLogs?.logs ?? [],
    paginationInfo: data?.auditLogs?.pagination,
  } as const;
}
