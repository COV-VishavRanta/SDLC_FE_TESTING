'use client';

import { DEFAULT_PAGE_SIZE, INITIAL_PAGE_INDEX, SEARCH_DEBOUNCE_MS } from '@/constant';
import { GET_NOTIFICATIONS, GetNotificationsResponse, GetNotificationsVariables } from '@/graphql';
import { skipToken, useSuspenseQuery } from '@apollo/client/react';
import { PaginationState } from '@tanstack/react-table';
import { useDebounce } from '@uidotdev/usehooks';
import { useEffect, useRef, useState, useTransition } from 'react';

export default function useAlertsContext(
  brandId: string | undefined,
  pspId?: string | undefined,
  storeId?: string | undefined,
) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: INITIAL_PAGE_INDEX,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const skipDebounceRef = useRef(false);
  const [isPending, startTransition] = useTransition();

  const debouncedSearch = useDebounce(searchQuery, SEARCH_DEBOUNCE_MS);

  const variables: GetNotificationsVariables | null = {
    ...(pspId ? { pspId } : {}),
    ...(brandId ? { brandId } : {}),
    ...(storeId ? { storeId } : {}),
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    search: activeSearch || undefined,
  };
  const { data } = useSuspenseQuery<GetNotificationsResponse, GetNotificationsVariables>(
    GET_NOTIFICATIONS,
    variables ? { variables, fetchPolicy: 'network-only' } : skipToken,
  );

  const handlePaginationChange = (
    updater: PaginationState | ((prev: PaginationState) => PaginationState),
  ) => {
    startTransition(() => {
      setPagination(updater);
    });
  };

  const updateSearch = (search: string) => {
    setSearchQuery(search);
  };

  const clearSearch = () => {
    skipDebounceRef.current = true;
    startTransition(() => {
      setSearchQuery('');
      setActiveSearch('');
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    });
  };

  /* ── Debounce search → reset to page 1 ── */
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
    alertsList: data?.notifications?.notifications ?? [],
    paginationInfo: data?.notifications?.pagination,
    pagination,
    setPagination: handlePaginationChange,
    searchQuery,
    updateSearch,
    clearSearch,
    loading: isPending,
  };
}
