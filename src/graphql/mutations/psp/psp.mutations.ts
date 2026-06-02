import { gql } from '@apollo/client';

import {
  INCOMPLETE_CAMPAIGN_FIELDS,
  INCOMPLETE_ORDER_FIELDS,
  PSP_CORE_FIELDS,
} from '../../fragments';

/**
 * Mutation to create a new PSP
 */
export const CREATE_PSP = gql`
  mutation CreatePsp($input: CreatePSPInput!) {
    createPsp(input: $input) {
      success
      message
      psp {
        ...PspCoreFields
      }
    }
  }
  ${PSP_CORE_FIELDS}
`;

/**
 * Mutation to update an existing PSP
 */
export const UPDATE_PSP = gql`
  mutation UpdatePsp($input: UpdatePSPInput!) {
    updatePsp(input: $input) {
      success
      message
      psp {
        ...PspCoreFields
      }
    }
  }
  ${PSP_CORE_FIELDS}
`;

/**
 * Mutation to delete a PSP (soft delete)
 */
export const DELETE_PSP = gql`
  mutation DeletePsp($input: DeletePSPInput!) {
    deletePsp(input: $input) {
      success
      message
    }
  }
`;

/**
 * Mutation to update PSP status (activate/deactivate)
 */
export const UPDATE_PSP_STATUS = gql`
  mutation UpdatePspStatus($input: UpdatePSPStatusInput!) {
    updatePspStatus(input: $input) {
      success
      message
      psp {
        ...PspCoreFields
      }
      incompleteCampaigns {
        ...IncompleteCampaignFields
      }
      incompleteOrders {
        ...IncompleteOrderFields
      }
    }
  }
  ${PSP_CORE_FIELDS}
  ${INCOMPLETE_CAMPAIGN_FIELDS}
  ${INCOMPLETE_ORDER_FIELDS}
`;
