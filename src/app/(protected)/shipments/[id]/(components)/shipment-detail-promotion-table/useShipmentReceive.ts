'use client';

import { DEFAULT_PAGE_SIZE, ShipmentExceptionEnum, ShipmentStatusEnum } from '@/constant';
import {
  GET_SHIPMENT_DETAILS,
  GetShipmentDetailsVariables,
  RECEIVE_SHIPMENT,
  ReceiveShipmentResponse,
  ReceiveShipmentVariables,
  ReorderImageInput,
} from '@/graphql';
import { useCapabilities } from '@/hooks';
import {
  DEFAULT_SHIPMENT_CAPABILITIES,
  SHIPMENT_CAPABILITIES_MAP,
} from '@/lib/permissions/capabilities/shipment.capabilities';
import { useMutation } from '@apollo/client/react';
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
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

import { useShipmentDetails } from '../../context/ShipmentDetailsContext';
import {
  EXCEPTION_CLEAR_SENTINEL,
  getShipmentReceiveColumns,
  ReceiveShipmentTableMeta,
} from './shipment-receive-columns';

const MIN_QUANTITY = 0;
const DECIMAL_RADIX = 10;

export default function useShipmentReceive() {
  const { shipment } = useShipmentDetails();
  const t = useTranslations('shipmentDetails');
  const tColumns = useTranslations('shipmentDetails.receiveTable.columns');

  const { canReceive: canReceiveShipment } = useCapabilities(
    SHIPMENT_CAPABILITIES_MAP,
    DEFAULT_SHIPMENT_CAPABILITIES,
  );
  const canReceive = canReceiveShipment && shipment?.status === ShipmentStatusEnum.SHIPPED;

  const status = shipment?.status;

  const items = useMemo(() => shipment?.items ?? [], [shipment?.items]);

  const initialQtys = useMemo<Record<string, number>>(() => {
    const result: Record<string, number> = {};
    for (const item of items) {
      result[item.shipmentItemId] = MIN_QUANTITY;
    }
    return result;
  }, [items]);

  const initialValidReceivedQtys = useMemo<Record<string, number>>(() => {
    const result: Record<string, number> = {};
    for (const item of items) {
      result[item.shipmentItemId] = item.quantityShipped;
    }
    return result;
  }, [items]);

  const [validReceivedQtys, setValidReceivedQtys] =
    useState<Record<string, number>>(initialValidReceivedQtys);
  const [discrepancyQtys, setDiscrepancyQtys] = useState<Record<string, number>>(initialQtys);
  const [exceptionTypes, setExceptionTypes] = useState<Record<string, ShipmentExceptionEnum>>({});
  console.log('🚀 ~ useShipmentReceive ~ exceptionTypes:', exceptionTypes);
  const [invalidExceptionItems, setInvalidExceptionItems] = useState<Set<string>>(new Set());

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [isExceptionDialogOpen, setIsExceptionDialogOpen] = useState(false);

  const searchQuery = (columnFilters.find((f) => f.id === 'promotionName')?.value as string) ?? '';

  const handleSearch = (value: string) => {
    setColumnFilters(value ? [{ id: 'promotionName', value }] : []);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const hasAnyDiscrepancy = useMemo(
    () => Object.values(discrepancyQtys).some((v) => v > MIN_QUANTITY),
    [discrepancyQtys],
  );

  const handleValidReceivedChange = (itemId: string, rawValue: string) => {
    const item = items.find((i) => i.shipmentItemId === itemId);
    if (!item) return;
    const parsed = parseInt(rawValue, DECIMAL_RADIX);
    const clamped = isNaN(parsed)
      ? MIN_QUANTITY
      : Math.max(MIN_QUANTITY, Math.min(Math.floor(parsed), item.quantityShipped));
    setValidReceivedQtys((prev) => ({ ...prev, [itemId]: clamped }));
    setDiscrepancyQtys((prev) => ({
      ...prev,
      [itemId]: Math.max(MIN_QUANTITY, item.quantityShipped - clamped),
    }));
  };

  const handleDiscrepancyChange = (itemId: string, rawValue: string) => {
    const item = items.find((i) => i.shipmentItemId === itemId);
    if (!item) return;
    const parsed = parseInt(rawValue, DECIMAL_RADIX);
    const clamped = isNaN(parsed)
      ? MIN_QUANTITY
      : Math.max(MIN_QUANTITY, Math.min(Math.floor(parsed), item.quantityShipped));
    setDiscrepancyQtys((prev) => ({ ...prev, [itemId]: clamped }));
    setValidReceivedQtys((prev) => ({
      ...prev,
      [itemId]: Math.max(MIN_QUANTITY, item.quantityShipped - clamped),
    }));
  };

  const handleExceptionTypeChange = (itemId: string, value: string | null) => {
    console.log('🚀 ~ handleExceptionTypeChange ~ value:', value, itemId);
    if (value === EXCEPTION_CLEAR_SENTINEL) {
      setExceptionTypes(
        (prev) =>
          Object.fromEntries(Object.entries(prev).filter(([k]) => k !== itemId)) as Record<
            string,
            ShipmentExceptionEnum
          >,
      );
      setValidReceivedQtys((prev) => ({ ...prev, [itemId]: MIN_QUANTITY }));
      setDiscrepancyQtys((prev) => ({ ...prev, [itemId]: MIN_QUANTITY }));
      setInvalidExceptionItems((prev) => {
        if (!prev.has(itemId)) return prev;
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
      return;
    }
    setExceptionTypes((prev) => ({ ...prev, [itemId]: value as ShipmentExceptionEnum }));
    setInvalidExceptionItems((prev) => {
      if (!prev.has(itemId)) return prev;
      const next = new Set(prev);
      next.delete(itemId);
      return next;
    });
  };

  const handleClearAll = () => {
    const cleared: Record<string, number> = {};
    for (const id of Object.keys(validReceivedQtys)) {
      cleared[id] = MIN_QUANTITY;
    }
    setValidReceivedQtys(cleared);
    setDiscrepancyQtys(cleared);
  };

  const refetchVariables = useMemo<GetShipmentDetailsVariables | null>(() => {
    if (!shipment?.shipmentNumber) return null;
    return { shipmentNumber: shipment.shipmentNumber };
  }, [shipment?.shipmentNumber]);

  const [receiveShipment, { loading: receiving }] = useMutation<
    ReceiveShipmentResponse,
    ReceiveShipmentVariables
  >(RECEIVE_SHIPMENT, {
    refetchQueries: refetchVariables
      ? [{ query: GET_SHIPMENT_DETAILS, variables: refetchVariables }]
      : [],
    awaitRefetchQueries: true,
  });

  const handleReceiveAll = async () => {
    if (!shipment?.id) return;
    try {
      const { data } = await receiveShipment({
        variables: {
          input: {
            shipmentId: shipment.id,
            items: items.map((item) => ({
              shipmentItemId: item.shipmentItemId,
              quantityReceived: item.quantityShipped,
              discrepancyQuantity: MIN_QUANTITY,
            })),
          },
        },
      });
      if (data?.receiveShipment.success) {
        toast.success(t('receiveTable.receiveAllSuccess'));
      } else {
        toast.error(data?.receiveShipment.message ?? t('receiveTable.receiveFailed'));
      }
    } catch {
      toast.error(t('receiveTable.receiveFailed'));
    }
  };

  const allRowsFilled = useMemo(
    () =>
      items.every(
        (item) =>
          (validReceivedQtys[item.shipmentItemId] ?? MIN_QUANTITY) +
            (discrepancyQtys[item.shipmentItemId] ?? MIN_QUANTITY) ===
          item.quantityShipped,
      ),
    [items, validReceivedQtys, discrepancyQtys],
  );

  const openExceptionDialog = () => {
    const missing = new Set(
      items
        .filter(
          (item) =>
            (discrepancyQtys[item.shipmentItemId] ?? MIN_QUANTITY) > MIN_QUANTITY &&
            !exceptionTypes[item.shipmentItemId],
        )
        .map((item) => item.shipmentItemId),
    );
    if (missing.size > 0) {
      setInvalidExceptionItems(missing);
      toast.error(t('receiveTable.exceptionTypeRequired'));
      return;
    }
    setIsExceptionDialogOpen(true);
  };

  const closeExceptionDialog = () => {
    setIsExceptionDialogOpen(false);
  };

  const submitException = async (reason: string, images: ReorderImageInput[]) => {
    if (!shipment?.id) return;
    const { data } = await receiveShipment({
      variables: {
        input: {
          shipmentId: shipment.id,
          reason,
          images,
          items: items.map((item) => {
            const discrepancy = discrepancyQtys[item.shipmentItemId] ?? MIN_QUANTITY;
            return {
              shipmentItemId: item.shipmentItemId,
              quantityReceived: validReceivedQtys[item.shipmentItemId] ?? MIN_QUANTITY,
              ...(discrepancy > MIN_QUANTITY
                ? {
                    discrepancyQuantity: discrepancy,
                    exceptionType:
                      exceptionTypes[item.shipmentItemId] ?? ShipmentExceptionEnum.DAMAGED,
                  }
                : {}),
            };
          }),
        },
      },
    });
    if (data?.receiveShipment.success) {
      toast.success(t('receiveTable.raiseExceptionSuccess'));
    } else {
      toast.error(data?.receiveShipment.message ?? t('receiveTable.receiveFailed'));
      throw new Error(data?.receiveShipment.message ?? t('receiveTable.receiveFailed'));
    }
  };

  const columns = useMemo(() => getShipmentReceiveColumns(tColumns), [tColumns]);

  const isMountedRef = useRef(false);
  useEffect(() => {
    if (isMountedRef.current) {
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }
    isMountedRef.current = true;
  }, [items]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: false,
    state: { sorting, columnFilters, pagination },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    meta: {
      validReceivedQtys,
      discrepancyQtys,
      exceptionTypes,
      invalidExceptionItems,
      onValidReceivedChange: handleValidReceivedChange,
      onDiscrepancyChange: handleDiscrepancyChange,
      onExceptionTypeChange: handleExceptionTypeChange,
      disabled: receiving,
      isReadOnly: !canReceive,
      status,
    } satisfies ReceiveShipmentTableMeta,
  });

  const totalCount = table.getFilteredRowModel().rows.length;
  const lastPageIndex =
    totalCount > 0 ? Math.ceil(totalCount / pagination.pageSize) - 1 : MIN_QUANTITY;
  const safePageIndex = Math.min(pagination.pageIndex, lastPageIndex);
  const startRow = totalCount > 0 ? safePageIndex * pagination.pageSize + 1 : MIN_QUANTITY;
  const endRow =
    totalCount > 0 ? Math.min((safePageIndex + 1) * pagination.pageSize, totalCount) : MIN_QUANTITY;
  const rowsOnPage = totalCount === 0 ? MIN_QUANTITY : endRow - startRow + 1;

  return {
    table,
    columns,
    items,
    totalPromotions: shipment?.totalPromotions ?? 0,
    hasAnyDiscrepancy,
    allRowsFilled,
    receiving,
    canReceive,
    handleReceiveAll,
    handleClearAll,
    isExceptionDialogOpen,
    openExceptionDialog,
    closeExceptionDialog,
    submitException,
    shipmentId: shipment?.id ?? '',
    searchQuery,
    handleSearch,
    startRow,
    endRow,
    totalCount,
    rowsOnPage,
    t,
  } as const;
}
