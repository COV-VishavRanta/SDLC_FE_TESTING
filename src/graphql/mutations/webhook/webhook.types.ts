import { WebhookCredentialType } from '@/types';

// ─────────────────────────────────────────────────────────────────────────────
// WEBHOOK MUTATION TYPES
// ─────────────────────────────────────────────────────────────────────────────

/*
-----------------CREATE WEBHOOK CREDENTIAL-----------------
*/

export interface CreateWebhookCredentialInput {
  label: string;
  tokenExpirationHours?: number;
  ipAllowlist?: string[];
}

export interface CreateWebhookCredentialVariables {
  input: CreateWebhookCredentialInput;
}

export interface CreateWebhookCredentialPayload {
  success: boolean;
  message: string;
  credential?: WebhookCredentialType;
  clientId?: string;
  clientSecret?: string;
}

export interface CreateWebhookCredentialResponse {
  createWebhookCredential: CreateWebhookCredentialPayload;
}

/*
-----------------UPDATE WEBHOOK CREDENTIAL-----------------
*/

export interface UpdateWebhookCredentialInput {
  credentialId: string;
  label?: string;
  tokenExpirationHours?: number;
  ipAllowlist?: string[];
}

export interface UpdateWebhookCredentialVariables {
  input: UpdateWebhookCredentialInput;
}

export interface UpdateWebhookCredentialPayload {
  success: boolean;
  message: string;
  credential?: WebhookCredentialType;
}

export interface UpdateWebhookCredentialResponse {
  updateWebhookCredential: UpdateWebhookCredentialPayload;
}

/*
-----------------SET WEBHOOK CREDENTIAL STATUS-----------------
*/

export interface SetWebhookCredentialStatusInput {
  credentialId: string;
  isActive: boolean;
}

export interface SetWebhookCredentialStatusVariables {
  input: SetWebhookCredentialStatusInput;
}

export interface SetWebhookCredentialStatusPayload {
  success: boolean;
  message: string;
  credential?: WebhookCredentialType;
}

export interface SetWebhookCredentialStatusResponse {
  setWebhookCredentialStatus: SetWebhookCredentialStatusPayload;
}

/*
-----------------ROTATE WEBHOOK SECRET-----------------
*/

export interface RotateWebhookSecretInput {
  credentialId: string;
}

export interface RotateWebhookSecretVariables {
  input: RotateWebhookSecretInput;
}

export interface RotateWebhookSecretPayload {
  success: boolean;
  message: string;
  credential?: WebhookCredentialType;
  clientSecret?: string;
}

export interface RotateWebhookSecretResponse {
  rotateWebhookSecret: RotateWebhookSecretPayload;
}
