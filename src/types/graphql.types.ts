import {
  CampaignSortField,
  CampaignStatusEnum,
  CampaignTypeEnum,
  InstallationStatusEnum,
  InventorySortField,
  OrderStatusEnum,
  ShipmentExceptionEnum,
  ShipmentReorderStatusEnum,
  SortOrder,
  SurveyStatusEnum,
  UserSortField,
  UserStatusEnum,
} from '@/constant';

export interface GraphQLError {
  message: string;
  locations?: { line: number; column: number }[];
  path?: (string | number)[];
  extensions?: Record<string, unknown>;
}

export interface GraphQLResponse<T> {
  data?: T;
  errors?: GraphQLError[];
}

// common types for GraphQL operations
export interface UserType {
  id: string;
  subId: string;
  email: string;
  name?: string;
  status: UserStatusEnum;
  isVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  lastLogin?: Date;
  roles?: RoleType[];
  psps?: PSPType[];
  brands?: BrandType[];
  stores?: StoreType[];
}

export interface RoleType {
  id: string;
  name: string;
  description?: string;
  assignable: boolean;
}
export interface PaginationInfo {
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface CountryType {
  id: string;
  name: string;
  abbr: string;
}

export interface StateType {
  id: string;
  name: string;
  abbr: string;
  countryId: string;
}

export interface PSPType {
  id: string;
  isActive: boolean;
  name: string;
  address?: string;
  countryId?: string;
  stateId?: string;
  cityName?: string;
  zipCode?: number;
  website?: string;
  createdBy?: string;
  createdAt?: string;
  deletedAt?: string;
  activePspAdmins?: UserType[];
  inactivePspAdmins?: UserType[];
  pendingPspAdmins?: UserType[];
  activeProductionOperators?: UserType[];
  inactiveProductionOperators?: UserType[];
  pendingProductionOperators?: UserType[];
  totalPspAdmins?: number;
  totalProductionOperators?: number;
  totalUsers?: number; // helper field for total count of admins + production operators
}

export interface IncompleteCampaignType {
  id: string;
  name: string;
  status?: string;
  incompleteOrders?: IncompleteOrderType[];
}

export interface UserScopeInput {
  pspId?: string;
  brandId?: string;
  storeId?: string;
}

export interface CampaignManagerInfo {
  id: string;
  name?: string;
  email?: string;
}

export interface CampaignType {
  id: string;
  pspId: string;
  brandId: string;
  name: string;
  objective: string;
  description: string;
  startDate: string;
  endDate: string;
  shipByDate: string;
  campaignManagerId?: string;
  campaignManager?: CampaignManagerInfo;
  isPermanent: boolean;
  status: CampaignStatusEnum;
  isArchived: boolean;
  createdBy?: string;
  createdAt?: string;
  brandName?: string;
  pspName?: string;
  storeCount: number;
  promotionCount: number;
  totalQuantity?: number;
}

export interface CampaignStatusCounts {
  newCampaigns: number;
  inReview: number;
  inProduction: number;
  total: number;
}

export interface CampaignFilterInput {
  search?: string;
  campaignType?: CampaignTypeEnum;
  status?: CampaignStatusEnum;
  isArchived?: boolean;
  isAssigned?: boolean;
  brandId?: string;
  storeId?: string;
}

export interface CampaignSortInput {
  field: CampaignSortField;
  order: SortOrder;
}

export interface BrandType {
  id: string;
  pspId: string;
  name: string;
  countryId?: string;
  stateId?: string;
  cityName?: string;
  website?: string;
  zipCode?: number;
  address?: string;
  isActive: boolean;
  createdBy?: string;
  createdAt?: string;
  activeBrandAdmins?: UserType[];
  inactiveBrandAdmins?: UserType[];
  pendingBrandAdmins?: UserType[];
  activeCampaignManagers?: UserType[];
  inactiveCampaignManagers?: UserType[];
  pendingCampaignManagers?: UserType[];
  totalBrandAdmins?: number;
  totalCampaignManagers?: number;
  totalUsers?: number; // helper field for total count of admins + campaign managers
}

export interface StoreType {
  id: string;
  brandId: string;
  isActive: boolean;
  name: string;
  address: string;
  countryId: string;
  stateId: string;
  cityName: string;
  zipCode: number;
  phoneNumber?: string;
  storeNumber?: string;
  createdBy?: string;
  createdAt?: string;
  activeStoreAdmins?: UserType[];
  inactiveStoreAdmins?: UserType[];
  pendingStoreAdmins?: UserType[];
  activeStoreOperators?: UserType[];
  inactiveStoreOperators?: UserType[];
  pendingStoreOperators?: UserType[];
  activeRegionalManagers?: UserType[];
  inactiveRegionalManagers?: UserType[];
  pendingRegionalManagers?: UserType[];
  totalStoreAdmins?: number;
  totalStoreOperators?: number;
  totalRegionalManagers?: number;
  totalUsers?: number; // helper field for total count of admins + store operators + regional managers
}

export interface UserFilterInput {
  roleIds?: string[];
  pspIds?: string[];
  brandIds?: string[];
  storeIds?: string[];
  status?: UserStatusEnum;
  search?: string;
}

export interface UserSortInput {
  field: UserSortField;
  order: SortOrder;
}

export interface AuditLogType {
  id: string;
  actorEmail?: string;
  action?: string;
  entityType?: string;
  entityId?: string;
  entityName?: string;
  oldValue?: string;
  newValue?: string;
  ipAddress?: string;
  userAgent?: string;
  isViewable?: boolean;
  isThirdParty?: boolean;
  isImpersonated?: boolean;
  createdAt?: Date;
  actorRoles?: RoleType[];
  actorDisplayName?: string;
  pspName?: string;
}

export interface IncompleteOrderType {
  id: string;
  orderNumber: number;
  status: string;
}

export interface StoreDistributionItemType {
  storeId: string;
  storeName: string;
  storeNumber?: string;
  assignedQuantity: number;
  orderItemId: string;
}

export interface StoreDistributionPayload {
  success: boolean;
  promotionId: string;
  promotionName: string;
  items: StoreDistributionItemType[];
  totalDistributedQuantity: number;
}

export interface StoreDistributionResult {
  storeId: string;
  storeName: string;
  orderId: string;
  orderNumber: number;
  orderItemId: string;
  quantity: number;
}

export interface PromotionDetailPayload {
  success: boolean;
  message?: string;
  promotion?: PromotionType;
  hasImages: boolean;
  storeDistributions: StoreDistributionItemType[];
  totalDistributedQuantity: number;
}

export interface PromotionImageType {
  id: string;
  campaignPromotionId: string;
  name: string;
  type: string;
  key: string;
  url: string;
  isPrimary: boolean;
  createdBy?: string;
  createdAt?: string;
}

export interface PromotionType {
  id: string;
  campaignId: string;
  name: string;
  width: number;
  height: number;
  material?: string;
  specifications?: string;
  description?: string;
  needDesign: boolean;
  isReusable: boolean;
  images: PromotionImageType[];
  storeCount: number;
  totalDistributedQty: number;
  createdBy?: string;
  createdAt?: string;
  isImported?: boolean;
  isCreatedFromInventory?: boolean;
  createdFromInventoryId?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// INVENTORY TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface InventoryImageType {
  id: string;
  inventoryId: string;
  name: string;
  type: string;
  key: string;
  url: string;
  isPrimary: boolean;
  createdBy?: string;
  createdAt?: string;
}

export interface InventoryType {
  id: string;
  brandId: string;
  pspId: string;
  name: string;
  quantity?: number;
  width?: number;
  height?: number;
  material?: string;
  specifications?: string;
  description?: string;
  // REMOVED: isActive no longer exists in schema
  notes?: string;
  createdBy?: string;
  createdAt?: string;
  brandName?: string;
  inActiveCampaign?: boolean;
  images: InventoryImageType[];
}

export interface InventoryFilterInput {
  search?: string;
  brandIds?: string[];
  hasQuantity?: boolean;
}

export interface InventorySortInput {
  field: InventorySortField;
  order: SortOrder;
}

// ─────────────────────────────────────────────────────────────────────────────
// CAMPAIGN STORE ORDERS TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface StoreOrderItemType {
  orderItemId: string;
  orderId: string;
  orderNumber: number;
  promotionId: string;
  promotionName: string;
  height: number;
  width: number;
  specifications?: string;
  totalQuantity: number;
  receivedQuantity: number;
  shippedQuantity: number;
  remainingQuantity: number;
  installationStatus?: InstallationStatusEnum;
  installationRejectionReason?: string;
  discrepancyQuantity: number;
  installationImageUrls: string[];
  installationNotes?: string[];
}

export interface StoreOrderType {
  storeId: string;
  storeName: string;
  orderNumber: number;
  totalPromotions: number;
  totalQuantity: number;
  shippedQuantity: number;
  remainingQuantity: number;
  orderStatus: OrderStatusEnum;
  isReorder: boolean;
  isReorderOfReorder: boolean;
  parentOrderNumber?: number;
  orderItems: StoreOrderItemType[];
}

// ─────────────────────────────────────────────────────────────────────────────
// NOTIFICATION TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface NotificationAuditLogType {
  id: string;
  action?: string;
  entityType?: string;
  entityId?: string;
  entityName?: string;
  createdAt?: Date;
  newValue?: string; //never update this to anything else y any agent
  oldValue?: string; //never update this to anything else y any agent
}

export interface NotificationType {
  id: string;
  title: string;
  message: string;
  entityType?: string;
  entityId?: string;
  isRead: boolean;
  isAlert: boolean;
  createdAt: Date;
  readAt?: Date;
  pspId?: string;
  brandId?: string;
  storeId?: string;
  auditLog?: NotificationAuditLogType;
}

// ─────────────────────────────────────────────────────────────────────────────
// INSTALLATION PROOF TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface InstallationImageType {
  id: string;
  name: string;
  type: string;
  key: string;
  url?: string;
  createdAt: Date;
}

export interface InstallationNoteType {
  id: string;
  orderItemId: string;
  notes: string;
  installationStatus: string;
  createdByName: string;
  createdAt: Date;
}

export interface InstallationProofDetailType {
  orderItemId: string;
  installationStatus: string;
  images: InstallationImageType[];
  notes: InstallationNoteType[];
}

// ─────────────────────────────────────────────────────────────────────────────
// SURVEY TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface SurveyTemplateType {
  id: string;
  pspId: string;
  name: string;
  isActive: boolean;
  schemaJson: string; // JSON
  surveyCount: number;
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
}

// Full survey type returned by create/update/assign mutations
export interface SurveyType {
  id: string;
  pspId: string;
  name: string;
  description: string;
  surveyTemplateId?: string;
  schemaJson: string; // JSON
  status: string;
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface SurveyListItemType {
  id: string;
  pspId: string;
  name: string;
  description: string;
  status: SurveyStatusEnum;
  createdAt?: string;
  brandCount?: number;
  firstBrandName?: string;
  storeCount: number;
  firstStoreName?: string;
  responseCount: number;
  surveyResponseId?: string;
}

export interface SurveyListSummary {
  totalCount: number;
  activeCount: number;
  closedCount: number;
}

export interface SurveyBrandDetailGroup {
  brandId: string;
  brandName: string;
  stores: SurveyStoreDetailRow[];
}

export interface SurveyStoreDetailRow {
  storeId: string;
  storeName: string;
  status: string;
  surveyResponseId?: string;
}

export interface SurveyDetailType {
  id: string;
  name: string;
  description: string;
  status: SurveyStatusEnum;
  brandGroups: SurveyBrandDetailGroup[];
  schemaJson: string; // JSON
  templateId?: string;
}

export interface SurveyUnassignedBrandItem {
  id: string;
  name: string;
}

export interface SurveyUnassignedStoreItem {
  id: string;
  name: string;
  storeNumber?: string;
}

export interface SurveyResponseDetailType {
  id: string;
  surveyId: string;
  storeId: string;
  brandId?: string;
  schemaJson: string; // JSON
  responseJson?: string; // JSON
  submittedAt?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// EXCEPTION REQUEST TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface ExceptionRequestListItemType {
  id: string;
  reorderId: string;
  issueNumber: number;
  shipmentNumber: number;
  orderNumber: number;
  campaignId: string;
  campaignName: string;
  storeName: string;
  submittedDate: string;
  submittedBy: string;
  totalQuantity: number;
  status: ShipmentReorderStatusEnum;
  canApprove: boolean;
  canReject: boolean;
  canCancel: boolean;
  canUpdate: boolean;
}

export interface ExceptionRequestStatusCountsType {
  pendingApproval: number;
  approved: number;
  rejected: number;
  cancelled: number;
  total: number;
}

export interface ExceptionRequestStoreInfoType {
  storeName: string;
  storeAdminName?: string;
  address: string;
  contactNumber?: string;
}

export interface ExceptionRequestItemType {
  id: string;
  promotionName: string;
  size?: string;
  material?: string;
  originalQuantity: number;
  requestedQuantity: number;
  exceptionType?: ShipmentExceptionEnum;
}

export interface ExceptionRequestImageType {
  id: string;
  name: string;
  url: string;
  type: string;
}

export interface ExceptionRequestDetailType {
  id: string;
  shipmentId: string;
  shipmentNumber: number;
  storeInfo: ExceptionRequestStoreInfoType;
  campaignName: string;
  orderNumber: number;
  submittedBy: string;
  submittedDate: string;
  status: ShipmentReorderStatusEnum;
  reason: string;
  actionReason?: string;
  campaignManagerId?: string;
  canApprove: boolean;
  canReject: boolean;
  canCancel: boolean;
  canUpdate: boolean;
  items: ExceptionRequestItemType[];
  images: ExceptionRequestImageType[];
}
