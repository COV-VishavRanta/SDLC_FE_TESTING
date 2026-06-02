import {
  CampaignSortField,
  CampaignStatusEnum,
  CampaignTypeEnum,
  DEFAULT_PAGE_SIZE,
  INITIAL_PAGE_INDEX,
  SEARCH_DEBOUNCE_MS,
  SortOrder,
} from '@/constant';
import { useGlobalProtected } from '@/contexts';
import {
  ARCHIVE_CAMPAIGN,
  ArchiveCampaignResponse,
  ArchiveCampaignVariables,
  CREATE_CAMPAIGN,
  CreateCampaignInput,
  CreateCampaignResponse,
  CreateCampaignVariables,
  DELETE_CAMPAIGN,
  DeleteCampaignResponse,
  DeleteCampaignVariables,
  GET_BRANDS,
  GetBrandsResponse,
  GetBrandsVariables,
  LIST_CAMPAIGNS,
  ListCampaignsResponse,
  ListCampaignsVariables,
  UPDATE_CAMPAIGN,
  UpdateCampaignInput,
  UpdateCampaignResponse,
  UpdateCampaignVariables,
} from '@/graphql';
import { useCapabilities } from '@/hooks';
import {
  CAMPAIGN_CAPABILITIES_MAP,
  DEFAULT_CAMPAIGN_CAPABILITIES,
} from '@/lib/permissions/route.permissions';
import { useMutation, useSuspenseQuery } from '@apollo/client/react';
import { PaginationState, SortingState } from '@tanstack/react-table';
import { useDebounce } from '@uidotdev/usehooks';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { toast } from 'sonner';

import { CampaignManagementProviderProps } from './CampaignManagementContext';

/* ── Column ID → GraphQL sort field mapping ── */
const COLUMN_SORT_MAP: Record<string, CampaignSortField> = {
  name: CampaignSortField.NAME,
  startDate: CampaignSortField.START_DATE,
  endDate: CampaignSortField.END_DATE,
  shipByDate: CampaignSortField.SHIP_BY_DATE,
};

/* ── Sentinel values for "show all" ── */
export const ALL_CAMPAIGN_TYPES = '__ALL__';
export const ALL_STATUSES = '__ALL__';
export const ALL_BRANDS = '__ALL__';
export const ALL_STORES = '__ALL__';

const BRANDS_DROPDOWN_PAGE_SIZE = 100;

/* ── Filter state ── */
interface FilterState {
  search: string;
  campaignType: string;
  status: string;
  isArchived: string;
  /** PSP Admin brand filter. Use ALL_BRANDS for "show all". */
  brandId: string;
  /** Brand Admin / Campaign Manager store filter. Use ALL_STORES for "show all". */
  storeId: string;
}

const DEFAULT_FILTER_STATE: FilterState = {
  search: '',
  campaignType: ALL_CAMPAIGN_TYPES,
  status: ALL_STATUSES,
  isArchived: 'false',
  brandId: ALL_BRANDS,
  storeId: ALL_STORES,
};

export default function useCampaignManagementContext({
  initialStatus,
}: Pick<CampaignManagementProviderProps, 'initialStatus'>) {
  const initialFilterState: FilterState = {
    ...DEFAULT_FILTER_STATE,
    status:
      initialStatus && (Object.values(CampaignStatusEnum) as string[]).includes(initialStatus)
        ? initialStatus
        : ALL_STATUSES,
  };

  const t = useTranslations('campaignManagement.messages');
  const { selectedBrandId, selectedPspId, selectedStoreId } = useGlobalProtected();
  const capabilities = useCapabilities(CAMPAIGN_CAPABILITIES_MAP, DEFAULT_CAMPAIGN_CAPABILITIES);

  const { data: brandsData } = useSuspenseQuery<GetBrandsResponse, GetBrandsVariables>(GET_BRANDS, {
    variables: { pspId: selectedPspId ?? '', pageSize: BRANDS_DROPDOWN_PAGE_SIZE },
    skip: !capabilities.showBrandFilter || !selectedPspId,
  });
  const brandsList = brandsData?.listBrands?.brands ?? [];

  /* ────── TanStack table state ────── */
  const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: false }]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: INITIAL_PAGE_INDEX,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [filterState, setFilterState] = useState<FilterState>(initialFilterState);
  const [activeSearch, setActiveSearch] = useState('');
  /* Skip the debounce effect when clearSearch already handled the update directly */
  const skipDebounceRef = useRef(false);

  /* ── Transition keeps stale UI visible while refetching ── */
  const [isPending, startTransition] = useTransition();

  /* ── Debounce search ── */
  const debouncedSearch = useDebounce(filterState.search, SEARCH_DEBOUNCE_MS);

  /* ────── Derive GraphQL variables reactively ────── */
  const variables = useMemo<ListCampaignsVariables>(() => {
    const sortField =
      sorting.length > 0
        ? (COLUMN_SORT_MAP[sorting[0].id] ?? CampaignSortField.NAME)
        : CampaignSortField.NAME;

    const sortOrder =
      sorting.length > 0 ? (sorting[0].desc ? SortOrder.DESC : SortOrder.ASC) : SortOrder.ASC;

    const isPsp = capabilities.listingEntityKey === 'pspId';
    const isBrand = capabilities.listingEntityKey === 'brandId';
    const isStore = capabilities.listingEntityKey === 'storeId';
    return {
      ...(isBrand ? { brandId: selectedBrandId ?? undefined } : {}),
      ...(isPsp ? { pspId: selectedPspId ?? undefined } : {}),
      ...(isStore ? { storeId: selectedStoreId ?? undefined } : {}),

      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      filter: {
        search: activeSearch || undefined,
        campaignType:
          filterState.campaignType !== ALL_CAMPAIGN_TYPES
            ? (filterState.campaignType as CampaignTypeEnum)
            : undefined,
        status:
          filterState.status && filterState.status !== ALL_STATUSES
            ? (filterState.status as CampaignStatusEnum)
            : undefined,
        brandId: filterState.brandId !== ALL_BRANDS ? filterState.brandId : undefined,
        storeId: filterState.storeId !== ALL_STORES ? filterState.storeId : undefined,
        isArchived: filterState.isArchived === 'true',
      },
      sort: { field: sortField, order: sortOrder },
    };
  }, [
    sorting,
    pagination,
    activeSearch,
    filterState.campaignType,
    filterState.status,
    filterState.isArchived,
    filterState.brandId,
    filterState.storeId,
    selectedBrandId,
    selectedPspId,
    selectedStoreId,
    capabilities,
  ]);

  /* ────── Query ────── */
  const { data, refetch } = useSuspenseQuery<ListCampaignsResponse, ListCampaignsVariables>(
    LIST_CAMPAIGNS,
    {
      variables,
      fetchPolicy: 'network-only',
      skip: capabilities.listingEntityKey
        ? capabilities.listingEntityKey === 'storeId'
          ? !selectedStoreId
          : capabilities.listingEntityKey === 'brandId'
            ? !selectedBrandId
            : !selectedPspId
        : true,
    },
  );

  /* ────── Mutations ────── */
  const [createCampaignMutation, { loading: isCreating }] = useMutation<
    CreateCampaignResponse,
    CreateCampaignVariables
  >(CREATE_CAMPAIGN);

  const [updateCampaignMutation, { loading: isUpdating }] = useMutation<
    UpdateCampaignResponse,
    UpdateCampaignVariables
  >(UPDATE_CAMPAIGN);

  const [archiveCampaignMutation, { loading: isArchiving }] = useMutation<
    ArchiveCampaignResponse,
    ArchiveCampaignVariables
  >(ARCHIVE_CAMPAIGN);

  const [deleteCampaignMutation, { loading: isDeleting }] = useMutation<
    DeleteCampaignResponse,
    DeleteCampaignVariables
  >(DELETE_CAMPAIGN);

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

  /* ── Resets all filters (campaign type + status + isArchived) ── */
  const resetFilters = () => {
    startTransition(() => {
      setFilterState((prev) => ({
        ...prev,
        campaignType: DEFAULT_FILTER_STATE.campaignType,
        status: DEFAULT_FILTER_STATE.status,
        isArchived: DEFAULT_FILTER_STATE.isArchived,
        brandId: DEFAULT_FILTER_STATE.brandId,
        storeId: DEFAULT_FILTER_STATE.storeId,
      }));
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    });
  };

  const updateCampaignType = (campaignType: string) => {
    startTransition(() => {
      setFilterState((prev) => ({ ...prev, campaignType }));
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    });
  };

  const updateStatus = (status: string) => {
    startTransition(() => {
      setFilterState((prev) => ({ ...prev, status }));
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    });
  };

  const updateIsArchived = (isArchived: string) => {
    startTransition(() => {
      setFilterState((prev) => ({ ...prev, isArchived }));
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    });
  };

  const updateBrandId = (brandId: string) => {
    startTransition(() => {
      setFilterState((prev) => ({ ...prev, brandId }));
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    });
  };

  const updateStoreId = (storeId: string) => {
    startTransition(() => {
      setFilterState((prev) => ({ ...prev, storeId }));
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    });
  };

  const refetchCampaigns = () => {
    startTransition(() => {
      refetch({ ...variables }).catch(() => undefined);
    });
  };

  const handleCreateCampaign = async (input: CreateCampaignInput) => {
    await createCampaignMutation({
      variables: { input },
      onCompleted: () => {
        toast.success(t('success.created'));
        refetchCampaigns();
      },
    });
  };

  const handleUpdateCampaign = async (input: UpdateCampaignInput) => {
    await updateCampaignMutation({
      variables: { input },
      onCompleted: () => {
        toast.success(t('success.updated'));
        refetchCampaigns();
      },
    });
  };

  const handleArchiveCampaign = async (campaignId: string, archive: boolean) => {
    await archiveCampaignMutation({
      variables: { input: { id: campaignId, archive } },
      onCompleted: () => {
        toast.success(archive ? t('success.archived') : t('success.unarchived'));
        refetchCampaigns();
      },
    });
  };

  const handleDeleteCampaign = async (campaignId: string) => {
    await deleteCampaignMutation({
      variables: { input: { id: campaignId } },
      onCompleted: () => {
        toast.success(t('success.deleted'));
        refetchCampaigns();
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
    campaignList: data?.listCampaigns?.campaigns ?? [],
    paginationInfo: data?.listCampaigns?.pagination,
    statusCounts: data?.listCampaigns?.statusCounts,

    /* ── table state ── */
    initialFilterState,
    sorting,
    setSorting: handleSortingChange,
    pagination,
    setPagination: handlePaginationChange,

    /* ── filter state ── */
    filterState,
    updateSearch,
    clearSearch,
    updateCampaignType,
    updateStatus,
    updateIsArchived,
    updateBrandId,
    updateStoreId,
    resetFilters,
    ALL_CAMPAIGN_TYPES,
    ALL_STATUSES,
    ALL_BRANDS,
    ALL_STORES,
    capabilities,
    brandsList,
    storesList: data?.listCampaigns?.stores ?? [],

    /* ── loading states ── */
    loading: isPending,
    isCreating,
    isUpdating,
    isArchiving,
    isDeleting,

    /* ── actions ── */
    refetchCampaigns,
    handleCreateCampaign,
    handleUpdateCampaign,
    handleArchiveCampaign,
    handleDeleteCampaign,
  } as const;
}
