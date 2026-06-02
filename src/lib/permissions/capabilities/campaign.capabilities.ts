import {
  BRAND_VIEW_ORDER_TAB_CAMPAIGN_STATUSES,
  CampaignStatusEnum,
  PSP_VIEW_ORDER_TAB_CAMPAIGN_STATUSES,
  STORE_VIEW_ORDER_TAB_CAMPAIGN_STATUSES,
} from '@/constant/enums/campaign.enums';
import { UserRole } from '@/constant/enums/user.enums';

import { type CapabilitiesMap } from './capabilities';

/**
 * Section-level capabilities for the Campaign Management feature.
 * Controls which UI elements and actions are available per role.
 *
 * Adding a new role variant: add an entry to CAMPAIGN_CAPABILITIES_MAP only.
 * No other files need to change.
 */
export interface CampaignCapabilities {
  // ── Campaign-level actions ──────────────────────────────────────────────────
  canCreateCampaign: boolean;
  canEditCampaign: boolean;
  canDeleteCampaign: boolean;
  canArchiveCampaign: boolean;
  canSubmitToPsp: boolean;
  /** Brand Admin can mark an active campaign as On Hold. */
  canMarkOnHold: boolean;
  /** Brand Admin can mark a received campaign as Complete. */
  canMarkComplete: boolean;
  /** PSP Admin "Edit Status" placeholder button on detail header. */
  canEditStatus: boolean;

  // ── Promotion-level actions ─────────────────────────────────────────────────
  canImportPromotions: boolean;
  canReusePromotions: boolean;
  canAddPromotions: boolean;

  canViewPromotions: boolean;
  canEditPromotions: boolean;
  canDeletePromotions: boolean;
  canDuplicatePromotions: boolean;
  canDistributeToStores: boolean;

  // ── Orders tab ──────────────────────────────────────────────────────────────
  /** Campaign statuses for which the Orders tab is visible to this role. */
  orderTabStatuses: Set<CampaignStatusEnum>;
  canShipOrders: boolean;
  /** Store Admin / Store Operator can upload installation proof photos for received orders. */
  canSubmitInstallationProof: boolean;
  /** Brand Admin can approve or reject installation proofs submitted by stores. */
  canReviewInstallationProof: boolean;

  // ── Navigation ──────────────────────────────────────────────────────────────
  /** Allows access to import-promotions, promotions-reuse, store-distribution, ship-orders sub-pages. */
  canAccessImportPromotionsPage: boolean;
  canAccessPromotionsReusePage: boolean;
  canAccessStoreDistributionPage: boolean;
  canAccessShipOrdersPage: boolean;
  /** Brand Admin can navigate to the installation proof verification detail page. */
  canAccessVerifyInstallationProofPage: boolean;

  // ── Listing page configuration ──────────────────────────────────────────────
  /** Primary entity key used to resolve LIST_CAMPAIGNS variables. */
  listingEntityKey: 'brandId' | 'pspId' | 'storeId' | '';
  /** Show brand filter dropdown (PSP Admin only). */
  showBrandFilter: boolean;
  /** Show "Brand" column in campaign table. */
  showBrandColumn: boolean;
  /** Show "Quantity" (totalQuantity) column in campaign table. */
  showQuantityColumn: boolean;
  /** Show "Stores" (storeCount) column in campaign table. */
  showStoreColumn: boolean;
  /** Show "Promotions" (promotionCount) column in campaign table. */
  showPromotionsColumn: boolean;
  /** Show "Archived" filter dropdown. */
  showArchiveFilter: boolean;
  /** Show DRAFT option in status filter dropdown (hidden for PSP Admin). */
  showDraftStatusFilter: boolean;
  /** Show store filter dropdown (Brand Admin + Campaign Manager only). */
  showStoreFilter: boolean;
  /** Show "Actions" column in campaign table. */
  showActionsColumn: boolean;

  // ── Campaign Manager-specific ───────────────────────────────────────────────
  /** Campaign Manager can assign themselves to an unassigned campaign. */
  canAssignSelfToCampaign: boolean;
  /** Campaign Manager can only edit campaigns they are assigned to. */
  canEditOwnCampaignsOnly: boolean;
  /** Hide the Campaign Manager dropdown in the dialog and auto-fill with the current user. */
  hideCampaignManagerField: boolean;

  // ── Installation proof-specific ───────────────────────────────────────────────
  /** Store Admin / Store Operator can upload installation proof photos for received orders. */
  canUploadInstallationProof: boolean;
  /** All users can view installation proof photos. */
  canViewInstallationProof: boolean;
  /** All users can view installation proof rejection reasons. */
  canViewInstallationRejectionReason: boolean;
}

// ── Most restrictive defaults — unknown roles get no access ──────────────────

export const DEFAULT_CAMPAIGN_CAPABILITIES: CampaignCapabilities = {
  canCreateCampaign: false,
  canEditCampaign: false,
  canDeleteCampaign: false,
  canArchiveCampaign: false,
  canSubmitToPsp: false,
  canMarkOnHold: false,
  canMarkComplete: false,
  canEditStatus: false,

  canImportPromotions: false,
  canReusePromotions: false,
  canAddPromotions: false,
  canViewPromotions: false,
  canEditPromotions: false,
  canDeletePromotions: false,
  canDuplicatePromotions: false,
  canDistributeToStores: false,
  orderTabStatuses: new Set<CampaignStatusEnum>(),
  canShipOrders: false,
  canSubmitInstallationProof: false,
  canReviewInstallationProof: false,

  canAccessImportPromotionsPage: false,
  canAccessPromotionsReusePage: false,
  canAccessStoreDistributionPage: false,
  canAccessShipOrdersPage: false,
  canAccessVerifyInstallationProofPage: false,
  listingEntityKey: '',
  showBrandFilter: false,
  showBrandColumn: false,
  showQuantityColumn: false,
  showStoreColumn: false,
  showPromotionsColumn: false,
  showArchiveFilter: false,
  showDraftStatusFilter: false,
  showStoreFilter: false,
  showActionsColumn: false,

  canAssignSelfToCampaign: false,
  canEditOwnCampaignsOnly: false,
  hideCampaignManagerField: false,

  canUploadInstallationProof: false,
  canViewInstallationProof: true,
  canViewInstallationRejectionReason: true,
};

// ── Role-specific capabilities ───────────────────────────────────────────────

// PSP USERS (PSP Admin + Production Operator)

const PSP_ADMIN_CAMPAIGN_CAPABILITIES: CampaignCapabilities = {
  canCreateCampaign: false,
  canEditCampaign: false,
  canDeleteCampaign: false,
  canArchiveCampaign: false,
  canSubmitToPsp: false,
  canMarkOnHold: false,
  canMarkComplete: false,
  canEditStatus: true,

  canImportPromotions: false,
  canReusePromotions: false,
  canAddPromotions: false,
  canViewPromotions: true,
  canEditPromotions: false,
  canDeletePromotions: false,
  canDuplicatePromotions: false,
  canDistributeToStores: false,
  orderTabStatuses: PSP_VIEW_ORDER_TAB_CAMPAIGN_STATUSES,
  canShipOrders: true,
  canSubmitInstallationProof: false,
  canReviewInstallationProof: false,

  canAccessImportPromotionsPage: false,
  canAccessPromotionsReusePage: false,
  canAccessStoreDistributionPage: false,

  canAccessShipOrdersPage: true,
  canAccessVerifyInstallationProofPage: false,
  listingEntityKey: 'pspId',
  showBrandFilter: true,
  showBrandColumn: true,
  showQuantityColumn: true,
  showStoreColumn: false,
  showPromotionsColumn: false,
  showArchiveFilter: false,
  showDraftStatusFilter: false,
  showStoreFilter: false,
  showActionsColumn: true,

  canAssignSelfToCampaign: false,
  canEditOwnCampaignsOnly: false,
  hideCampaignManagerField: false,

  canUploadInstallationProof: false,
  canViewInstallationProof: true,
  canViewInstallationRejectionReason: true,
};

const PRODUCTION_OPERATOR_CAMPAIGN_CAPABILITIES: CampaignCapabilities = {
  canCreateCampaign: false,
  canEditCampaign: false,
  canDeleteCampaign: false,
  canArchiveCampaign: false,
  canSubmitToPsp: false,
  canMarkOnHold: false,
  canMarkComplete: false,
  canEditStatus: true,

  canImportPromotions: false,
  canReusePromotions: false,
  canAddPromotions: false,
  canViewPromotions: true,
  canEditPromotions: false,
  canDeletePromotions: false,
  canDuplicatePromotions: false,
  canDistributeToStores: false,
  orderTabStatuses: PSP_VIEW_ORDER_TAB_CAMPAIGN_STATUSES,
  canShipOrders: true,
  canSubmitInstallationProof: false,
  canReviewInstallationProof: false,

  canAccessImportPromotionsPage: false,
  canAccessPromotionsReusePage: false,
  canAccessStoreDistributionPage: false,

  canAccessShipOrdersPage: true,
  canAccessVerifyInstallationProofPage: false,
  listingEntityKey: 'pspId',
  showBrandFilter: true,
  showBrandColumn: true,
  showQuantityColumn: true,
  showStoreColumn: false,
  showPromotionsColumn: false,
  showArchiveFilter: false,
  showDraftStatusFilter: false,
  showStoreFilter: false,
  showActionsColumn: true,

  canAssignSelfToCampaign: false,
  canEditOwnCampaignsOnly: false,
  hideCampaignManagerField: false,

  canUploadInstallationProof: false,
  canViewInstallationProof: true,
  canViewInstallationRejectionReason: true,
};

// BRAND USERS (Brand Admin + Campaign Manager)
const BRAND_ADMIN_CAMPAIGN_CAPABILITIES: CampaignCapabilities = {
  canCreateCampaign: true,
  canEditCampaign: true,
  canDeleteCampaign: true,
  canArchiveCampaign: true,
  canSubmitToPsp: true,
  canMarkOnHold: true,
  canMarkComplete: true,
  canEditStatus: false,

  canImportPromotions: true,
  canReusePromotions: true,
  canAddPromotions: true,
  canViewPromotions: true,
  canEditPromotions: true,
  canDeletePromotions: true,
  canDuplicatePromotions: true,
  canDistributeToStores: true,
  orderTabStatuses: BRAND_VIEW_ORDER_TAB_CAMPAIGN_STATUSES,
  canShipOrders: false,
  canSubmitInstallationProof: false,
  canReviewInstallationProof: true,

  canAccessImportPromotionsPage: true,
  canAccessPromotionsReusePage: true,
  canAccessStoreDistributionPage: true,
  canAccessShipOrdersPage: false,
  canAccessVerifyInstallationProofPage: true,
  listingEntityKey: 'brandId',
  showBrandFilter: false,
  showBrandColumn: false,
  showQuantityColumn: false,
  showStoreColumn: true,
  showPromotionsColumn: true,
  showArchiveFilter: true,
  showDraftStatusFilter: true,
  showStoreFilter: true,
  showActionsColumn: true,

  canAssignSelfToCampaign: false,
  canEditOwnCampaignsOnly: false,
  hideCampaignManagerField: false,

  canUploadInstallationProof: false,
  canViewInstallationProof: true,
  canViewInstallationRejectionReason: true,
};

const CAMPAIGN_MANAGER_CAMPAIGN_CAPABILITIES: CampaignCapabilities = {
  canCreateCampaign: true,
  canEditCampaign: true,
  canDeleteCampaign: true,
  canArchiveCampaign: true,
  canSubmitToPsp: true,
  canMarkOnHold: true,
  canMarkComplete: true,
  canEditStatus: false,

  canImportPromotions: true,
  canReusePromotions: true,
  canAddPromotions: true,
  canViewPromotions: true,
  canEditPromotions: true,
  canDeletePromotions: true,
  canDuplicatePromotions: true,
  canDistributeToStores: true,
  orderTabStatuses: BRAND_VIEW_ORDER_TAB_CAMPAIGN_STATUSES,
  canShipOrders: false,
  canSubmitInstallationProof: false,
  canReviewInstallationProof: true,

  canAccessImportPromotionsPage: true,
  canAccessPromotionsReusePage: true,
  canAccessStoreDistributionPage: true,
  canAccessShipOrdersPage: false,
  canAccessVerifyInstallationProofPage: true,
  listingEntityKey: 'brandId',
  showBrandFilter: false,
  showBrandColumn: false,
  showQuantityColumn: false,
  showStoreColumn: true,
  showPromotionsColumn: true,
  showArchiveFilter: true,
  showDraftStatusFilter: true,
  showStoreFilter: true,
  showActionsColumn: true,

  canAssignSelfToCampaign: true,
  canEditOwnCampaignsOnly: true,
  hideCampaignManagerField: true,

  canUploadInstallationProof: false,
  canViewInstallationProof: true,
  canViewInstallationRejectionReason: true,
};

/**
 * Campaign Manager capabilities when the campaign is NOT assigned to them.
 * View-only access: can read promotions and orders, but cannot perform any write actions.
 * `canAssignSelfToCampaign` remains true so they can claim the campaign.
 */
export const CAMPAIGN_MANAGER_UNASSIGNED_CAPABILITIES: CampaignCapabilities = {
  canCreateCampaign: false,
  canEditCampaign: false,
  canDeleteCampaign: false,
  canArchiveCampaign: false,
  canSubmitToPsp: false,
  canMarkOnHold: false,
  canMarkComplete: false,
  canEditStatus: false,

  canImportPromotions: false,
  canReusePromotions: false,
  canAddPromotions: false,
  canViewPromotions: true,
  canEditPromotions: false,
  canDeletePromotions: false,
  canDuplicatePromotions: false,
  canDistributeToStores: false,
  orderTabStatuses: BRAND_VIEW_ORDER_TAB_CAMPAIGN_STATUSES,
  canShipOrders: false,
  canSubmitInstallationProof: false,
  canReviewInstallationProof: false,

  canAccessImportPromotionsPage: false,
  canAccessPromotionsReusePage: false,
  canAccessStoreDistributionPage: false,
  canAccessShipOrdersPage: false,
  canAccessVerifyInstallationProofPage: false,
  listingEntityKey: 'brandId',
  showBrandFilter: false,
  showBrandColumn: false,
  showQuantityColumn: false,
  showStoreColumn: true,
  showPromotionsColumn: true,
  showArchiveFilter: true,
  showDraftStatusFilter: true,
  showStoreFilter: true,
  showActionsColumn: true,

  canAssignSelfToCampaign: true,
  canEditOwnCampaignsOnly: true,
  hideCampaignManagerField: true,

  canUploadInstallationProof: false,
  canViewInstallationProof: true,
  canViewInstallationRejectionReason: true,
};

const REGIONAL_MANAGER_CAMPAIGN_CAPABILITIES: CampaignCapabilities = {
  canCreateCampaign: false,
  canEditCampaign: false,
  canDeleteCampaign: false,
  canArchiveCampaign: false,
  canSubmitToPsp: false,
  canMarkOnHold: false,
  canMarkComplete: false,
  canEditStatus: false,

  canImportPromotions: false,
  canReusePromotions: false,
  canAddPromotions: false,
  canViewPromotions: true,
  canEditPromotions: false,
  canDeletePromotions: false,
  canDuplicatePromotions: false,
  canDistributeToStores: false,
  orderTabStatuses: STORE_VIEW_ORDER_TAB_CAMPAIGN_STATUSES,
  canShipOrders: false,
  canSubmitInstallationProof: false,
  canReviewInstallationProof: false,

  canAccessImportPromotionsPage: false,
  canAccessPromotionsReusePage: false,
  canAccessStoreDistributionPage: false,

  canAccessShipOrdersPage: false,
  canAccessVerifyInstallationProofPage: false,
  listingEntityKey: 'storeId',
  showBrandFilter: false,
  showBrandColumn: false,
  showQuantityColumn: false,
  showStoreColumn: false,
  showPromotionsColumn: true,
  showArchiveFilter: false,
  showDraftStatusFilter: false,
  showStoreFilter: false,
  showActionsColumn: false,

  canAssignSelfToCampaign: false,
  canEditOwnCampaignsOnly: false,
  hideCampaignManagerField: false,

  canUploadInstallationProof: false,
  canViewInstallationProof: true,
  canViewInstallationRejectionReason: true,
};

// STORE USERS (Store Admin + Store Operator)

const STORE_ADMIN_CAMPAIGN_CAPABILITIES: CampaignCapabilities = {
  canCreateCampaign: false,
  canEditCampaign: false,
  canDeleteCampaign: false,
  canArchiveCampaign: false,
  canSubmitToPsp: false,
  canMarkOnHold: false,
  canMarkComplete: false,
  canEditStatus: false,

  canImportPromotions: false,
  canReusePromotions: false,
  canAddPromotions: false,
  canViewPromotions: true,
  canEditPromotions: false,
  canDeletePromotions: false,
  canDuplicatePromotions: false,
  canDistributeToStores: false,
  orderTabStatuses: STORE_VIEW_ORDER_TAB_CAMPAIGN_STATUSES,
  canShipOrders: false,
  canSubmitInstallationProof: true,
  canReviewInstallationProof: false,

  canAccessImportPromotionsPage: false,
  canAccessPromotionsReusePage: false,
  canAccessStoreDistributionPage: false,

  canAccessShipOrdersPage: false,
  canAccessVerifyInstallationProofPage: false,
  listingEntityKey: 'storeId',
  showBrandFilter: false,
  showBrandColumn: false,
  showQuantityColumn: false,
  showStoreColumn: false,
  showPromotionsColumn: true,
  showArchiveFilter: false,
  showDraftStatusFilter: false,
  showStoreFilter: false,
  showActionsColumn: false,

  canAssignSelfToCampaign: false,
  canEditOwnCampaignsOnly: false,
  hideCampaignManagerField: false,

  canUploadInstallationProof: true,
  canViewInstallationProof: true,
  canViewInstallationRejectionReason: true,
};

const STORE_OPERATOR_CAMPAIGN_CAPABILITIES: CampaignCapabilities = {
  canCreateCampaign: false,
  canEditCampaign: false,
  canDeleteCampaign: false,
  canArchiveCampaign: false,
  canSubmitToPsp: false,
  canMarkOnHold: false,
  canMarkComplete: false,
  canEditStatus: false,

  canImportPromotions: false,
  canReusePromotions: false,
  canAddPromotions: false,
  canViewPromotions: true,
  canEditPromotions: false,
  canDeletePromotions: false,
  canDuplicatePromotions: false,
  canDistributeToStores: false,
  orderTabStatuses: STORE_VIEW_ORDER_TAB_CAMPAIGN_STATUSES,
  canShipOrders: false,
  canSubmitInstallationProof: true,
  canReviewInstallationProof: false,

  canAccessImportPromotionsPage: false,
  canAccessPromotionsReusePage: false,
  canAccessStoreDistributionPage: false,
  canAccessShipOrdersPage: false,
  canAccessVerifyInstallationProofPage: false,
  listingEntityKey: 'storeId',
  showBrandFilter: false,
  showBrandColumn: false,
  showQuantityColumn: false,
  showStoreColumn: false,
  showPromotionsColumn: true,
  showArchiveFilter: false,
  showDraftStatusFilter: false,
  showStoreFilter: false,
  showActionsColumn: false,

  canAssignSelfToCampaign: false,
  canEditOwnCampaignsOnly: false,
  hideCampaignManagerField: false,

  canUploadInstallationProof: true,
  canViewInstallationProof: true,
  canViewInstallationRejectionReason: true,
};

export const CAMPAIGN_CAPABILITIES_MAP: CapabilitiesMap<CampaignCapabilities> = {
  [UserRole.BRAND_ADMIN]: BRAND_ADMIN_CAMPAIGN_CAPABILITIES,
  [UserRole.PSP_ADMIN]: PSP_ADMIN_CAMPAIGN_CAPABILITIES,
  [UserRole.STORE_ADMIN]: STORE_ADMIN_CAMPAIGN_CAPABILITIES,
  [UserRole.STORE_OPERATOR]: STORE_OPERATOR_CAMPAIGN_CAPABILITIES,
  [UserRole.PRODUCTION_OPERATOR]: PRODUCTION_OPERATOR_CAMPAIGN_CAPABILITIES,
  [UserRole.CAMPAIGN_MANAGER]: CAMPAIGN_MANAGER_CAMPAIGN_CAPABILITIES,
  [UserRole.REGIONAL_MANAGER]: REGIONAL_MANAGER_CAMPAIGN_CAPABILITIES,
};
