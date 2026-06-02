export enum StoreSortField {
  NAME = 'NAME',
  STORE_NUMBER = 'STORE_NUMBER',
  CREATED_AT = 'CREATED_AT',
}

export enum OrderStatusEnum {
  DRAFT = 'DRAFT',
  NEW = 'NEW',
  ACCEPTED = 'ACCEPTED',
  IN_REVIEW = 'IN_REVIEW',
  ON_HOLD = 'ON_HOLD',
  IN_PRODUCTION = 'IN_PRODUCTION',
  PARTIALLY_SHIPPED = 'PARTIALLY_SHIPPED',
  SHIPPED = 'SHIPPED',
  PARTIALLY_RECEIVED = 'PARTIALLY_RECEIVED',
  RECEIVED = 'RECEIVED',
  RECEIVED_WITH_EXCEPTION = 'RECEIVED_WITH_EXCEPTION',
  PENDING_INSTALLATION_APPROVAL = 'PENDING_INSTALLATION_APPROVAL',
  INSTALLATION_REJECTED = 'INSTALLATION_REJECTED',
  TRIAGED = 'TRIAGED',
  COMPLETED = 'COMPLETED',
}

// Orders in In-Production, Partially Shipped, can be marked as Shipped by the Brand Admin
export const SHOW_SHIP_ORDER_BUTTON = new Set<OrderStatusEnum>([
  OrderStatusEnum.IN_PRODUCTION,
  OrderStatusEnum.PARTIALLY_SHIPPED,
  OrderStatusEnum.RECEIVED_WITH_EXCEPTION,
]);

// Store Admin / Store Operator can upload installation proof on these statuses
export const SHOW_INSTALLATION_PROOF_BUTTON = new Set<OrderStatusEnum>([
  OrderStatusEnum.RECEIVED,
  OrderStatusEnum.RECEIVED_WITH_EXCEPTION,
  OrderStatusEnum.INSTALLATION_REJECTED,
]);

// Only stores with these order statuses are shown in the Installation Proof tab
export const INSTALLATION_PROOF_TAB_ORDER_STATUSES = new Set<OrderStatusEnum>([
  OrderStatusEnum.PENDING_INSTALLATION_APPROVAL,
  OrderStatusEnum.INSTALLATION_REJECTED,
  OrderStatusEnum.COMPLETED,
]);

// Brand Admin can verify installation proof on these order statuses
export const SHOW_VERIFY_BUTTON = new Set<OrderStatusEnum>([
  OrderStatusEnum.PENDING_INSTALLATION_APPROVAL,
]);

/** Status badge color mapping for all OrderStatusEnum values */
const STATUS_STYLES: Record<OrderStatusEnum, { bg: string; text: string; border: string }> = {
  [OrderStatusEnum.DRAFT]: {
    bg: 'var(--badge-inactive-bg)',
    text: 'var(--badge-inactive-text)',
    border: 'var(--badge-inactive-border)',
  },
  [OrderStatusEnum.NEW]: {
    bg: 'var(--badge-new-bg)',
    text: 'var(--badge-new-text)',
    border: 'var(--badge-new-border)',
  },
  [OrderStatusEnum.ACCEPTED]: {
    bg: 'var(--badge-acknowledged-bg)',
    text: 'var(--badge-acknowledged-text)',
    border: 'var(--badge-acknowledged-border)',
  },
  [OrderStatusEnum.IN_REVIEW]: {
    bg: 'var(--badge-inreview-bg)',
    text: 'var(--badge-inreview-text)',
    border: 'var(--badge-inreview-border)',
  },
  [OrderStatusEnum.ON_HOLD]: {
    bg: 'var(--badge-onhold-bg)',
    text: 'var(--badge-onhold-text)',
    border: 'var(--badge-onhold-border)',
  },
  [OrderStatusEnum.IN_PRODUCTION]: {
    bg: 'var(--badge-inproduction-bg)',
    text: 'var(--badge-inproduction-text)',
    border: 'var(--badge-inproduction-border)',
  },
  [OrderStatusEnum.PARTIALLY_SHIPPED]: {
    bg: 'var(--badge-partially-shipped-bg)',
    text: 'var(--badge-partially-shipped-text)',
    border: 'var(--badge-partially-shipped-border)',
  },
  [OrderStatusEnum.SHIPPED]: {
    bg: 'var(--badge-shipped-bg)',
    text: 'var(--badge-shipped-text)',
    border: 'var(--badge-shipped-border)',
  },
  [OrderStatusEnum.PARTIALLY_RECEIVED]: {
    bg: 'var(--badge-partially-received-bg)',
    text: 'var(--badge-partially-received-text)',
    border: 'var(--badge-partially-received-border)',
  },
  [OrderStatusEnum.RECEIVED]: {
    bg: 'var(--badge-received-bg)',
    text: 'var(--badge-received-text)',
    border: 'var(--badge-received-border)',
  },
  [OrderStatusEnum.RECEIVED_WITH_EXCEPTION]: {
    bg: 'var(--badge-received-with-exception-bg)',
    text: 'var(--badge-received-with-exception-text)',
    border: 'var(--badge-received-with-exception-border)',
  },
  [OrderStatusEnum.PENDING_INSTALLATION_APPROVAL]: {
    bg: 'var(--badge-pending-installation-approval-bg)',
    text: 'var(--badge-pending-installation-approval-text)',
    border: 'var(--badge-pending-installation-approval-border)',
  },
  [OrderStatusEnum.INSTALLATION_REJECTED]: {
    bg: 'var(--badge-installation-rejected-bg)',
    text: 'var(--badge-installation-rejected-text)',
    border: 'var(--badge-installation-rejected-border)',
  },
  [OrderStatusEnum.TRIAGED]: {
    bg: 'var(--badge-triaged-bg)',
    text: 'var(--badge-triaged-text)',
    border: 'var(--badge-triaged-border)',
  },
  [OrderStatusEnum.COMPLETED]: {
    bg: 'var(--badge-completed-bg)',
    text: 'var(--badge-completed-text)',
    border: 'var(--badge-completed-border)',
  },
};

export const getOrderStatusStyles = (status: OrderStatusEnum) => STATUS_STYLES[status];
