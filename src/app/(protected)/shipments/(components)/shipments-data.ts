import { Shipment, ShipmentFilterState, ShipmentPaginationState, ShipmentsStats } from '../shipments.types';

/* ── Mock data matching the Figma design ── */
export const MOCK_SHIPMENTS: Shipment[] = [
  {
    id: '1',
    shipmentNo: 'SH-2026-001',
    campaign: 'Brand Excellence Program',
    storeName: 'Nike Store NYC',
    storeAddress: '123 Main St, Los Angeles, CA 90012',
    shipmentDate: 'Feb 9, 2026',
    trackingNumber: '1Z999AA10123456784',
    carrier: 'UPS',
    status: 'Shipped',
    units: 250,
    promotions: 5,
  },
  {
    id: '2',
    shipmentNo: 'SH-2026-002',
    campaign: 'Spring Collection 2026',
    storeName: 'Nike Store LA',
    storeAddress: '456 5th Ave, New York, NY 10001',
    shipmentDate: 'Feb 9, 2026',
    trackingNumber: '1Z999AA10123456785',
    carrier: 'UPS',
    status: 'Delivered',
    units: 250,
    promotions: 5,
  },
  {
    id: '3',
    shipmentNo: 'SH-2026-003',
    campaign: 'Season Sale',
    storeName: 'Nike Store Chicago',
    storeAddress: '789 Michigan Ave, Chicago, IL 60611',
    shipmentDate: 'Feb 7, 2026',
    trackingNumber: '1Z999AA10123456786',
    carrier: 'FedEx',
    status: 'Shipped',
    units: 250,
    promotions: 5,
  },
  {
    id: '4',
    shipmentNo: 'SH-2026-004',
    campaign: 'Brand Collection',
    storeName: 'Nike Store Boston',
    storeAddress: '321 Boylston St, Boston, MA 02116',
    shipmentDate: 'Feb 11, 2026',
    trackingNumber: '1Z999AA10123456787',
    carrier: 'UPS',
    status: 'Shipped',
    units: 250,
    promotions: 5,
  },
  {
    id: '5',
    shipmentNo: 'SH-2026-005',
    campaign: 'Winter Clearance',
    storeName: 'Nike Store Seattle',
    storeAddress: '555 Market St, San Francisco, CA 94105',
    shipmentDate: 'Feb 8, 2026',
    trackingNumber: '1Z999AA10123456788',
    carrier: 'FedEx',
    status: 'Delivered',
    units: 250,
    promotions: 5,
  },
];

export const MOCK_CAMPAIGNS = [
  ...new Set(MOCK_SHIPMENTS.map((s) => s.campaign)),
];

export const MOCK_STORES = [...new Set(MOCK_SHIPMENTS.map((s) => s.storeName))];

export const STATUS_OPTIONS: { label: string; value: string }[] = [
  { label: 'Shipped', value: 'Shipped' },
  { label: 'Delivered', value: 'Delivered' },
  { label: 'Pending', value: 'Pending' },
  { label: 'In Transit', value: 'In Transit' },
];

export const ALL_CAMPAIGNS = 'ALL_CAMPAIGNS';
export const ALL_STORES = 'ALL_STORES';
export const ALL_STATUSES = 'ALL_STATUSES';

export function filterShipments(
  shipments: Shipment[],
  filters: ShipmentFilterState,
): Shipment[] {
  return shipments.filter((s) => {
    const matchSearch =
      !filters.search ||
      s.shipmentNo.toLowerCase().includes(filters.search.toLowerCase()) ||
      s.campaign.toLowerCase().includes(filters.search.toLowerCase()) ||
      s.storeName.toLowerCase().includes(filters.search.toLowerCase()) ||
      s.trackingNumber.toLowerCase().includes(filters.search.toLowerCase());

    const matchCampaign =
      filters.campaign === ALL_CAMPAIGNS || !filters.campaign || s.campaign === filters.campaign;

    const matchStore =
      filters.store === ALL_STORES || !filters.store || s.storeName === filters.store;

    const matchStatus =
      filters.status === ALL_STATUSES || !filters.status || s.status === filters.status;

    return matchSearch && matchCampaign && matchStore && matchStatus;
  });
}

export function paginateShipments(
  shipments: Shipment[],
  pagination: ShipmentPaginationState,
): Shipment[] {
  const start = pagination.pageIndex * pagination.pageSize;
  return shipments.slice(start, start + pagination.pageSize);
}

export function computeStats(shipments: Shipment[]): ShipmentsStats {
  const totalShipments = shipments.length;
  const delivered = shipments.filter((s) => s.status === 'Delivered').length;
  const totalItemsShipped = shipments.reduce((acc, s) => acc + s.units, 0);
  return { totalShipments, delivered, totalItemsShipped };
}
