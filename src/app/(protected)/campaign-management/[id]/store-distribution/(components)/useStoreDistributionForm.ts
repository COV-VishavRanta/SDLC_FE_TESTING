import { DEFAULT_PAGE_SIZE, ProtectedRoute } from '@/constant';
import { useGlobalProtected } from '@/contexts';
import {
  DISTRIBUTE_PROMOTIONS_TO_STORES,
  DistributePromotionsToStoresResponse,
  DistributePromotionsToStoresVariables,
  GET_CAMPAIGN,
  GET_STORE_DISTRIBUTION_BY_PROMOTION,
  GET_STORES_BY_BRAND,
  GetCampaignResponse,
  GetCampaignVariables,
  GetStoreDistributionByPromotionResponse,
  GetStoreDistributionByPromotionVariables,
  GetStoresByBrandResponse,
  GetStoresByBrandVariables,
} from '@/graphql';
import { skipToken, useMutation, useSuspenseQuery } from '@apollo/client/react';
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  getStoreDistributionColumns,
  StoreDistributionTableMeta,
} from './store-distribution-columns';
import { StoreDistributionFormProps } from './store-distribution-form';

const MIN_QUANTITY = 0;
const DECIMAL_RADIX = 10;

export default function useStoreDistributionForm({
  campaignId,
  promotionId,
  encodedCampaignId,
}: StoreDistributionFormProps) {
  const router = useRouter();
  const t = useTranslations('campaignManagement.storeDistribution');

  // 1. Get brandId from campaign
  const { data: campaignData } = useSuspenseQuery<GetCampaignResponse, GetCampaignVariables>(
    GET_CAMPAIGN,
    { variables: { campaignId } },
  );
  const { selectedBrandId } = useGlobalProtected();
  const promotionName = campaignData?.campaign?.campaign?.name ?? '';

  // 2. Get full store list for this brand
  const { data: storesData } = useSuspenseQuery<
    GetStoresByBrandResponse,
    GetStoresByBrandVariables
  >(GET_STORES_BY_BRAND, selectedBrandId ? { variables: { brandId: selectedBrandId } } : skipToken);

  // 3. Get existing distribution values (for pre-fill on edit)
  const { data: distributionData } = useSuspenseQuery<
    GetStoreDistributionByPromotionResponse,
    GetStoreDistributionByPromotionVariables
  >(GET_STORE_DISTRIBUTION_BY_PROMOTION, { variables: { promotionId } });

  const storesList = storesData?.getStoresByBrand?.stores;
  const stores = useMemo(() => storesList ?? [], [storesList]);
  const distribution = distributionData?.storeDistributionByPromotion;

  // Build lookups from existing distribution
  const { distributionMap, orderItemMap } = useMemo(() => {
    const qty: Record<string, number> = {};
    const order: Record<string, string> = {};
    for (const item of distribution?.items ?? []) {
      qty[item.storeId] = item.assignedQuantity;
      order[item.storeId] = item.orderItemId;
    }
    return { distributionMap: qty, orderItemMap: order };
  }, [distribution?.items]);

  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    for (const store of stores) {
      initial[store.id] = distributionMap[store.id] ?? MIN_QUANTITY;
    }
    return initial;
  });

  // ── TanStack Table state ──
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const handleQuantityChange = (storeId: string, rawValue: string) => {
    const parsed = parseInt(rawValue, DECIMAL_RADIX);
    const value = isNaN(parsed) ? MIN_QUANTITY : Math.max(MIN_QUANTITY, Math.floor(parsed));
    setQuantities((prev) => ({ ...prev, [storeId]: value }));
  };

  const handleClearAll = () => {
    setQuantities((prev) => {
      const cleared: Record<string, number> = {};
      for (const id of Object.keys(prev)) {
        cleared[id] = MIN_QUANTITY;
      }
      return cleared;
    });
  };

  const searchQuery = (columnFilters.find((f) => f.id === 'name')?.value as string) ?? '';

  const handleSearch = (value: string) => {
    setColumnFilters(value ? [{ id: 'name', value }] : []);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const [distributePromotions, { loading: saving }] = useMutation<
    DistributePromotionsToStoresResponse,
    DistributePromotionsToStoresVariables
  >(DISTRIBUTE_PROMOTIONS_TO_STORES);

  const tColumns = useTranslations('campaignManagement.storeDistribution.columns');
  const columns = useMemo(() => getStoreDistributionColumns(tColumns), [tColumns]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: stores,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: true,
    state: { sorting, columnFilters, pagination },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    meta: {
      quantities,
      onQuantityChange: handleQuantityChange,
      disabled: saving,
    } satisfies StoreDistributionTableMeta,
  });

  const totalCount = table.getFilteredRowModel().rows.length;
  const startRow = totalCount > 0 ? pagination.pageIndex * pagination.pageSize + 1 : 0;
  const endRow = Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalCount);
  const rowsOnPage = endRow - startRow + 1;

  // Total quantity is over ALL stores (not just the current page)
  const totalQuantity = useMemo(
    () => Object.values(quantities).reduce((sum, qty) => sum + qty, MIN_QUANTITY),
    [quantities],
  );

  const handleSave = async () => {
    // Build distributions based on changed values only
    const distributions = stores
      .filter((store) => {
        const current = quantities[store.id] ?? MIN_QUANTITY;

        // if value is not changed return false

        if (current === distributionMap[store.id]) return false;

        // Always send stores with quantity > 0
        if (current > MIN_QUANTITY) return true;

        // quantity === 0: only include if it changed from a non-zero value
        // and an orderItemId exists (to zero out the existing order)
        const original = distributionMap[store.id] ?? MIN_QUANTITY;
        return original > MIN_QUANTITY && !!orderItemMap[store.id];
      })
      .map((store) => ({
        storeId: store.id,
        quantity: quantities[store.id] ?? MIN_QUANTITY,
        ...(orderItemMap[store.id] ? { orderItemId: orderItemMap[store.id] } : {}),
      }));

    if (distributions.length === 0) {
      toast.info(t('noChanges'));
      return;
    }

    try {
      const { data: result } = await distributePromotions({
        variables: { input: { promotionId, distributions } },
      });

      if (result?.distributePromotionsToStores.success) {
        toast.success(t('saveSuccess'));
        router.push(`${ProtectedRoute.CAMPAIGN_MANAGEMENT}/${encodedCampaignId}`);
      } else {
        toast.error(result?.distributePromotionsToStores.message ?? t('saveFailed'));
      }
    } catch {
      toast.error(t('saveFailed'));
    }
  };

  const campaignStatus = campaignData?.campaign?.campaign?.status;
  return {
    // data
    distribution,
    promotionName,
    totalQuantity,
    campaignStatus,
    searchQuery,
    saving,

    // table
    table,
    columns,
    startRow,
    endRow,
    totalCount,
    rowsOnPage,

    // actions
    handleSearch,
    handleClearAll,
    handleSave,

    // translations
    t,
  };
}
