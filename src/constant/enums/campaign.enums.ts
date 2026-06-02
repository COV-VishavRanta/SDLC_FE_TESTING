import { InstallationStatusEnum } from './shipment.enums';
import { OrderStatusEnum } from './store.enums';

export enum CampaignStatusEnum {
  DRAFT = 'DRAFT',
  NEW = 'NEW',
  IN_REVIEW = 'IN_REVIEW',
  ACCEPTED = 'ACCEPTED',
  ON_HOLD = 'ON_HOLD',
  IN_PRODUCTION = 'IN_PRODUCTION',
  PARTIALLY_SHIPPED = 'PARTIALLY_SHIPPED',
  SHIPPED = 'SHIPPED',
  PARTIALLY_RECEIVED = 'PARTIALLY_RECEIVED',
  RECEIVED = 'RECEIVED',
  COMPLETED = 'COMPLETED',
}

export enum CampaignTypeEnum {
  ONE_OFF = 'ONE_OFF',
  PERMANENT = 'PERMANENT',
}

export enum ImportPromotionMode {
  COPY = 'COPY',
  REPLACE = 'REPLACE',
}

export enum CampaignSortField {
  NAME = 'NAME',
  BRAND_NAME = 'BRAND_NAME',
  CAMPAIGN_TYPE = 'CAMPAIGN_TYPE',
  STATUS = 'STATUS',
  STORE_COUNT = 'STORE_COUNT',
  START_DATE = 'START_DATE',
  END_DATE = 'END_DATE',
  SHIP_BY_DATE = 'SHIP_BY_DATE',
}

// editable statuses
export const EDITABLE_CAMPAIGN_STATUSES = new Set<CampaignStatusEnum>([
  CampaignStatusEnum.DRAFT,
  CampaignStatusEnum.ON_HOLD,
  CampaignStatusEnum.NEW,
  CampaignStatusEnum.ACCEPTED,
  CampaignStatusEnum.IN_REVIEW,
  CampaignStatusEnum.IN_PRODUCTION,
  CampaignStatusEnum.PARTIALLY_SHIPPED,
  CampaignStatusEnum.SHIPPED,
  CampaignStatusEnum.PARTIALLY_RECEIVED,
  CampaignStatusEnum.RECEIVED,
]);

// Only campaigns managers will be editable when status is below ones
export const EDITABLE_ONLY_CAMPAIGN_MANAGER_STATUSES = new Set<CampaignStatusEnum>([
  CampaignStatusEnum.NEW,
  CampaignStatusEnum.ACCEPTED,
  CampaignStatusEnum.IN_REVIEW,
  CampaignStatusEnum.IN_PRODUCTION,
  CampaignStatusEnum.PARTIALLY_SHIPPED,
  CampaignStatusEnum.SHIPPED,
  CampaignStatusEnum.PARTIALLY_RECEIVED,
  CampaignStatusEnum.RECEIVED,
]);

// Only campaigns in DRAFT and HOLD status can be deleted
export const DELETABLE_CAMPAIGN_STATUSES = new Set<CampaignStatusEnum>([
  CampaignStatusEnum.DRAFT,
  CampaignStatusEnum.ON_HOLD,
]);

// Only completed campaigns can be archived
export const ARCHIVABLE_CAMPAIGN_STATUSES = new Set<CampaignStatusEnum>([
  CampaignStatusEnum.COMPLETED,
]);

// Campaigns in DRAFT or ON_HOLD status can be submitted to PSP for approval
export const SUBMIT_TO_PSP_CAMPAIGN_STATUSES = new Set<CampaignStatusEnum>([
  CampaignStatusEnum.DRAFT,
  CampaignStatusEnum.ON_HOLD,
]);

// Brand Admin can mark a campaign On Hold when it's actively being reviewed by PSP
export const MARK_ON_HOLD_CAMPAIGN_STATUSES = new Set<CampaignStatusEnum>([
  CampaignStatusEnum.NEW,
  CampaignStatusEnum.IN_REVIEW,
  CampaignStatusEnum.ACCEPTED,
]);

// Brand Admin can mark a campaign Complete once PSP has received it
export const MARK_COMPLETE_CAMPAIGN_STATUSES = new Set<CampaignStatusEnum>([
  CampaignStatusEnum.RECEIVED,
]);

// PSP Admin can manually set a campaign to any of these statuses via the Update Status dialog
export const PSP_UPDATABLE_CAMPAIGN_STATUSES: CampaignStatusEnum[] = [
  CampaignStatusEnum.NEW,
  CampaignStatusEnum.IN_REVIEW,
  CampaignStatusEnum.ACCEPTED,
  CampaignStatusEnum.IN_PRODUCTION,
];

// Maps each campaign status to the statuses a PSP Admin can transition it to
export const PSP_UPDATABLE_CAMPAIGN_STATUS_TRANSITIONS: Partial<
  Record<CampaignStatusEnum, CampaignStatusEnum[]>
> = {
  [CampaignStatusEnum.NEW]: [CampaignStatusEnum.IN_REVIEW],
  [CampaignStatusEnum.IN_REVIEW]: [CampaignStatusEnum.ACCEPTED],
  [CampaignStatusEnum.ACCEPTED]: [CampaignStatusEnum.IN_PRODUCTION],
};

// The Edit Status button is only shown when the campaign is in one of these statuses
export const SHOW_EDIT_STATUS_BUTTON_STATUSES = new Set<CampaignStatusEnum>([
  CampaignStatusEnum.NEW,
  CampaignStatusEnum.IN_REVIEW,
  CampaignStatusEnum.ACCEPTED,
]);

// Only Order items in campaigns with these statuses can have uploaded installation proofs
export const SHOW_UPLOAD_INSTALLATION_BUTTON = new Set<InstallationStatusEnum>([
  InstallationStatusEnum.PENDING,
  InstallationStatusEnum.REJECTED,
]);

// Only Order items in campaigns with these statuses can have installation actions performed (uploading proof, verifying, rejecting)
export const CAN_PERFORM_INSTALLATION_ACTION = new Set<OrderStatusEnum>([
  OrderStatusEnum.RECEIVED,
  OrderStatusEnum.PENDING_INSTALLATION_APPROVAL,
  OrderStatusEnum.INSTALLATION_REJECTED,
  OrderStatusEnum.COMPLETED,
]);

// only view order tabs when status is other than Draft
export const PSP_VIEW_ORDER_TAB_CAMPAIGN_STATUSES = new Set<CampaignStatusEnum>([
  CampaignStatusEnum.NEW,
  CampaignStatusEnum.IN_REVIEW,
  CampaignStatusEnum.ACCEPTED,
  CampaignStatusEnum.ON_HOLD,
  CampaignStatusEnum.IN_PRODUCTION,
  CampaignStatusEnum.PARTIALLY_SHIPPED,
  CampaignStatusEnum.SHIPPED,
  CampaignStatusEnum.PARTIALLY_RECEIVED,
  CampaignStatusEnum.RECEIVED,
  CampaignStatusEnum.COMPLETED,
]);
// only view order tabs on all status
export const BRAND_VIEW_ORDER_TAB_CAMPAIGN_STATUSES = new Set<CampaignStatusEnum>([
  CampaignStatusEnum.DRAFT,
  CampaignStatusEnum.NEW,
  CampaignStatusEnum.IN_REVIEW,
  CampaignStatusEnum.ACCEPTED,
  CampaignStatusEnum.ON_HOLD,
  CampaignStatusEnum.IN_PRODUCTION,
  CampaignStatusEnum.PARTIALLY_SHIPPED,
  CampaignStatusEnum.SHIPPED,
  CampaignStatusEnum.PARTIALLY_RECEIVED,
  CampaignStatusEnum.RECEIVED,
  CampaignStatusEnum.COMPLETED,
]);
// Brand Admin can view the Installation Proof tab when campaign is in shipping/receiving/completed
export const BRAND_VIEW_INSTALLATION_PROOF_TAB_CAMPAIGN_STATUSES = new Set<CampaignStatusEnum>([
  CampaignStatusEnum.SHIPPED,
  CampaignStatusEnum.PARTIALLY_SHIPPED,
  CampaignStatusEnum.PARTIALLY_RECEIVED,
  CampaignStatusEnum.RECEIVED,
  CampaignStatusEnum.COMPLETED,
]);

// only view order tabs when status is other than Draft
export const STORE_VIEW_ORDER_TAB_CAMPAIGN_STATUSES = new Set<CampaignStatusEnum>([
  CampaignStatusEnum.NEW,
  CampaignStatusEnum.IN_REVIEW,
  CampaignStatusEnum.ACCEPTED,
  CampaignStatusEnum.ON_HOLD,
  CampaignStatusEnum.IN_PRODUCTION,
  CampaignStatusEnum.PARTIALLY_SHIPPED,
  CampaignStatusEnum.SHIPPED,
  CampaignStatusEnum.PARTIALLY_RECEIVED,
  CampaignStatusEnum.RECEIVED,
  CampaignStatusEnum.COMPLETED,
]);

// promotions statuses
// Only promotions in campaigns with below statuses can be edited, deleted, store distribution, or duplicated
export const EDITABLE_PROMOTION_STATUSES = new Set<CampaignStatusEnum>([
  CampaignStatusEnum.DRAFT,
  CampaignStatusEnum.ON_HOLD,
]);

/** Status badge color mapping for all CampaignStatusEnum values */
const STATUS_STYLES: Record<CampaignStatusEnum, { bg: string; text: string; border: string }> = {
  [CampaignStatusEnum.DRAFT]: {
    bg: 'var(--badge-inactive-bg)',
    text: 'var(--badge-inactive-text)',
    border: 'var(--badge-inactive-border)',
  },
  [CampaignStatusEnum.NEW]: {
    bg: 'var(--badge-new-bg)',
    text: 'var(--badge-new-text)',
    border: 'var(--badge-new-border)',
  },
  [CampaignStatusEnum.ACCEPTED]: {
    bg: 'var(--badge-acknowledged-bg)',
    text: 'var(--badge-acknowledged-text)',
    border: 'var(--badge-acknowledged-border)',
  },
  [CampaignStatusEnum.IN_REVIEW]: {
    bg: 'var(--badge-inreview-bg)',
    text: 'var(--badge-inreview-text)',
    border: 'var(--badge-inreview-border)',
  },
  [CampaignStatusEnum.ON_HOLD]: {
    bg: 'var(--badge-onhold-bg)',
    text: 'var(--badge-onhold-text)',
    border: 'var(--badge-onhold-border)',
  },
  [CampaignStatusEnum.IN_PRODUCTION]: {
    bg: 'var(--badge-inproduction-bg)',
    text: 'var(--badge-inproduction-text)',
    border: 'var(--badge-inproduction-border)',
  },
  [CampaignStatusEnum.PARTIALLY_SHIPPED]: {
    bg: 'var(--badge-partially-shipped-bg)',
    text: 'var(--badge-partially-shipped-text)',
    border: 'var(--badge-partially-shipped-border)',
  },
  [CampaignStatusEnum.SHIPPED]: {
    bg: 'var(--badge-shipped-bg)',
    text: 'var(--badge-shipped-text)',
    border: 'var(--badge-shipped-border)',
  },
  [CampaignStatusEnum.PARTIALLY_RECEIVED]: {
    bg: 'var(--badge-partially-received-bg)',
    text: 'var(--badge-partially-received-text)',
    border: 'var(--badge-partially-received-border)',
  },
  [CampaignStatusEnum.RECEIVED]: {
    bg: 'var(--badge-received-bg)',
    text: 'var(--badge-received-text)',
    border: 'var(--badge-received-border)',
  },
  [CampaignStatusEnum.COMPLETED]: {
    bg: 'var(--badge-completed-bg)',
    text: 'var(--badge-completed-text)',
    border: 'var(--badge-completed-border)',
  },
};

export const getCampaignStatusStyles = (status: CampaignStatusEnum) => STATUS_STYLES[status];

// for dashboard
/* ─── Display Labels ─── */
export const STATUS_DISPLAY_NAMES: Record<CampaignStatusEnum, string> = {
  [CampaignStatusEnum.DRAFT]: 'Draft',
  [CampaignStatusEnum.NEW]: 'New',
  [CampaignStatusEnum.IN_REVIEW]: 'In Review',
  [CampaignStatusEnum.ACCEPTED]: 'Accepted',
  [CampaignStatusEnum.ON_HOLD]: 'On Hold',
  [CampaignStatusEnum.IN_PRODUCTION]: 'In Production',
  [CampaignStatusEnum.PARTIALLY_SHIPPED]: 'Partially Shipped',
  [CampaignStatusEnum.SHIPPED]: 'Shipped',
  [CampaignStatusEnum.PARTIALLY_RECEIVED]: 'Partially Received',
  [CampaignStatusEnum.RECEIVED]: 'Received',
  [CampaignStatusEnum.COMPLETED]: 'Completed',
};

/* ─── Display order ─── */
export const BRAND_DASHBOARD_CAMPAIGN_DISPLAY_ORDER: CampaignStatusEnum[] = [
  CampaignStatusEnum.DRAFT,
  CampaignStatusEnum.ON_HOLD,
  CampaignStatusEnum.NEW,
  CampaignStatusEnum.IN_REVIEW,
  CampaignStatusEnum.ACCEPTED,
  CampaignStatusEnum.IN_PRODUCTION,
  CampaignStatusEnum.PARTIALLY_SHIPPED,
  CampaignStatusEnum.SHIPPED,
  CampaignStatusEnum.PARTIALLY_RECEIVED,
  CampaignStatusEnum.RECEIVED,
  CampaignStatusEnum.COMPLETED,
];

export const PSP_DASHBOARD_CAMPAIGN_DISPLAY_ORDER: CampaignStatusEnum[] = [
  CampaignStatusEnum.ON_HOLD,
  CampaignStatusEnum.NEW,
  CampaignStatusEnum.IN_REVIEW,
  CampaignStatusEnum.ACCEPTED,
  CampaignStatusEnum.IN_PRODUCTION,
  CampaignStatusEnum.PARTIALLY_SHIPPED,
  CampaignStatusEnum.SHIPPED,
  CampaignStatusEnum.PARTIALLY_RECEIVED,
  CampaignStatusEnum.RECEIVED,
  CampaignStatusEnum.COMPLETED,
];

export const STORE_DASHBOARD_CAMPAIGN_DISPLAY_ORDER: CampaignStatusEnum[] = [
  CampaignStatusEnum.ON_HOLD,
  CampaignStatusEnum.NEW,
  CampaignStatusEnum.IN_REVIEW,
  CampaignStatusEnum.ACCEPTED,
  CampaignStatusEnum.IN_PRODUCTION,
  CampaignStatusEnum.PARTIALLY_SHIPPED,
  CampaignStatusEnum.SHIPPED,
  CampaignStatusEnum.PARTIALLY_RECEIVED,
  CampaignStatusEnum.RECEIVED,
  CampaignStatusEnum.COMPLETED,
];

export enum CAMPAIGN_SUB_PAGE_NAME {
  IMPORT_PROMOTIONS = 'import-promotions',
  PROMOTIONS_REUSE = 'promotions-reuse',
  STORE_DISTRIBUTION = 'store-distribution',
  SHIP_ORDERS = 'ship-orders',
  VERIFY_INSTALLATION_PROOF = 'verify-installation-proof',
}
