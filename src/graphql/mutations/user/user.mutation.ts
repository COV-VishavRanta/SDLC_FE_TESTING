import { gql } from '@apollo/client';

import { USER_CORE_FIELDS } from '../../fragments';

/**
 * Mutation to create a new user
 * Sends user details to the backend
 */
export const CREATE_USER = gql`
  mutation CreateUser($input: CreateNewUserInput!) {
    createUser(input: $input) {
      success
      message
      user {
        ...UserCoreFields
      }
    }
  }
  ${USER_CORE_FIELDS}
`;

/**
 * Mutation to update an existing user
 * Sends updated user details to the backend
 */
export const UPDATE_USER = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      success
      message
      campaignNames
      user {
        ...UserCoreFields
      }
    }
  }
  ${USER_CORE_FIELDS}
`;

/**
 * Soft delete a user (set is_active to False). Allowed for Platform Admin, PSP Admin, Brand Admin, and Store Admin.
 */
export const DELETE_USER = gql`
  mutation DeleteUser($input: DeleteUserInput!) {
    deleteUser(input: $input) {
      success
      message
    }
  }
`;

/**
 * Mutation to activate or deactivate a user
 * Sends userId and isActive to the backend
 */
export const TOGGLE_USER_ACTIVE_STATUS = gql`
  mutation ToggleUserActiveStatus($input: ToggleUserActiveStatusInput!) {
    toggleUserActiveStatus(input: $input) {
      success
      message
      constraintNames
    }
  }
`;

/**
 * Mutation to resend an invitation email to a user
 * Generates a new invite token, invalidating any previous one
 */
export const RESEND_INVITATION = gql`
  mutation ResendInvitation($input: ResendInvitationInput!) {
    resendInvitation(input: $input) {
      success
      message
    }
  }
`;
