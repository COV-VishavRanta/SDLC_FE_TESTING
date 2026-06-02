import { gql } from '@apollo/client';

import {
  BRAND_MINIMAL_FIELDS,
  PSP_CORE_FIELDS,
  STORE_MINIMAL_FIELDS,
  USER_CORE_FIELDS,
} from '../../fragments';

/**
 * Mutation to authenticate user with Cognito tokens
 * Sends access token, ID token, and refresh token to the backend
 */
export const LOGIN = gql`
  mutation Login($input: TokensRequest!) {
    login(input: $input) {
      statusCode
      authenticated
      content {
        ok
        error
      }
      user {
        ...UserCoreFields
        psps {
          ...PspCoreFields
        }
        brands {
          ...BrandMinimalFields
        }
        stores {
          ...StoreMinimalFields
        }
      }
    }
  }
  ${USER_CORE_FIELDS}
  ${PSP_CORE_FIELDS}
  ${BRAND_MINIMAL_FIELDS}
  ${STORE_MINIMAL_FIELDS}
`;

/**
 * Logout mutation to clear server-side session
 * This will typically clear the authentication cookie set by the backend
 */
// authenticated
// content
export const LOGOUT = gql`
  mutation Logout {
    logout {
      statusCode
    }
  }
`;

/**
 * Refresh mutation to update access token on the backend
 * Sends new access token obtained from Cognito to replace expired one
 * Backend validates and updates the access_token httpOnly cookie
 */
// authenticated
// content
export const REFRESH_TOKEN = gql`
  mutation RefreshToken($input: TokensRequest!) {
    refreshToken(input: $input) {
      statusCode
    }
  }
`;
