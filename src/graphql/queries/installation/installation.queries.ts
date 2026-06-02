import { gql } from '@apollo/client';

// ─────────────────────────────────────────────────────────────────────────────
// INSTALLATION PROOF QUERIES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get installation proof detail for an order item.
 * Returns current installation status, all images with resolved URLs,
 * and all notes in chronological order.
 * Accessible by Store Admin, Store Operator, Brand Admin, and Campaign Manager.
 */
export const GET_INSTALLATION_PROOF_DETAIL = gql`
  query GetInstallationProofDetail($orderItemId: UUID!) {
    installationProofDetail(orderItemId: $orderItemId) {
      orderItemId
      installationStatus
      images {
        id
        name
        type
        key
        url
        createdAt
      }
      notes {
        id
        orderItemId
        notes
        installationStatus
        createdByName
        createdAt
      }
    }
  }
`;
