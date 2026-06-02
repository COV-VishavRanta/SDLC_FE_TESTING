import { gql } from '@apollo/client';

/**
 * Bare minimum PSP fields when we require only id name (e.g. dropdowns).
 *
 * Used by: GET_BRANDS (psps),GET_USERS (psps, users.psps)
 */
export const PSP_MINIMAL_FIELDS = gql`
  fragment PspMinimalFields on PSPType {
    id
    name
  }
`;

/**
 * Core PSP fields shared across PSP queries and mutations.
 *
 * Used by: LOGIN (user.psps), CREATE_PSP, UPDATE_PSP, UPDATE_PSP_STATUS, PSP_WITH_ADMINS_FIELDS
 */
export const PSP_CORE_FIELDS = gql`
  fragment PspCoreFields on PSPType {
    ...PspMinimalFields
    isActive
    address
    countryId
    stateId
    cityName
    zipCode
    website
  }
  ${PSP_MINIMAL_FIELDS}
`;

/**
 * Minimal user fields for PSP admin display.
 * pspAdmins is a UserType[] but only id/name/email are needed in list contexts.
 *
 * Used by: PSP_WITH_ADMINS_FIELDS
 */
export const PSP_ADMIN_FIELDS = gql`
  fragment PspAdminFields on UserType {
    id
    name
    email
  }
`;

/**
 * Full PSP shape including admin users.
 * Composes PspCoreFields + pspAdmins for use in list/detail queries.
 *
 * Used by: GET_PSPS, GET_CURRENT_USER (psps), GET_USERS (psps)
 */
export const PSP_WITH_ADMINS_FIELDS = gql`
  fragment PspWithAdminsFields on PSPType {
    ...PspCoreFields
    activePspAdmins {
      ...PspAdminFields
    }
    inactivePspAdmins {
      ...PspAdminFields
    }
    pendingPspAdmins {
      ...PspAdminFields
    }
    activeProductionOperators {
      ...PspAdminFields
    }
    inactiveProductionOperators {
      ...PspAdminFields
    }
    pendingProductionOperators {
      ...PspAdminFields
    }
    totalPspAdmins
    totalProductionOperators
    totalUsers
  }
  ${PSP_CORE_FIELDS}
  ${PSP_ADMIN_FIELDS}
`;
