import { NotificationType, PaginationInfo } from '@/types';

// ─────────────────────────────────────────────────────────────────────────────
// NOTIFICATIONS QUERIES – TYPES
// ─────────────────────────────────────────────────────────────────────────────

/*
-----------------GET NOTIFICATIONS-----------------
*/

export interface GetNotificationsVariables {
  pspId?: string;
  brandId?: string;
  storeId?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface GetNotificationsResponse {
  notifications: {
    success: boolean;
    message: string;
    notifications: NotificationType[];
    pagination?: PaginationInfo;
  };
}
