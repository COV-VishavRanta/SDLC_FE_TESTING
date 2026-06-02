import { gql } from '@apollo/client';

// ─────────────────────────────────────────────────────────────────────────────
// WEBHOOK MUTATIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create a new webhook credential for a PSP.
 * Returns the full credential including the one-time plaintext clientSecret.
 */
export const CREATE_WEBHOOK_CREDENTIAL = gql`
  mutation CreateWebhookCredential($input: CreateWebhookCredentialInput!) {
    createWebhookCredential(input: $input) {
      success
      message
      credential {
        id
        pspId
        clientId
        secretPrefix
        label
        isActive
        ipAllowlist
        createdAt
        lastUsedAt
        revokedAt
      }
      clientId
      clientSecret
    }
  }
`;

/**
 * Update a webhook credential's label, token expiration, or IP allowlist.
 * PSP Admin only.
 */
export const UPDATE_WEBHOOK_CREDENTIAL = gql`
  mutation UpdateWebhookCredential($input: UpdateWebhookCredentialInput!) {
    updateWebhookCredential(input: $input) {
      success
      message
      credential {
        id
        pspId
        clientId
        secretPrefix
        label
        isActive
        ipAllowlist
        createdAt
        lastUsedAt
        revokedAt
      }
    }
  }
`;

/**
 * Activate or deactivate a webhook credential */
export const SET_WEBHOOK_CREDENTIAL_STATUS = gql`
  mutation setWebhookCredentialStatus($input: SetWebhookCredentialStatusInput!) {
    setWebhookCredentialStatus(input: $input) {
      success
      message
      credential {
        id
        pspId
        clientId
        secretPrefix
        label
        isActive
        ipAllowlist
        createdAt
        lastUsedAt
        revokedAt
      }
    }
  }
`;

/**
 * Rotate a webhook credential secret.
 * Returns the new one-time plaintext clientSecret.
 */
export const ROTATE_WEBHOOK_SECRET = gql`
  mutation RotateWebhookSecret($input: RotateWebhookSecretInput!) {
    rotateWebhookSecret(input: $input) {
      success
      message
      credential {
        id
        pspId
        clientId
        secretPrefix
        label
        isActive
        ipAllowlist
        createdAt
        lastUsedAt
        revokedAt
      }
      clientSecret
    }
  }
`;
