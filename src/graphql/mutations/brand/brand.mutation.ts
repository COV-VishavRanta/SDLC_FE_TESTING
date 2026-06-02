import { gql } from '@apollo/client';

import {
  BRAND_CORE_FIELDS,
  INCOMPLETE_CAMPAIGN_FIELDS,
  INCOMPLETE_ORDER_FIELDS,
} from '../../fragments';

/**
 * Create a new Brand under a PSP
 */
export const CREATE_BRAND = gql`
  mutation CreateBrand($input: CreateBrandInput!) {
    createBrand(input: $input) {
      success
      message
      brand {
        ...BrandCoreFields
      }
    }
  }
  ${BRAND_CORE_FIELDS}
`;

/**
 * Update an existing Brand's details
 */
export const UPDATE_BRAND = gql`
  mutation UpdateBrand($input: UpdateBrandInput!) {
    updateBrand(input: $input) {
      success
      message
      brand {
        ...BrandCoreFields
      }
    }
  }
  ${BRAND_CORE_FIELDS}
`;

/**
 * Soft-delete a Brand
 */
export const DELETE_BRAND = gql`
  mutation DeleteBrand($input: DeleteBrandInput!) {
    deleteBrand(input: $input) {
      success
      message
    }
  }
`;

/**
 * Activate or deactivate a Brand
 */
export const UPDATE_BRAND_STATUS = gql`
  mutation UpdateBrandStatus($input: UpdateBrandStatusInput!) {
    updateBrandStatus(input: $input) {
      success
      message
      brand {
        id
        pspId
        name
        isActive
      }
      incompleteCampaigns {
        ...IncompleteCampaignFields
      }
      incompleteOrders {
        ...IncompleteOrderFields
      }
    }
  }
  ${INCOMPLETE_CAMPAIGN_FIELDS}
  ${INCOMPLETE_ORDER_FIELDS}
`;
