import { SortOrder, WebhookSortField } from '@/constant';
import { PaginationInfo, WebhookCredentialType } from '@/types';

// ─────────────────────────────────────────────────────────────────────────────
// WEBHOOK QUERY TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface WebhookFilterInput {
  search?: string;
  isActive?: boolean;
  pspId?: string;
}

export interface WebhookSortInput {
  field: WebhookSortField;
  order: SortOrder;
}

/*
-----------------GET WEBHOOK CREDENTIAL-----------------
*/

export interface GetWebhookCredentialVariables {
  credentialId: string;
}

export interface GetWebhookCredentialPayload {
  success: boolean;
  message: string;
  credential?: WebhookCredentialType;
}

export interface GetWebhookCredentialResponse {
  webhookCredential: GetWebhookCredentialPayload;
}

/*
-----------------GET WEBHOOK CREDENTIALS (list)-----------------
*/

export interface GetWebhookCredentialsVariables {
  page?: number;
  pageSize?: number;
  filter?: WebhookFilterInput;
  sort?: WebhookSortInput;
}

export interface ListWebhookCredentialsPayload {
  success: boolean;
  message: string;
  credentials: WebhookCredentialType[];
  pagination?: PaginationInfo;
  totalCredentials?: number;
  activeCredentials?: number;
  inactiveCredentials?: number;
}

export interface GetWebhookCredentialsResponse {
  webhookCredentials: ListWebhookCredentialsPayload;
}
