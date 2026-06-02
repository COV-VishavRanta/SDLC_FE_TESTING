import { gql } from '@apollo/client';

import { PAGINATION_FIELDS } from '../../fragments';

// ─────────────────────────────────────────────────────────────────────────────
// WEBHOOK QUERIES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch a single webhook credential by ID.
 * For the PSP Admin, the credential must belong to their PSP.
 */
export const GET_WEBHOOK_CREDENTIAL = gql`
  query GetWebhookCredential($credentialId: UUID!) {
    webhookCredential(credentialId: $credentialId) {
      success
      message
      credential {
        id
        pspId
        clientId
        secretPrefix
        label
        isActive
        pspName
        ipAllowlist
        createdAt
        lastUsedAt
        revokedAt
        tokenExpirationHours
      }
    }
  }
`;

/**
 * List webhook credentials with filtering, sorting, and pagination.
 */
export const GET_WEBHOOK_CREDENTIALS = gql`
  query GetWebhookCredentials(
    $page: Int
    $pageSize: Int
    $filter: WebhookFilterInput
    $sort: WebhookSortInput
  ) {
    webhookCredentials(page: $page, pageSize: $pageSize, filter: $filter, sort: $sort) {
      success
      message
      credentials {
        id
        pspId
        clientId
        secretPrefix
        label
        isActive
        pspName
        ipAllowlist
        createdAt
        lastUsedAt
        revokedAt
        tokenExpirationHours
      }
      pagination {
        ...PaginationFields
      }
      totalCredentials
      activeCredentials
      inactiveCredentials
    }
  }
  ${PAGINATION_FIELDS}
`;
