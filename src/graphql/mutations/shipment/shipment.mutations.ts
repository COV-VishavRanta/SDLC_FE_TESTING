import { gql } from '@apollo/client';

export const CREATE_SHIPMENT = gql`
  mutation CreateShipment($input: CreateShipmentInput!) {
    createShipment(input: $input) {
      success
      message
      shipment {
        id
        shipmentNumber
        orderId
        trackingNumber
        eta
        carrierName
        status
        notes
        createdAt
        items {
          id
          shipmentId
          orderItemId
          quantityShipped
          promotionName
          createdAt
        }
      }
    }
  }
`;

/**
 * Receive a shipment and update item quantities and statuses.
 * When discrepancies exist, a shipment reorder is created with presigned upload URLs for evidence images.
 */
export const RECEIVE_SHIPMENT = gql`
  mutation ReceiveShipment($input: ReceiveShipmentInput!) {
    receiveShipment(input: $input) {
      success
      message
      shipmentReorder {
        id
        status
        reason
        imageUploads {
          name
          key
          uploadUrl
        }
      }
    }
  }
`;

/**
 * Generate a presigned S3 URL for uploading a shipment reorder evidence image.
 * Call this before receiveShipment to obtain an upload URL and file key.
 */
export const GENERATE_REORDER_UPLOAD_URL = gql`
  mutation GenerateReorderUploadUrl($input: GenerateReorderUploadUrlInput!) {
    generateReorderUploadUrl(input: $input) {
      success
      message
      uploads {
        name
        key
        uploadUrl
      }
    }
  }
`;

/**
 * Approve, reject, or cancel an exception request.
 */
export const ACTION_EXCEPTION_REQUEST = gql`
  mutation ActionExceptionRequest($input: ActionExceptionRequestInput!) {
    actionExceptionRequest(input: $input) {
      success
      message
    }
  }
`;

/**
 * Update (resubmit) a rejected exception request.
 */
export const UPDATE_EXCEPTION_REQUEST = gql`
  mutation UpdateExceptionRequest($input: UpdateExceptionRequestInput!) {
    updateExceptionRequest(input: $input) {
      success
      message
    }
  }
`;
