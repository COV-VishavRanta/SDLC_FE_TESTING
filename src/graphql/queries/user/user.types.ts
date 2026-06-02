/*
-----------------CURRENT USER-----------------
*/

import { UserRoleEnum, UserStatusEnum } from '@/constant';
import {
  BrandType,
  PaginationInfo,
  PSPType,
  RoleType,
  StoreType,
  UserFilterInput,
  UserSortInput,
  UserType,
} from '@/types/graphql.types';

export interface CurrentUserResponse {
  me?: UserType;
}

/*
-----------------FETCH USER-----------------
*/

export interface FetchUserVariables {
  userId: string;
}

export interface FetchUserResponse {
  fetchUser: UserType;
}

/*
-----------------ROLES LIST-----------------
*/
export interface RolesListResponse {
  rolesList: RoleType[];
}

/*
-----------------USER LISTING-----------------
*/

export interface GetUsersVariables {
  page: number; // default: 1
  pageSize: number; // default: 20
  filter?: UserFilterInput;
  scope?: {
    pspId?: string;
    brandId?: string;
    storeId?: string;
  };
  sort?: UserSortInput;
}

export interface GetUsersResponse {
  listUsers: {
    success: boolean;
    message: string;
    users: UserType[];
    psps: PSPType[];
    brands: BrandType[];
    stores: StoreType[];
    pagination?: PaginationInfo;
  };
}

export interface UserListItem {
  id: string;
  subId: string;
  email: string;
  status: UserStatusEnum;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  roles: RoleType[];
}

/*
-----------------USER BY ROLES-----------------
*/

export interface GetUsersByRolesVariables {
  roles: UserRoleEnum[];
}

export interface GetUsersByRolesResponse {
  usersByRoles: UserType[];
}
