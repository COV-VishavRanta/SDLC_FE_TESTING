'use client';

import {
  DEFAULT_PAGE_SIZE,
  INITIAL_PAGE_INDEX,
  SEARCH_DEBOUNCE_MS,
  ShipmentSortField,
  ShipmentStatusEnum,
  SortOrder,
} from '@/constant';
import { LIST_SHIPMENTS, ListShipmentsResponse, ListShipmentsVariables } from '@/graphql';
import { useCapabilities } from '@/hooks';
import {
  DEFAULT_SHIPMENT_CAPABILITIES,
  SHIPMENT_CAPABILITIES_MAP,
} from '@/lib/permissions/capabilities/shipment.capabilities';
import { skipToken, useSuspenseQuery } from '@apollo/client/react';
import { PaginationState, SortingState } from '@tanstack/react-table';
import { useDebounce } from '@uidotdev/usehooks';
import { useEffect, useMemo, useRef, useState, useTransition } from 'react';

/* ── Column ID → GraphQL sort field mapping ── */
const COLUMN_SORT_MAP: Record<string, ShipmentSortField> = {
  shipmentNumber: ShipmentSortField.SHIPMENT_NUMBER,
  orderNumber: ShipmentSortField.ORDER_NUMBER,
  campaignName: ShipmentSortField.CAMPAIGN_NAME,
  shipmentEta: ShipmentSortField.SHIPMENT_ETA,
  store: ShipmentSortField.STORE_NAME,
};

/* ── Sentinel values ── */
const ALL_CAMPAIGNS = '__ALL_CAMPAIGNS__';
const ALL_STORES = '__ALL_STORES__';
const ALL_STATUSES = '__ALL_STATUSES__';

/* ── Filter state ── */
interface FilterState {
  search: string;
  campaignId: string;
  storeId: string;
  status: string;
}

const DEFAULT_FILTER_STATE: FilterState = {
  search: '',
  campaignId: ALL_CAMPAIGNS,
  storeId: ALL_STORES,
  status: ALL_STATUSES,
};

export default function useShipmentContext({
  pspId,
  brandId,
  storeId,
}: {
  pspId?: string;
  brandId?: string;
  storeId?: string;
}) {
  /* ────── Capabilities ────── */
  const capabilities = useCapabilities(SHIPMENT_CAPABILITIES_MAP, DEFAULT_SHIPMENT_CAPABILITIES);

  /* ────── TanStack table state ────── */
  const [sorting, setSorting] = useState<SortingState>([{ id: 'shipmentNumber', desc: true }]);
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
  const variables = useMemo<ListShipmentsVariables | null>(() => {
    if (!pspId && !brandId && !storeId) return null;

    const sortField =
      sorting.length > 0
        ? (COLUMN_SORT_MAP[sorting[0].id] ?? ShipmentSortField.SHIPMENT_NUMBER)
        : ShipmentSortField.SHIPMENT_NUMBER;

    const sortOrder =
      sorting.length > 0 ? (sorting[0].desc ? SortOrder.DESC : SortOrder.ASC) : SortOrder.ASC;

    return {
      pspId,
      brandId,
      storeId,
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      filter: {
        search: activeSearch || undefined,
        campaignId: filterState.campaignId !== ALL_CAMPAIGNS ? filterState.campaignId : undefined,
        storeId: filterState.storeId !== ALL_STORES ? filterState.storeId : undefined,
        status:
          filterState.status !== ALL_STATUSES
            ? (filterState.status as ShipmentStatusEnum)
            : undefined,
      },
      sort: { field: sortField, order: sortOrder },
    };
  }, [pspId, brandId, storeId, sorting, pagination, activeSearch, filterState]);

  /* ────── Query ────── */
  const { data, refetch } = useSuspenseQuery<ListShipmentsResponse, ListShipmentsVariables>(
    LIST_SHIPMENTS,
    variables ? { variables, fetchPolicy: 'network-only' } : skipToken,
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

  const updateStore = (storeId: string) => {
    startTransition(() => {
      setFilterState((prev) => ({ ...prev, storeId }));
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    });
  };

  const updateStatus = (status: string) => {
    startTransition(() => {
      setFilterState((prev) => ({ ...prev, status }));
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    });
  };

  const resetFilters = () => {
    startTransition(() => {
      setFilterState(DEFAULT_FILTER_STATE);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    });
  };

  const refetchShipments = () => {
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
    shipmentList: data?.listShipments?.shipments ?? [],
    paginationInfo: data?.listShipments?.pagination,
    summary: data?.listShipments?.summary,
    filterOptions: data?.listShipments?.filterOptions,

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
    updateStore,
    updateStatus,
    resetFilters,
    ALL_CAMPAIGNS,
    ALL_STORES,
    ALL_STATUSES,

    /* ── loading states ── */
    loading: isPending,

    /* ── capabilities ── */
    capabilities,

    /* ── actions ── */
    refetchShipments,
  } as const;
}
