import {
  BRAND_MINIMAL_FIELDS,
  PSP_WITH_ADMINS_FIELDS,
  STORE_MINIMAL_FIELDS,
  USER_CORE_FIELDS,
} from '@/graphql/fragments';
import { gql } from '@apollo/client';

/**
 * Check whether the current session is impersonating another user
 */
export const GET_IMPERSONATION_STATUS = gql`
  query GetImpersonationStatus {
    impersonationStatus {
      isImpersonating
      targetUser {
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
      impersonator {
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
  }
  ${USER_CORE_FIELDS}
  ${PSP_WITH_ADMINS_FIELDS}
  ${BRAND_MINIMAL_FIELDS}
  ${STORE_MINIMAL_FIELDS}
`;
