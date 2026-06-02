import { UserRole } from '@/constant/enums/user.enums';

import { type CapabilitiesMap } from './capabilities';

/**
 * Section-level capabilities for the Exception Request feature.
 * Controls which UI elements and actions are available per role.
 *
 * Adding a new role variant: add an entry to EXCEPTION_REQUEST_CAPABILITIES_MAP only.
 * No other files need to change.
 */
export interface ExceptionRequestCapabilities {
  // ── Listing page ────────────────────────────────────────────────────────────
  /** Show the "Store" column in the exception request listing table. */
  showStoreColumn: boolean;

  // ── Detail page – header buttons ────────────────────────────────────────────
  /** Store Admin can re-upload photos when a request is REJECTED. */
  canReUploadPhotos: boolean;
  /** Brand Admin can approve a pending exception request. */
  canApproveRequest: boolean;
  /** Brand Admin can reject a pending exception request. */
  canRejectRequest: boolean;
  /** Brand Admin can cancel an exception request. */
  canCancelRequest: boolean;

  // ── Detail page – promotion table ───────────────────────────────────────────
  /** Brand Admin can view uploaded evidence photos. */
  canViewPhotos: boolean;
}

// ── Most restrictive defaults — unknown roles get no access ──────────────────

export const DEFAULT_EXCEPTION_REQUEST_CAPABILITIES: ExceptionRequestCapabilities = {
  showStoreColumn: false,
  canReUploadPhotos: false,
  canApproveRequest: false,
  canRejectRequest: false,
  canCancelRequest: false,
  canViewPhotos: false,
};

// ── Role-specific capabilities ────────────────────────────────────────────────

/** Brand Admin: can approve / reject / cancel requests and view photos */
const BRAND_ADMIN_EXCEPTION_REQUEST_CAPABILITIES: ExceptionRequestCapabilities = {
  showStoreColumn: true,
  canReUploadPhotos: false,
  canApproveRequest: true,
  canRejectRequest: true,
  canCancelRequest: true,
  canViewPhotos: true,
};

/** Campaign Manager assigned to the exception request's campaign: full action access. */
const CAMPAIGN_MANAGER_ASSIGNED_CAPABILITIES: ExceptionRequestCapabilities = {
  showStoreColumn: true,
  canReUploadPhotos: false,
  canApproveRequest: true,
  canRejectRequest: true,
  canCancelRequest: true,
  canViewPhotos: true,
};

/** Campaign Manager NOT assigned to the exception request's campaign: view-only. */
export const EXCEPTION_REQUEST_CAMPAIGN_MANAGER_UNASSIGNED_CAPABILITIES: ExceptionRequestCapabilities =
  {
    showStoreColumn: true,
    canReUploadPhotos: false,
    canApproveRequest: false,
    canRejectRequest: false,
    canCancelRequest: false,
    canViewPhotos: true,
  };

/** Store Admin: can re-upload photos on rejected requests; store column hidden (it's their own store) */
const STORE_ADMIN_EXCEPTION_REQUEST_CAPABILITIES: ExceptionRequestCapabilities = {
  showStoreColumn: false,
  canReUploadPhotos: true,
  canApproveRequest: true,
  canRejectRequest: true,
  canCancelRequest: true,
  canViewPhotos: true,
};

/** Store Operator: can re-upload photos on rejected requests; store column hidden (it's their own store) */
const STORE_OPERATOR_EXCEPTION_REQUEST_CAPABILITIES: ExceptionRequestCapabilities = {
  showStoreColumn: false,
  canReUploadPhotos: true,
  canApproveRequest: false,
  canRejectRequest: false,
  canCancelRequest: false,
  canViewPhotos: true,
};
/** Regional Manager: can view photos; store column hidden (it's their own store) */
const REGIONAL_MANAGER_EXCEPTION_REQUEST_CAPABILITIES: ExceptionRequestCapabilities = {
  showStoreColumn: false,
  canReUploadPhotos: false,
  canApproveRequest: false,
  canRejectRequest: false,
  canCancelRequest: false,
  canViewPhotos: true,
};

export const EXCEPTION_REQUEST_CAPABILITIES_MAP: CapabilitiesMap<ExceptionRequestCapabilities> = {
  [UserRole.BRAND_ADMIN]: BRAND_ADMIN_EXCEPTION_REQUEST_CAPABILITIES,
  [UserRole.STORE_ADMIN]: STORE_ADMIN_EXCEPTION_REQUEST_CAPABILITIES,
  [UserRole.STORE_OPERATOR]: STORE_OPERATOR_EXCEPTION_REQUEST_CAPABILITIES,
  [UserRole.CAMPAIGN_MANAGER]: CAMPAIGN_MANAGER_ASSIGNED_CAPABILITIES,
  [UserRole.REGIONAL_MANAGER]: REGIONAL_MANAGER_EXCEPTION_REQUEST_CAPABILITIES,
};
