'use client';

import { ALL_RECORDS_PAGE_SIZE, SortOrder } from '@/constant';
import {
  GET_SHIPMENT_DETAILS,
  GetShipmentDetailsResponse,
  GetShipmentDetailsVariables,
} from '@/graphql';
import { skipToken, useSuspenseQuery } from '@apollo/client/react';
import { useMemo, useState, useTransition } from 'react';

export default function useShipmentDetailsContext(shipmentNumber: number | undefined) {
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.ASC);

  const [isPending, startTransition] = useTransition();

  const variables = useMemo<GetShipmentDetailsVariables | null>(() => {
    if (!shipmentNumber) return null;

    return {
      shipmentNumber,
      itemsPageSize: ALL_RECORDS_PAGE_SIZE,
      itemsSortOrder: sortOrder,
    };
  }, [shipmentNumber, sortOrder]);

  const { data } = useSuspenseQuery<GetShipmentDetailsResponse, GetShipmentDetailsVariables>(
    GET_SHIPMENT_DETAILS,
    variables ? { variables, fetchPolicy: 'network-only' } : skipToken,
  );

  const shipment = data?.getShipmentDetails?.shipment;

  const toggleSortOrder = () => {
    startTransition(() => {
      setSortOrder((prev) => (prev === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC));
    });
  };

  return {
    shipment,
    sortOrder,
    toggleSortOrder,
    isPending,
  } as const;
}
