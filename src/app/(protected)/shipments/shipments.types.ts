export type ShipmentStatus = 'Shipped' | 'Delivered' | 'Pending' | 'In Transit';

export interface Shipment {
  id: string;
  shipmentNo: string;
  campaign: string;
  storeName: string;
  storeAddress: string;
  shipmentDate: string;
  trackingNumber: string;
  carrier: string;
  status: ShipmentStatus;
  units: number;
  promotions: number;
}

export interface ShipmentFilterState {
  search: string;
  campaign: string;
  store: string;
  status: string;
}

export interface ShipmentPaginationState {
  pageIndex: number;
  pageSize: number;
}

export interface ShipmentsStats {
  totalShipments: number;
  delivered: number;
  totalItemsShipped: number;
}
