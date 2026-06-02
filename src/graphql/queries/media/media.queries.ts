import { gql } from '@apollo/client';

// ─────────────────────────────────────────────────────────────────────────────
// MEDIA QUERIES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch a presigned S3 URL for an image by its S3 key.
 */
export const GET_IMAGE_URL_BY_KEY = gql`
  query GetImageUrlByKey($key: String!) {
    getImageUrlByKey(key: $key)
  }
`;
