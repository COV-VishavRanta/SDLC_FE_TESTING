import { gql } from '@apollo/client';

import { PAGINATION_FIELDS, STORE_WITH_ADMINS_FIELDS } from '../../fragments';

const STORE_BASIC_FIELDS = gql`
  fragment StoreBasicFields on StoreType {
    id
    name
    storeNumber
    isActive
  }
`;

/**
 * Fetch a lightweight list of stores belonging to a specific brand.
 * Used when rendering store distribution inputs.
 */
export const GET_STORES_BY_BRAND = gql`
  query GetStoresByBrand($brandId: UUID!) {
    getStoresByBrand(brandId: $brandId) {
      success
      message
      stores {
        ...StoreBasicFields
      }
    }
  }
  ${STORE_BASIC_FIELDS}
`;

/**
 * Fetch all stores with server-side pagination, filtering, and sorting
 */
export const GET_STORES = gql`
  query GetStores(
    $brandId: UUID!
    $page: Int
    $pageSize: Int
    $filter: StoreFilterInput
    $sort: StoreSortInput
  ) {
    stores(brandId: $brandId, page: $page, pageSize: $pageSize, filter: $filter, sort: $sort) {
      success
      message
      totalStores
      activeStores
      inactiveStores
      stores {
        ...StoreWithAdminsFields
      }
      pagination {
        ...PaginationFields
      }
    }
  }
  ${STORE_WITH_ADMINS_FIELDS}
  ${PAGINATION_FIELDS}
`;

/**
 * Fetch full details of a single Store by ID
 * Returns all Store fields including store admins
 */
export const GET_STORE_DETAILS = gql`
  query GetStoreDetails($id: UUID!) {
    storeDetails(id: $id) {
      success
      message
      store {
        ...StoreWithAdminsFields
      }
    }
  }
  ${STORE_WITH_ADMINS_FIELDS}
`;
