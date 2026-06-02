import { WebhookCredentialType } from '@/types/graphql.types';

export interface CreateWebhookCredentialInput {
  label: string;
  tokenExpirationHours: number;
  ipAllowlist?: string[];
}

export interface CreateWebhookCredentialArguments {
  input: CreateWebhookCredentialInput;
}

export interface CreateWebhookCredentialResponse {
  createWebhookCredential: {
    success: boolean;
    message: string;
    credential: WebhookCredentialType;
    clientSecret: string;
  };
}
