import { gql } from '@apollo/client';

export const STORE_MINIMAL_FIELDS = gql`
  fragment StoreMinimalFields on StoreType {
    id
    name
    isActive
  }
`;

/**
 * Core store fields shared across store queries and mutations.
 *
 * Used by: GET_STORES, CREATE_STORE, UPDATE_STORE
 *
 * NOTE: UPDATE_STORE_STATUS intentionally returns a minimal subset
 * (id, brandId, name, isActive) so it does NOT use this fragment.
 */
export const STORE_CORE_FIELDS = gql`
  fragment StoreCoreFields on StoreType {
    ...StoreMinimalFields
    brandId
    isActive
    address
    countryId
    stateId
    cityName
    zipCode
    phoneNumber
    storeNumber
    createdBy
    createdAt
  }
  ${STORE_MINIMAL_FIELDS}
`;

/**
 * Minimal user fields for Store admin display.
 * storeAdmins is a UserType[] but only id/name/email are needed in list/detail contexts.
 *
 * Used by: STORE_WITH_ADMINS_FIELDS
 */
export const STORE_ADMIN_FIELDS = gql`
  fragment StoreAdminFields on UserType {
    id
    name
    email
  }
`;

/**
 * Full Store shape including admin users.
 * Composes StoreCoreFields + storeAdmins for use in list/detail queries.
 *
 * Used by: GET_STORES
 */
export const STORE_WITH_ADMINS_FIELDS = gql`
  fragment StoreWithAdminsFields on StoreType {
    ...StoreCoreFields
    activeStoreAdmins {
      ...StoreAdminFields
    }
    inactiveStoreAdmins {
      ...StoreAdminFields
    }
    pendingStoreAdmins {
      ...StoreAdminFields
    }
    activeStoreOperators {
      ...StoreAdminFields
    }
    inactiveStoreOperators {
      ...StoreAdminFields
    }
    pendingStoreOperators {
      ...StoreAdminFields
    }
    activeRegionalManagers {
      ...StoreAdminFields
    }
    inactiveRegionalManagers {
      ...StoreAdminFields
    }
    pendingRegionalManagers {
      ...StoreAdminFields
    }
    totalStoreOperators
    totalRegionalManagers
    totalStoreAdmins
    totalUsers
  }
  ${STORE_CORE_FIELDS}
  ${STORE_ADMIN_FIELDS}
`;
