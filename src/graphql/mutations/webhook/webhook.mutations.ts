import { gql } from '@apollo/client';

export const CREATE_WEBHOOK_CREDENTIAL = gql`
  mutation CreateWebhookCredential($input: CreateWebhookCredentialInput!) {
    createWebhookCredential(input: $input) {
      success
      message
      credential {
        id
        pspId
        label
        clientId
        secretPrefix
        tokenExpirationHours
        ipAllowlist
        isActive
      }
      clientSecret
    }
  }
`;
