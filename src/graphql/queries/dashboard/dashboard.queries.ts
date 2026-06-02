import { gql } from '@apollo/client';

/**
 * Fetch user overview statistics for dashboard
 * Returns total, active, inactive, pending, and new users count
 */
export const GET_USER_OVERVIEW = gql`
  query GetUserOverview {
    userOverview {
      totalUsers
      activeUsers
      inactiveUsers
      pendingUsers
      newUsers
    }
  }
`;

/**
 * Fetch PSP overview statistics for dashboard
 * Returns active campaign count for a specific PSP
 */
export const GET_PSP_OVERVIEW = gql`
  query GetPspOverview($pspId: UUID!) {
    pspOverview(pspId: $pspId) {
      activeCampaigns
    }
  }
`;

/**
 * Fetch Brand overview statistics (stat cards)
 * Returns active stores and ongoing campaigns for a given Brand
 */
export const GET_BRAND_OVERVIEW = gql`
  query GetBrandOverview($brandId: UUID!) {
    brandOverview(brandId: $brandId) {
      activeStores
      ongoingCampaigns
    }
  }
`;

/**
 * Fetch PSP overview statistics for platform admin dashboard
 * Returns total, active, and inactive PSPs count
 */
export const GET_PSP_OVERVIEW_FOR_PLATFORM_ADMIN = gql`
  query GetPspOverviewForPlatformAdmin {
    pspOverviewForPlatformAdmin {
      totalPsps
      activePsps
      inactivePsps
    }
  }
`;
export const GET_STORE_OVERVIEW = gql`
  query GetStoreOverview($brandId: UUID!) {
    storeOverview(brandId: $brandId) {
      totalStores
      activeStores
      inactiveStores
    }
  }
`;

/**
 * Fetch Store Admin dashboard overview statistics for a specific store
 * Returns ongoing campaigns, pending surveys, and pending installations
 */
export const GET_STORE_ADMIN_OVERVIEW = gql`
  query GetStoreAdminOverview($storeId: UUID!) {
    storeAdminOverview(storeId: $storeId) {
      ongoingCampaigns
      pendingSurveys
      pendingInstallations
    }
  }
`;
