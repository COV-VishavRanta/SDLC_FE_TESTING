import { UserRole } from '@/constant/enums/user.enums';

import { type CapabilitiesMap } from './capabilities';

/**
 * Section-level capabilities for the Inventory Management feature.
 * Controls which UI elements and actions are available per role.
 *
 * Adding a new role variant: add an entry to INVENTORY_CAPABILITIES_MAP only.
 * No other files need to change.
 */
export interface InventoryCapabilities {
  // ── Inventory actions ───────────────────────────────────────────────────────
  canCreateInventory: boolean;
  /**
   * Grants access to inventory editing in general and is the top-level gate for
   * showing edit UI/actions.
   */
  canEditInventory: boolean;
  /**
   * Restricts edit access to the Available Quantity field only. When true,
   * canEditInventory should also be true because the user can still access the
   * edit flow, but only in this limited mode.
   */
  canEditQuantityOnly: boolean;
  canDeleteInventory: boolean;
  canViewInventory: boolean;
}

// ── Most restrictive defaults — unknown roles get no access ──────────────────

export const DEFAULT_INVENTORY_CAPABILITIES: InventoryCapabilities = {
  canCreateInventory: false,
  canEditInventory: false,
  canEditQuantityOnly: false,
  canDeleteInventory: false,
  canViewInventory: false,
};

// ── Role-specific capabilities ───────────────────────────────────────────────

const PSP_ADMIN_INVENTORY_CAPABILITIES: InventoryCapabilities = {
  canCreateInventory: true,
  canEditInventory: true,
  canEditQuantityOnly: false,
  canDeleteInventory: true,
  canViewInventory: true,
};

const PRODUCTION_OPERATOR_INVENTORY_CAPABILITIES: InventoryCapabilities = {
  canCreateInventory: false,
  canEditInventory: true,
  canEditQuantityOnly: true,
  canDeleteInventory: false,
  canViewInventory: true,
};

export const INVENTORY_CAPABILITIES_MAP: CapabilitiesMap<InventoryCapabilities> = {
  [UserRole.PSP_ADMIN]: PSP_ADMIN_INVENTORY_CAPABILITIES,
  [UserRole.PRODUCTION_OPERATOR]: PRODUCTION_OPERATOR_INVENTORY_CAPABILITIES,
};
