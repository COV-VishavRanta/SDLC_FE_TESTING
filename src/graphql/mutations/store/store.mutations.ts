import { gql } from '@apollo/client';

import { STORE_CORE_FIELDS } from '../../fragments';

/**
 * Create a new Store under a Brand
 */
export const CREATE_STORE = gql`
  mutation CreateStore($input: CreateStoreInput!) {
    createStore(input: $input) {
      success
      message
      store {
        ...StoreCoreFields
      }
    }
  }
  ${STORE_CORE_FIELDS}
`;

/**
 * Update an existing Store's details
 */
export const UPDATE_STORE = gql`
  mutation UpdateStore($input: UpdateStoreInput!) {
    updateStore(input: $input) {
      success
      message
      store {
        ...StoreCoreFields
      }
    }
  }
  ${STORE_CORE_FIELDS}
`;

/**
 * Soft-delete a Store
 */
export const DELETE_STORE = gql`
  mutation DeleteStore($input: DeleteStoreInput!) {
    deleteStore(input: $input) {
      success
      message
    }
  }
`;

/**
 * Activate or deactivate a Store
 */
export const UPDATE_STORE_STATUS = gql`
  mutation UpdateStoreStatus($input: UpdateStoreStatusInput!) {
    updateStoreStatus(input: $input) {
      success
      message
      store {
        id
        brandId
        name
        isActive
      }
      incompleteCampaigns {
        id
        name
        status
        incompleteOrders {
          id
          orderNumber
          status
        }
      }
    }
  }
`;
