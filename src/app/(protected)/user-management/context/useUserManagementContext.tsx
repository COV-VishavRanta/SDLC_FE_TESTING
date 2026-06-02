import {
  DEFAULT_PAGE_SIZE,
  INITIAL_PAGE_INDEX,
  SEARCH_DEBOUNCE_MS,
  SortOrder,
  UserRole,
  UserSortField,
  UserStatusEnum,
} from '@/constant';
import { useGlobalProtected } from '@/contexts/GlobalProtectedContext';
import { GET_USERS } from '@/graphql';
import { GetUsersResponse, GetUsersVariables } from '@/graphql/queries/user/user.types';
import { BrandType, PSPType, StoreType } from '@/types';
import { skipToken, useSuspenseQuery } from '@apollo/client/react';
import { PaginationState, SortingState } from '@tanstack/react-table';
import { useDebounce } from '@uidotdev/usehooks';
import { useEffect, useMemo, useRef, useState, useTransition } from 'react';

/* ── Column ID → GraphQL sort field mapping ── */
const COLUMN_SORT_MAP: Record<string, UserSortField> = {
  name: UserSortField.NAME,
  email: UserSortField.EMAIL,
  roles: UserSortField.ROLE,
  status: UserSortField.STATUS,
  createdAt: UserSortField.CREATED_AT,
};

/* ── "All PSPs" sentinel ── */
const ALL_PSPS = '__ALL__';

/* ── "All Roles" sentinel ── */
const ALL_ROLES = '__ALL__';

/* ── "All Brands" sentinel ── */
const ALL_BRANDS = '__ALL__';

/* ── "All Stores" sentinel ── */
const ALL_STORES = '__ALL__';

/* ── "All Status" sentinel ── */
const ALL_STATUSES = '__ALL__';

/* ── Filter state ── */
interface FilterState {
  search: string;
  status: UserStatusEnum | string;
  roleId: string;
  pspId: string;
  brandId: string;
  storeId: string;
}

const DEFAULT_FILTER_STATE: FilterState = {
  search: '',
  status: UserStatusEnum.ACTIVE,
  roleId: ALL_ROLES,
  pspId: ALL_PSPS,
  brandId: ALL_BRANDS,
  storeId: ALL_STORES,
};

export default function useUserManagementContext({
  currentUserRole,
}: {
  currentUserRole?: string;
}) {
  const { selectedPspId, selectedBrandId, selectedStoreId, allRoles } = useGlobalProtected();
  const isPlatformAdmin = currentUserRole === UserRole.PLATFORM_ADMIN;
  const isPspAdmin = currentUserRole === UserRole.PSP_ADMIN;
  const isBrandAdmin = currentUserRole === UserRole.BRAND_ADMIN;
  const isStoreAdmin = currentUserRole === UserRole.STORE_ADMIN;
  const assignableRoles = allRoles.filter((r) => r.assignable);

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
  const variables = useMemo<GetUsersVariables>(() => {
    const sortField =
      sorting.length > 0
        ? (COLUMN_SORT_MAP[sorting[0].id] ?? UserSortField.CREATED_AT)
        : UserSortField.CREATED_AT;

    const sortOrder =
      sorting.length > 0 ? (sorting[0].desc ? SortOrder.DESC : SortOrder.ASC) : SortOrder.DESC;

    return {
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      filter: {
        search: activeSearch || undefined,
        status:
          filterState.status !== ALL_STATUSES ? (filterState.status as UserStatusEnum) : undefined,
        roleIds: filterState.roleId !== ALL_ROLES ? [filterState.roleId] : undefined,
        pspIds: filterState.pspId !== ALL_PSPS ? [filterState.pspId] : undefined,
        brandIds: filterState.brandId !== ALL_BRANDS ? [filterState.brandId] : undefined,
        storeIds: filterState.storeId !== ALL_STORES ? [filterState.storeId] : undefined,
      },
      sort: { field: sortField, order: sortOrder },
      scope: {
        pspId: isPspAdmin ? selectedPspId : undefined, //only send for PSP Admin
        brandId: isBrandAdmin ? selectedBrandId : undefined, //only send for Brand Admin
        storeId: isStoreAdmin ? selectedStoreId : undefined, //only send for Store Admin
      },
    };
  }, [
    sorting,
    pagination,
    activeSearch,
    filterState.status,
    filterState.roleId,
    filterState.pspId,
    filterState.brandId,
    filterState.storeId,
    selectedPspId,
    selectedBrandId,
    selectedStoreId,
    isPspAdmin,
    isBrandAdmin,
    isStoreAdmin,
  ]);

  /* ────── Apollo drives data — auto-refetches when variables change ────── */
  const hasRole = Boolean(currentUserRole);
  const { data, refetch } = useSuspenseQuery<GetUsersResponse, GetUsersVariables>(
    GET_USERS,
    hasRole ? { variables, fetchPolicy: 'network-only' } : skipToken,
  );

  /* ────── Handlers — wrap state mutations in transitions ────── */
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
      setFilterState((prev) => ({
        ...prev,
        status: DEFAULT_FILTER_STATE.status,
        roleId: ALL_ROLES,
        pspId: ALL_PSPS,
        brandId: ALL_BRANDS,
        storeId: ALL_STORES,
      }));
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    });
  };

  const updateRole = (roleId: string) => {
    startTransition(() => {
      setFilterState((prev) => ({ ...prev, roleId }));
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    });
  };

  const updatePsp = (pspId: string) => {
    startTransition(() => {
      setFilterState((prev) => ({ ...prev, pspId }));
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    });
  };

  const updateBrand = (brandId: string) => {
    startTransition(() => {
      setFilterState((prev) => ({ ...prev, brandId }));
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

  /* ────── CRUD success handlers — refetch with current filters ────── */

  const handleCreateUser = () => {
    startTransition(() => {
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
      refetch({
        ...variables,
      }).catch(() => undefined);
    });
  };

  /* ── Derive PSP / Brand / Store lists from the latest response ── */
  const pspList: PSPType[] = data?.listUsers?.psps ?? [];
  const brandList: BrandType[] = data?.listUsers?.brands ?? [];
  const storeList: Pick<StoreType, 'id' | 'name'>[] = data?.listUsers?.stores ?? [];

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
    // Data
    userList: data?.listUsers?.users,
    loading: isPending,
    sorting,
    setSorting: handleSortingChange,
    pagination,
    setPagination: handlePaginationChange,
    paginationInfo: data?.listUsers?.pagination,

    // Filters
    filterState,
    updateSearch,
    clearSearch,
    updateStatus,
    updateRole,
    updatePsp,
    pspList,
    updateBrand,
    brandList,
    updateStore,
    storeList,
    resetFilters,

    // CRUD handlers
    handleCreateUser,
    handleUpdateUser: refetch,
    handleDeleteUser: refetch,
    handleActivateUser: refetch,
    handleDeactivateUser: refetch,

    // Permissions
    isPlatformAdmin,
    isPspAdmin,
    isBrandAdmin,
    assignableRoles,

    // Constants for "All" options in filters
    ALL_PSPS,
    ALL_ROLES,
    ALL_BRANDS,
    ALL_STORES,
    ALL_STATUSES,
  } as const;
}
