export enum InstallationStatusEnum {
  PENDING = 'PENDING',
  INSTALLED = 'INSTALLED',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
}

export enum ShipmentStatusEnum {
  SHIPPED = 'SHIPPED',
  RECEIVED = 'RECEIVED',
  RECEIVED_WITH_EXCEPTION = 'RECEIVED_WITH_EXCEPTION',
}

export enum ShipmentStatusLabelEnum {
  SHIPPED = 'Shipped',
  RECEIVED = 'Received',
  RECEIVED_WITH_EXCEPTION = 'Received with Exception',
}

export enum ShipmentSortField {
  ORDER_NUMBER = 'ORDER_NUMBER',
  CAMPAIGN_NAME = 'CAMPAIGN_NAME',
  STORE_NAME = 'STORE_NAME',
  SHIPMENT_ETA = 'SHIPMENT_ETA',
  SHIPMENT_NUMBER = 'SHIPMENT_NUMBER',
  STATUS = 'STATUS',
  TOTAL_ITEMS = 'TOTAL_ITEMS',
  CREATED_AT = 'CREATED_AT',
}

export enum ShipmentExceptionEnum {
  DAMAGED = 'DAMAGED',
  MISSING = 'MISSING',
  INCORRECT = 'INCORRECT',
}

export enum ShipmentReorderStatusEnum {
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

export enum ExceptionRequestSortField {
  SUBMITTED_DATE = 'SUBMITTED_DATE',
  CAMPAIGN_NAME = 'CAMPAIGN_NAME',
  STATUS = 'STATUS',
  STORE_NAME = 'STORE_NAME',
  QUANTITY = 'QUANTITY',
  SHIPMENT_NUMBER = 'SHIPMENT_NUMBER',
  ISSUE_NUMBER = 'ISSUE_NUMBER',
  ORDER_NUMBER = 'ORDER_NUMBER',
}

/** Status badge color mapping for all ShipmentStatus values */
const SHIPMENT_STATUS_STYLES: Record<
  ShipmentStatusEnum,
  { bg: string; text: string; border: string }
> = {
  [ShipmentStatusEnum.SHIPPED]: {
    bg: 'var(--badge-shipped-bg)',
    text: 'var(--badge-shipped-text)',
    border: 'var(--badge-shipped-border)',
  },
  [ShipmentStatusEnum.RECEIVED_WITH_EXCEPTION]: {
    bg: 'var(--badge-received-with-exception-bg)',
    text: 'var(--badge-received-with-exception-text)',
    border: 'var(--badge-received-with-exception-border)',
  },

  [ShipmentStatusEnum.RECEIVED]: {
    bg: 'var(--badge-received-bg)',
    text: 'var(--badge-received-text)',
    border: 'var(--badge-received-border)',
  },
};

export const getShipmentStatusStyles = (status: ShipmentStatusEnum) =>
  SHIPMENT_STATUS_STYLES[status];

/** Status badge color mapping for all InstallationStatus values */
const INSTALLATION_STATUS_STYLES: Record<
  InstallationStatusEnum,
  { bg: string; text: string; border: string }
> = {
  [InstallationStatusEnum.PENDING]: {
    bg: 'var(--badge-pending-bg)',
    text: 'var(--badge-pending-text)',
    border: 'var(--badge-pending-border)',
  },
  [InstallationStatusEnum.INSTALLED]: {
    bg: 'var(--badge-installed-bg)',
    text: 'var(--badge-installed-text)',
    border: 'var(--badge-installed-border)',
  },
  [InstallationStatusEnum.PENDING_APPROVAL]: {
    bg: 'var(--badge-pending-approval-bg)',
    text: 'var(--badge-pending-approval-text)',
    border: 'var(--badge-pending-approval-border)',
  },
  [InstallationStatusEnum.REJECTED]: {
    bg: 'var(--badge-rejected-bg)',
    text: 'var(--badge-rejected-text)',
    border: 'var(--badge-rejected-border)',
  },
  [InstallationStatusEnum.COMPLETED]: {
    bg: 'var(--badge-completed-bg)',
    text: 'var(--badge-completed-text)',
    border: 'var(--badge-completed-border)',
  },
};

export const getInstallationStatusStyles = (status: InstallationStatusEnum) =>
  INSTALLATION_STATUS_STYLES[status];

/** Status badge color mapping for all ShipmentReorderStatus (Exception Request) values */
const EXCEPTION_REQUEST_STATUS_STYLES: Record<
  ShipmentReorderStatusEnum,
  { bg: string; text: string; border: string }
> = {
  [ShipmentReorderStatusEnum.PENDING_APPROVAL]: {
    bg: 'var(--badge-pending-bg)',
    text: 'var(--badge-pending-text)',
    border: 'var(--badge-pending-border)',
  },
  [ShipmentReorderStatusEnum.APPROVED]: {
    bg: 'var(--badge-approved-bg)',
    text: 'var(--badge-approved-text)',
    border: 'var(--badge-approved-border)',
  },
  [ShipmentReorderStatusEnum.REJECTED]: {
    bg: 'var(--badge-rejected-bg)',
    text: 'var(--badge-rejected-text)',
    border: 'var(--badge-rejected-border)',
  },
  [ShipmentReorderStatusEnum.CANCELLED]: {
    bg: 'var(--badge-cancelled-bg)',
    text: 'var(--badge-cancelled-text)',
    border: 'var(--badge-cancelled-border)',
  },
};

export const getExceptionRequestStatusStyles = (status: ShipmentReorderStatusEnum) =>
  EXCEPTION_REQUEST_STATUS_STYLES[status];
