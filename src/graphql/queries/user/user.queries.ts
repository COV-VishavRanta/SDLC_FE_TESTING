import { gql } from '@apollo/client';

import {
  BRAND_MINIMAL_FIELDS,
  PAGINATION_FIELDS,
  PSP_MINIMAL_FIELDS,
  PSP_WITH_ADMINS_FIELDS,
  STORE_MINIMAL_FIELDS,
  USER_CORE_FIELDS,
} from '../../fragments';

/**
 * Get current authenticated user
 * This query requires authentication and will return 401 if token is invalid
 */
export const GET_CURRENT_USER = gql`
  query Me {
    me {
      ...UserCoreFields
      psps {
        ...PspWithAdminsFields
      }
      brands {
        ...BrandMinimalFields
      }
      stores {
        ...StoreMinimalFields
      }
    }
  }
  ${USER_CORE_FIELDS}
  ${PSP_WITH_ADMINS_FIELDS}
  ${BRAND_MINIMAL_FIELDS}
  ${STORE_MINIMAL_FIELDS}
`;

/**
 * Get roles that the current user can assign to new users
 */
export const GET_ROLES_LIST = gql`
  query GetRolesList {
    rolesList {
      id
      name
      assignable
    }
  }
`;

/**
 * Fetch a specific user by ID.
 * Allowed for Platform Admin, PSP Admin, Brand Admin, and Store Admin.
 */
export const FETCH_USER = gql`
  query FetchUser($userId: UUID!) {
    fetchUser(userId: $userId) {
      ...UserCoreFields
    }
  }
  ${USER_CORE_FIELDS}
`;

/**
 * List all users with pagination, filtering, sorting, and search. Allowed for Platform Admin, PSP Admin, Brand Admin, and Store Admin.
 */
export const GET_USERS = gql`
  query GetUsers(
    $page: Int! = 1
    $pageSize: Int! = 20
    $filter: UserFilterInput
    $scope: UserScopeInput
    $sort: UserSortInput
  ) {
    listUsers(page: $page, pageSize: $pageSize, filter: $filter, scope: $scope, sort: $sort) {
      users {
        ...UserCoreFields
        psps {
          ...PspMinimalFields
        }
        brands {
          ...BrandMinimalFields
        }
        stores {
          ...StoreMinimalFields
        }
      }
      psps {
        ...PspMinimalFields
      }
      brands {
        ...BrandMinimalFields
      }
      stores {
        ...StoreMinimalFields
      }
      pagination {
        ...PaginationFields
      }
    }
  }
  ${USER_CORE_FIELDS}
  ${PSP_MINIMAL_FIELDS}
  ${BRAND_MINIMAL_FIELDS}
  ${STORE_MINIMAL_FIELDS}
  ${PAGINATION_FIELDS}
`;

/**
 * Fetch users that have any of the provided role names (case-insensitive)
 */
export const GET_USERS_BY_ROLE = gql`
  query GetUsersByRoles($roles: [UserRoleEnum!]!) {
    usersByRoles(roles: $roles) {
      ...UserCoreFields
    }
  }
  ${USER_CORE_FIELDS}
`;
