import { UserRole } from '@/constant/enums/user.enums';

import { type CapabilitiesMap } from './capabilities';

/**
 * Section-level capabilities for the Shipment Management feature.
 * Controls which UI elements and actions are available per role.
 *
 * Adding a new role variant: add an entry to SHIPMENT_CAPABILITIES_MAP only.
 * No other files need to change.
 */
export interface ShipmentCapabilities {
  // ── Shipment actions ────────────────────────────────────────────────────────
  /** Store Admin and Store Operator can receive a shipment. */
  canReceive: boolean;

  // ── Table / filter visibility ────────────────────────────────────────────────
  /** Show the Store filter in the shipment list. Hidden for roles scoped to a single store. */
  showStoreFilter: boolean;
  /** Show the Store column in the shipment table. Hidden for roles scoped to a single store. */
  showStoreColumn: boolean;
}

// ── Most restrictive defaults — unknown roles get no access ──────────────────

export const DEFAULT_SHIPMENT_CAPABILITIES: ShipmentCapabilities = {
  canReceive: false,
  showStoreFilter: true,
  showStoreColumn: true,
};

// ── Role-specific capabilities ────────────────────────────────────────────────

/** Regional Manager: can receive shipments; scoped to their region so no store filter/column needed. */
const REGIONAL_MANAGER_SHIPMENT_CAPABILITIES: ShipmentCapabilities = {
  canReceive: false,
  showStoreFilter: false,
  showStoreColumn: false,
};

/** Store Admin: can receive shipments; scoped to their store so no store filter/column needed. */
const STORE_ADMIN_SHIPMENT_CAPABILITIES: ShipmentCapabilities = {
  canReceive: true,
  showStoreFilter: false,
  showStoreColumn: false,
};

/** Store Operator: can receive shipments; scoped to their store so no store filter/column needed. */
const STORE_OPERATOR_SHIPMENT_CAPABILITIES: ShipmentCapabilities = {
  canReceive: true,
  showStoreFilter: false,
  showStoreColumn: false,
};

export const SHIPMENT_CAPABILITIES_MAP: CapabilitiesMap<ShipmentCapabilities> = {
  [UserRole.STORE_ADMIN]: STORE_ADMIN_SHIPMENT_CAPABILITIES,
  [UserRole.STORE_OPERATOR]: STORE_OPERATOR_SHIPMENT_CAPABILITIES,
  [UserRole.REGIONAL_MANAGER]: REGIONAL_MANAGER_SHIPMENT_CAPABILITIES,
};
