import { gql } from '@apollo/client';

import { BRAND_WITH_ADMINS_FIELDS, PAGINATION_FIELDS } from '../../fragments';

/**
 * List all brands for a PSP with server-side pagination, filtering, and sorting
 */
export const GET_BRANDS = gql`
  query GetBrands(
    $pspId: UUID!
    $page: Int
    $pageSize: Int
    $filter: BrandFilterInput
    $sort: BrandSortInput
  ) {
    listBrands(pspId: $pspId, page: $page, pageSize: $pageSize, filter: $filter, sort: $sort) {
      totalBrands
      activeBrands
      inactiveBrands
      brands {
        ...BrandWithAdminsFields
      }
      pagination {
        ...PaginationFields
      }
    }
  }
  ${BRAND_WITH_ADMINS_FIELDS}
  ${PAGINATION_FIELDS}
`;

/**
 * Fetch full details of a single Brand by ID
 * Returns all Brand fields including brand admins
 */
export const GET_BRAND_DETAILS = gql`
  query GetBrandDetails($id: UUID!) {
    brandDetails(id: $id) {
      success
      message
      brand {
        ...BrandWithAdminsFields
      }
    }
  }
  ${BRAND_WITH_ADMINS_FIELDS}
`;
