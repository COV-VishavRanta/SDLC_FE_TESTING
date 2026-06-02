/*
-----------------USER OVERVIEW-----------------
*/

export interface UserOverviewResponse {
  userOverview: UserOverviewType;
}

export interface UserOverviewType {
  /** Total number of users */
  totalUsers: number;
  /** Number of active users */
  activeUsers: number;
  /** Number of inactive users */
  inactiveUsers: number;
  /** Number of pending users (not yet logged in) */
  pendingUsers: number;
  /** Number of new users (created in last 30 days) */
  newUsers: number;
}

/*
-----------------PSP OVERVIEW-----------------
*/

export interface GetPspOverviewVariables {
  pspId: string;
}

export interface PspOverviewType {
  /** Number of active campaigns across all brands under this PSP */
  activeCampaigns: number;
}

export interface PspOverviewResponse {
  pspOverview: PspOverviewType;
}

/*
-----------------PSP OVERVIEW FOR PLATFORM ADMIN-----------------
*/

export interface PspOverviewForPlatformAdminType {
  /** Total number of PSPs */
  totalPsps: number;
  /** Number of active PSPs */
  activePsps: number;
  /** Number of inactive PSPs */
  inactivePsps: number;
}

export interface PspOverviewForPlatformAdminResponse {
  pspOverviewForPlatformAdmin: PspOverviewForPlatformAdminType;
}

/*
-----------------BRAND OVERVIEW -----------------
*/

export interface GetBrandOverviewVariables {
  brandId: string;
}

export interface BrandOverviewType {
  /** Number of active stores for the brand */
  activeStores: number;
  /** Number of ongoing campaigns for the brand */
  ongoingCampaigns: number;
}

export interface GetBrandOverviewResponse {
  brandOverview: BrandOverviewType;
}

/*
-----------------STORE OVERVIEW -----------------
*/

export interface GetStoreOverviewVariables {
  brandId: string;
}

export interface StoreOverviewType {
  totalStores: number;
  activeStores: number;
  inactiveStores: number;
}

export interface GetStoreOverviewResponse {
  storeOverview: StoreOverviewType;
}

/*
-----------------STORE ADMIN OVERVIEW -----------------
*/

export interface GetStoreAdminOverviewVariables {
  storeId: string;
}

export interface StoreAdminOverviewType {
  /** Number of ongoing campaigns for the store */
  ongoingCampaigns: number;
  /** Number of pending (not yet submitted) surveys assigned to the store */
  pendingSurveys: number;
  /** Number of orders pending installation approval for the store */
  pendingInstallations: number;
}

export interface GetStoreAdminOverviewResponse {
  storeAdminOverview: StoreAdminOverviewType;
}
