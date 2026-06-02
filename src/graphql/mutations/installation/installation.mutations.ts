import { gql } from '@apollo/client';

// ─────────────────────────────────────────────────────────────────────────────
// INSTALLATION PROOF MUTATIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate presigned S3 URLs for uploading installation proof images.
 * Call this before submitInstallationProof to obtain upload URLs and file keys,
 * then upload the images directly to S3, and pass the file keys when submitting.
 */
export const GENERATE_INSTALLATION_UPLOAD_URL = gql`
  mutation GenerateInstallationUploadUrl($input: GenerateInstallationUploadUrlInput!) {
    generateInstallationUploadUrl(input: $input) {
      success
      message
      uploads {
        name
        key
        uploadUrl
      }
    }
  }
`;

/**
 * Submit installation proof for a received order item.
 * Only Store Admins and Store Operators may submit proof.
 * Requires at least one image and notes.
 * On resubmission after rejection, old images are replaced.
 */
export const SUBMIT_INSTALLATION_PROOF = gql`
  mutation SubmitInstallationProof($input: SubmitInstallationProofInput!) {
    submitInstallationProof(input: $input) {
      success
      message
    }
  }
`;

/**
 * Approve or reject installation proof for an order item.
 * Only Brand Admins and Campaign Managers may review proof.
 * Notes are required when rejecting.
 */
export const REVIEW_INSTALLATION_PROOF = gql`
  mutation ReviewInstallationProof($input: ReviewInstallationProofInput!) {
    reviewInstallationProof(input: $input) {
      success
      message
    }
  }
`;
