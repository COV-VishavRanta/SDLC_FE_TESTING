export enum UserSortField {
  NAME = 'NAME',
  EMAIL = 'EMAIL',
  ROLE = 'ROLE',
  STATUS = 'STATUS',
  CREATED_AT = 'CREATED_AT',
}

export enum UserStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum EntityType {
  BRAND = 'brandId',
  STORE = 'storeId',
  PSP = 'pspId',
}

export enum UserRole {
  PLATFORM_ADMIN = 'Platform Admin',
  PSP_ADMIN = 'PSP Admin',
  BRAND_ADMIN = 'Brand Admin',
  STORE_ADMIN = 'Store Admin',
  REGIONAL_MANAGER = 'Regional Manager',
  CAMPAIGN_MANAGER = 'Campaign Manager',
  PRODUCTION_OPERATOR = 'Production Operator',
  STORE_OPERATOR = 'Store Operator',
}

/** GraphQL-aligned enum matching the schema's `UserRoleEnum` */
export enum UserRoleEnum {
  PLATFORM_ADMIN = 'PLATFORM_ADMIN',
  PSP_ADMIN = 'PSP_ADMIN',
  BRAND_ADMIN = 'BRAND_ADMIN',
  STORE_ADMIN = 'STORE_ADMIN',
  REGIONAL_MANAGER = 'REGIONAL_MANAGER',
  CAMPAIGN_MANAGER = 'CAMPAIGN_MANAGER',
  PRODUCTION_OPERATOR = 'PRODUCTION_OPERATOR',
  STORE_OPERATOR = 'STORE_OPERATOR',
}

/** GraphQL-aligned enum matching the schema's `DateRangeEnum` */
export enum DateRangeEnum {
  LAST_7_DAYS = 'LAST_7_DAYS',
  LAST_30_DAYS = 'LAST_30_DAYS',
  LAST_90_DAYS = 'LAST_90_DAYS',
  TODAY = 'TODAY',
}

export enum AuditLogSortField {
  ACTOR = 'ACTOR',
  ROLE = 'ROLE',
  ACTION = 'ACTION',
  CREATED_AT = 'CREATED_AT',
}

/** Entities that can be displayed in the topbar entity display widget */
export enum TopbarEntity {
  PSP = 'PSP',
  BRAND = 'BRAND',
  STORE = 'STORE',
}

/**
 * Defines which entities to display in the topbar for each role.
 * Roles absent from this map show no entity display.
 * To support a new role, add an entry here.
 */
export const ROLE_TOPBAR_ENTITIES: Partial<Record<UserRole, readonly TopbarEntity[]>> = {
  [UserRole.PSP_ADMIN]: [TopbarEntity.PSP],
  [UserRole.PRODUCTION_OPERATOR]: [TopbarEntity.PSP],
  [UserRole.BRAND_ADMIN]: [TopbarEntity.PSP, TopbarEntity.BRAND],
  [UserRole.REGIONAL_MANAGER]: [TopbarEntity.PSP, TopbarEntity.BRAND, TopbarEntity.STORE],
  [UserRole.CAMPAIGN_MANAGER]: [TopbarEntity.PSP, TopbarEntity.BRAND],
  [UserRole.STORE_ADMIN]: [TopbarEntity.PSP, TopbarEntity.BRAND, TopbarEntity.STORE],
  [UserRole.STORE_OPERATOR]: [TopbarEntity.PSP, TopbarEntity.BRAND, TopbarEntity.STORE],
};
