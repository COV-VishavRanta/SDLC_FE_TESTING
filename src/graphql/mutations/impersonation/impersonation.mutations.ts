import { gql } from '@apollo/client';

/**
 * Start impersonating another user (one level down in role hierarchy)
 */
export const START_IMPERSONATION = gql`
  mutation StartImpersonation($input: StartImpersonationInput!) {
    startImpersonation(input: $input) {
      success
      message
    }
  }
`;

/**
 * Stop the current impersonation session and return to your own identity
 */
export const STOP_IMPERSONATION = gql`
  mutation StopImpersonation {
    stopImpersonation {
      success
      message
    }
  }
`;
