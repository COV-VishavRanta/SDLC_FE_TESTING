'use client';

import { DEFAULT_PAGE_SIZE, ProtectedRoute } from '@/constant';
import {
  CREATE_SHIPMENT,
  CreateShipmentResponse,
  CreateShipmentVariables,
  GET_CAMPAIGN,
  GET_CAMPAIGN_STORE_ORDER,
  GetCampaignResponse,
  GetCampaignStoreOrderResponse,
  GetCampaignStoreOrderVariables,
  GetCampaignVariables,
} from '@/graphql';
import { useMutation, useQuery } from '@apollo/client/react';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import {
  getOrderShipmentColumns,
  OrderShipmentTableMeta,
} from '../(components)/order-shipment-form/order-shipment-table/order-shipment-columns';
import { createShipmentSchema, ShipmentFormValues } from '../order-shipment.schema';
import { OrderShipmentProviderProps } from './OrderShipmentContext';

type QuantityMap = Record<string, string>;

const MIN_QUANTITY = 0;
const DECIMAL_RADIX = 10;

export function useOrderShipmentClient({
  campaignId,
  orderNumber,
  encodedCampaignId,
  redirectTab,
}: OrderShipmentProviderProps) {
  const t = useTranslations('campaignManagement.createShipment');
  const tValidation = useTranslations('campaignManagement.createShipment.shipmentDetails');
  const router = useRouter();

  const [sorting, setSorting] = useState<SortingState>([{ id: 'promotionName', desc: false }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [quantities, setQuantities] = useState<QuantityMap>({});

  // ── Data Fetching ────────────────────────────────────────────────────────────

  const { data: campaignQueryData, loading: campaignLoading } = useQuery<
    GetCampaignResponse,
    GetCampaignVariables
  >(GET_CAMPAIGN, {
    variables: { campaignId },
    fetchPolicy: 'cache-first',
  });

  const { data: storeOrdersData, loading: storeOrdersLoading } = useQuery<
    GetCampaignStoreOrderResponse,
    GetCampaignStoreOrderVariables
  >(GET_CAMPAIGN_STORE_ORDER, {
    variables: { campaignId, orderNumber },
    fetchPolicy: 'network-only',
  });

  const loading = campaignLoading || storeOrdersLoading;

  const campaignName = campaignQueryData?.campaign?.campaign?.name ?? '';

  const storeData = storeOrdersData?.campaignStoreOrder?.storeOrder;

  const orderItems = useMemo(() => storeData?.orderItems ?? [], [storeData]);
  const storeName = storeData?.storeName ?? '';
  const orderId = orderItems[0]?.orderId ?? '';

  useEffect(() => {
    if (orderItems.length > 0) {
      const initial: QuantityMap = {};
      orderItems.forEach((item) => {
        initial[item.orderItemId] = '0';
      });
      setQuantities(initial);
    }
  }, [orderItems]);

  // ── Form ─────────────────────────────────────────────────────────────────────

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ShipmentFormValues>({
    resolver: zodResolver(createShipmentSchema(tValidation)),
    defaultValues: { trackingNumber: '', eta: '', notes: '', carrierName: '' },
  });

  const hasAnyShipQty = useMemo(
    () => Object.values(quantities).some((q) => Number(q) > 0),
    [quantities],
  );

  const handleQuantityChange = (orderItemId: string, value: string, maxQty: number) => {
    const parsed = parseInt(value, DECIMAL_RADIX);
    const clamped = isNaN(parsed)
      ? MIN_QUANTITY
      : Math.floor(Math.min(Math.max(MIN_QUANTITY, parsed), maxQty));
    setQuantities((prev) => ({ ...prev, [orderItemId]: String(clamped) }));
  };

  const searchQuery = (columnFilters.find((f) => f.id === 'promotionName')?.value as string) ?? '';

  const handleSearch = (value: string) => {
    setColumnFilters(value ? [{ id: 'promotionName', value }] : []);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleClearAll = () => {
    const cleared: QuantityMap = {};
    orderItems.forEach((item) => {
      cleared[item.orderItemId] = '0';
    });
    setQuantities(cleared);
  };

  const hasAnyRemainingQty = useMemo(
    () => orderItems.some((item) => item.remainingQuantity > 0),
    [orderItems],
  );

  // ── Mutation ─────────────────────────────────────────────────────────────────

  const [createShipment] = useMutation<CreateShipmentResponse, CreateShipmentVariables>(
    CREATE_SHIPMENT,
  );

  const onSubmit = async (values: ShipmentFormValues) => {
    const items = orderItems
      .filter((item) => Number(quantities[item.orderItemId] ?? 0) > 0)
      .map((item) => ({
        orderItemId: item.orderItemId,
        quantityToShip: Number(quantities[item.orderItemId]),
      }));

    await createShipment({
      variables: {
        input: {
          orderId,
          trackingNumber: values.trackingNumber,
          eta: values.eta,
          notes: values.notes ?? undefined,
          carrierName: values.carrierName,
          items,
        },
      },
      onCompleted: (data) => {
        if (data?.createShipment?.success) {
          const shipmentNumber = data.createShipment.shipment?.shipmentNumber ?? '';
          toast.success(t('successMessage', { shipmentNumber }));
          router.push(
            `${ProtectedRoute.CAMPAIGN_MANAGEMENT}/${encodedCampaignId}?tab=${redirectTab}`,
          );
        }
      },
    });
  };

  const onShipAllItems = async (values: ShipmentFormValues) => {
    const items = orderItems
      .filter((item) => item.remainingQuantity > 0)
      .map((item) => ({
        orderItemId: item.orderItemId,
        quantityToShip: item.remainingQuantity,
      }));

    await createShipment({
      variables: {
        input: {
          orderId,
          trackingNumber: values.trackingNumber,
          eta: values.eta,
          notes: values.notes ?? undefined,
          carrierName: values.carrierName,
          items,
        },
      },
      onCompleted: (data) => {
        if (data?.createShipment?.success) {
          const shipmentNumber = data.createShipment.shipment?.shipmentNumber ?? '';
          toast.success(t('successMessage', { shipmentNumber }));
          router.push(
            `${ProtectedRoute.CAMPAIGN_MANAGEMENT}/${encodedCampaignId}?tab=${redirectTab}`,
          );
        }
      },
    });
  };

  const handleCancel = () => {
    router.push(`${ProtectedRoute.CAMPAIGN_MANAGEMENT}/${encodedCampaignId}?tab=${redirectTab}`);
  };

  // ── TanStack Table ───────────────────────────────────────────────────────────

  const tTable = useTranslations('campaignManagement.createShipment.pendingShipment');
  const columns = useMemo(() => getOrderShipmentColumns(tTable), [tTable]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: orderItems,
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
      isSubmitting,
    } satisfies OrderShipmentTableMeta,
  });

  const totalCount = table.getFilteredRowModel().rows.length;
  const currentPageRowCount = table.getPaginationRowModel().rows.length;
  const maxPageIndex = totalCount > 0 ? Math.ceil(totalCount / pagination.pageSize) - 1 : 0;
  const safePageIndex = Math.min(pagination.pageIndex, maxPageIndex);
  const effectiveRowsOnPage =
    totalCount === 0
      ? 0
      : currentPageRowCount > 0
        ? currentPageRowCount
        : Math.min(pagination.pageSize, totalCount - safePageIndex * pagination.pageSize);
  const startRow = totalCount === 0 ? 0 : safePageIndex * pagination.pageSize + 1;
  const endRow = totalCount === 0 ? 0 : Math.min(startRow + effectiveRowsOnPage - 1, totalCount);
  const rowsOnPage = totalCount === 0 ? 0 : endRow - startRow + 1;

  return {
    loading,
    campaignName,
    storeName,
    redirectTab,
    table,
    quantities,
    handleClearAll,
    hasAnyShipQty,
    hasAnyRemainingQty,
    onSubmit,
    onShipAll: handleSubmit(onShipAllItems),
    handleCancel,
    encodedCampaignId,
    searchQuery,
    handleSearch,
    startRow,
    endRow,
    totalCount,
    rowsOnPage,

    // form control
    register,
    handleSubmit,
    control,
    errors,
    isSubmitting,
  };
}
