'use client';

import { createContext, useContext } from 'react';

import useShipmentDetailsContext from './useShipmentDetailsContext';

export const ShipmentDetailsContext = createContext(
  {} as ReturnType<typeof useShipmentDetailsContext>,
);

export function ShipmentDetailsProvider({
  shipmentNumber,
  children,
}: {
  shipmentNumber: number;
  children: React.ReactNode;
}) {
  const contextValue = useShipmentDetailsContext(shipmentNumber);

  return (
    <ShipmentDetailsContext.Provider value={contextValue}>
      {children}
    </ShipmentDetailsContext.Provider>
  );
}

export function useShipmentDetails() {
  return useContext(ShipmentDetailsContext);
}
