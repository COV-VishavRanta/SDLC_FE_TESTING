import { gql } from '@apollo/client';

export const BRAND_MINIMAL_FIELDS = gql`
  fragment BrandMinimalFields on BrandType {
    id
    name
  }
`;

/**
 * Core brand fields shared across brand queries and mutations.
 *
 * Used by: GET_BRANDS, CREATE_BRAND, UPDATE_BRAND
 *
 * NOTE: UPDATE_BRAND_STATUS intentionally returns a minimal subset
 * (id, pspId, name, isActive) so it does NOT use this fragment.
 */
export const BRAND_CORE_FIELDS = gql`
  fragment BrandCoreFields on BrandType {
    ...BrandMinimalFields
    pspId
    countryId
    stateId
    cityName
    website
    address
    zipCode
    isActive
    createdBy
    createdAt
  }
  ${BRAND_MINIMAL_FIELDS}
`;

/**
 * Minimal user fields for Brand admin display.
 * brandAdmins is a UserType[] but only id/name/email are needed in list contexts.
 *
 * Used by: BRAND_WITH_ADMINS_FIELDS
 */
export const BRAND_ADMIN_FIELDS = gql`
  fragment BrandAdminFields on UserType {
    id
    name
    email
  }
`;

/**
 * Full Brand shape including admin users.
 * Composes BrandCoreFields + brandAdmins for use in list/detail queries.
 *
 * Used by: GET_BRANDS
 */
export const BRAND_WITH_ADMINS_FIELDS = gql`
  fragment BrandWithAdminsFields on BrandType {
    ...BrandCoreFields
    activeBrandAdmins {
      ...BrandAdminFields
    }
    inactiveBrandAdmins {
      ...BrandAdminFields
    }
    pendingBrandAdmins {
      ...BrandAdminFields
    }
    activeCampaignManagers {
      ...BrandAdminFields
    }
    inactiveCampaignManagers {
      ...BrandAdminFields
    }
    pendingCampaignManagers {
      ...BrandAdminFields
    }
    totalCampaignManagers
    totalBrandAdmins
    totalUsers
  }
  ${BRAND_CORE_FIELDS}
  ${BRAND_ADMIN_FIELDS}
`;
