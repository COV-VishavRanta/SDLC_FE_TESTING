'use client';

import { CARD_PAGE_SIZE_OPTIONS, INITIAL_PAGE_INDEX, SEARCH_DEBOUNCE_MS } from '@/constant';
import { PaginationState } from '@tanstack/react-table';
import { useDebounce } from '@uidotdev/usehooks';
import { useEffect, useMemo, useRef, useState, useTransition } from 'react';

/**
 * Client-side search + pagination hook for card-based list layouts.
 *
 * The caller provides all items (already fetched from the API) and a predicate
 * function that returns true when an item matches the current search query.
 * The hook handles debouncing, page-reset-on-search, and wraps pagination
 * changes in `startTransition` to keep interactions responsive.
 */
export function useClientPagination<T>(
  items: T[],
  searchFn: (item: T, query: string) => boolean,
  initialPageSize: (typeof CARD_PAGE_SIZE_OPTIONS)[number] = CARD_PAGE_SIZE_OPTIONS[0],
) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: INITIAL_PAGE_INDEX,
    pageSize: initialPageSize,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const skipDebounceRef = useRef(false);
  const [isPending, startTransition] = useTransition();

  const debouncedSearch = useDebounce(searchQuery, SEARCH_DEBOUNCE_MS);

  /* Filter items by active (debounced) search query */
  const filteredItems = useMemo(
    () => (activeSearch ? items.filter((item) => searchFn(item, activeSearch)) : items),
    [items, activeSearch, searchFn],
  );

  const totalCount = filteredItems.length;
  const { pageIndex, pageSize } = pagination;
  const pageCount = Math.max(1, Math.ceil(totalCount / pageSize));

  /* Slice to current page */
  const pagedItems = useMemo(
    () => filteredItems.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize),
    [filteredItems, pageIndex, pageSize],
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

  /* Apply debounced search value and reset to first page */
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
    pagedItems,
    totalCount,
    pageCount,
    pagination,
    setPagination: handlePaginationChange,
    searchQuery,
    updateSearch,
    clearSearch,
    loading: isPending,
  };
}
