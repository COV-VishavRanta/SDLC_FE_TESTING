import { gql } from '@apollo/client';

/**
 * Core user fields shared across user queries and mutations.
 *
 * Used by: LOGIN, FETCH_USER, GET_USERS, GET_USERS_BY_ROLE, CREATE_USER, UPDATE_USER, GET_CURRENT_USER
 *
 * NOTE: The `psps` field is intentionally excluded from this fragment — queries
 * that need PSP data (LOGIN, GET_CURRENT_USER, GET_USERS) compose it separately
 * using PSP_CORE_FIELDS or PSP_WITH_ADMINS_FIELDS.
 */
export const USER_CORE_FIELDS = gql`
  fragment UserCoreFields on UserType {
    id
    subId
    email
    name
    status
    isVerified
    createdAt
    updatedAt
    lastLogin
    roles {
      id
      name
      description
    }
  }
`;
