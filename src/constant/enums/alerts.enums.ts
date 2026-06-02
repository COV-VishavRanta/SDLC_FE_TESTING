import { UserRole } from './user.enums';

export enum AlertType {
  ERROR = 'error',
  WARNING = 'warning',
  SUCCESS = 'success',
  INFO = 'info',
}

/**
 * Roles that filter notifications by PSP ID.
 * Add more PSP roles here when needed.
 */
export const PSP_NOTIFICATION_ROLES = new Set<UserRole>([
  UserRole.PSP_ADMIN,
  UserRole.PRODUCTION_OPERATOR,
]);

/**
 * Roles that filter notifications by Brand ID.
 * Add more Brand roles here when needed.
 */
export const BRAND_NOTIFICATION_ROLES = new Set<UserRole>([
  UserRole.BRAND_ADMIN,
  UserRole.CAMPAIGN_MANAGER,
]);

/**
 * Roles that filter notifications by Store ID.
 * Add more Store roles here when needed.
 */
export const STORE_NOTIFICATION_ROLES = new Set<UserRole>([
  UserRole.REGIONAL_MANAGER,
  UserRole.STORE_ADMIN,
  UserRole.STORE_OPERATOR,
]);

/**
 * Notification type codes returned by the backend in NotificationType.title.
 * Maps 1-to-1 with the backend NotificationTypeEnum from messages.py.
 * Used to look up locale-specific display labels in the alerts.notificationTypes translation namespace.
 */
export enum NotificationTypeEnum {
  CAMPAIGN_MANAGER_UPDATED = 'CAMPAIGN_MANAGER_UPDATED',
  NEW_CAMPAIGN_SUBMITTED = 'NEW_CAMPAIGN_SUBMITTED',
  CAMPAIGN_MANAGER_SELF_ASSIGNED = 'CAMPAIGN_MANAGER_SELF_ASSIGNED',
  CAMPAIGN_SHIP_DATE_APPROACHING = 'CAMPAIGN_SHIP_DATE_APPROACHING',
  CAMPAIGN_SHIP_DATE_OVERDUE = 'CAMPAIGN_SHIP_DATE_OVERDUE',
  CAMPAIGN_STATUS_UPDATED = 'CAMPAIGN_STATUS_UPDATED',
  INSTALLATION_PROOF_APPROVED = 'INSTALLATION_PROOF_APPROVED',
  INSTALLATION_PROOF_REJECTED = 'INSTALLATION_PROOF_REJECTED',
  INSTALLATION_PROOF_SUBMITTED = 'INSTALLATION_PROOF_SUBMITTED',
  ORDER_STATUS_UPDATED = 'ORDER_STATUS_UPDATED',
  REORDER_APPROVED = 'REORDER_APPROVED',
  REORDER_CANCELLED = 'REORDER_CANCELLED',
  REORDER_ORDER_CREATED = 'REORDER_ORDER_CREATED',
  REORDER_REJECTED = 'REORDER_REJECTED',
  REORDER_UPDATED = 'REORDER_UPDATED',
  REORDER_CREATED = 'REORDER_CREATED',
  EXCEPTION_REQUEST_SUBMITTED = 'EXCEPTION_REQUEST_SUBMITTED',
  EXCEPTION_REQUEST_APPROVED = 'EXCEPTION_REQUEST_APPROVED',
  EXCEPTION_REQUEST_REJECTED = 'EXCEPTION_REQUEST_REJECTED',
  EXCEPTION_REQUEST_CANCELLED = 'EXCEPTION_REQUEST_CANCELLED',
  EXCEPTION_REQUEST_UPDATED = 'EXCEPTION_REQUEST_UPDATED',
  EXCEPTION_REQUEST_RESUBMITTED = 'EXCEPTION_REQUEST_RESUBMITTED',
  CAMPAIGN_CREATED = 'CAMPAIGN_CREATED',
  SHIPMENT_CREATED = 'SHIPMENT_CREATED',
  SHIPMENT_RECEIVED = 'SHIPMENT_RECEIVED',
  SHIPMENT_REORDER_CREATED = 'SHIPMENT_REORDER_CREATED',
  SURVEY_ASSIGNED = 'SURVEY_ASSIGNED',
  SURVEY_CLOSED = 'SURVEY_CLOSED',
  SURVEY_RESPONSE_SUBMITTED = 'SURVEY_RESPONSE_SUBMITTED',
  INVITATION_ACCEPTED = 'INVITATION_ACCEPTED',
  USER_ACTIVATED = 'USER_ACTIVATED',
  USER_DEACTIVATED = 'USER_DEACTIVATED',
}

export interface AlertItem {
  id: string;
  title: string;
  description: string;
  severity: AlertType;
}

// ── Alert type style configuration ─────────────────────────────────────────

export const ALERT_TYPE_STYLES: Record<
  AlertType,
  { row: string; icon: string; title: string; subtitle: string }
> = {
  [AlertType.ERROR]: {
    row: 'bg-[var(--alert-error-bg)] border-2 border-[var(--alert-error-bg)]',
    icon: 'bg-[var(--alert-error-icon)] text-white',
    title: 'text-[var(--alert-error-title)]',
    subtitle: 'text-[var(--alert-error-subtitle)]',
  },
  [AlertType.WARNING]: {
    row: 'bg-[var(--alert-warning-bg)] border-2 border-[var(--alert-warning-bg)]',
    icon: 'bg-[var(--alert-warning-icon)] text-white',
    title: 'text-[var(--alert-warning-title)]',
    subtitle: 'text-[var(--alert-warning-subtitle)]',
  },
  [AlertType.SUCCESS]: {
    row: 'bg-[var(--alert-success-bg)] border-2 border-[var(--alert-success-bg)]',
    icon: 'bg-[var(--alert-success-icon)] text-white',
    title: 'text-[var(--alert-success-title)]',
    subtitle: 'text-[var(--alert-success-subtitle)]',
  },
  [AlertType.INFO]: {
    row: 'bg-[var(--alert-info-bg)] border-2 border-[var(--alert-info-bg)]',
    icon: 'bg-[var(--alert-info-icon)] text-white',
    title: 'text-[var(--alert-info-title)]',
    subtitle: 'text-[var(--alert-info-subtitle)]',
  },
};
