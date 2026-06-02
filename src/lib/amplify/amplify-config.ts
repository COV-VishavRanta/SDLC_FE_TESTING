'use client';

import { Amplify } from 'aws-amplify';

/**
 * Configure AWS Amplify for Cognito passwordless authentication
 * This runs on the client side only
 *
 * Authentication Flow:
 * 1. User enters email
 * 2. signIn() with authFlowType: 'USER_AUTH' and preferredChallenge: 'EMAIL_OTP'
 * 3. Cognito sends OTP to email
 * 4. User enters OTP
 * 5. confirmSignIn() verifies OTP and returns tokens
 */
Amplify.configure(
  {
    Auth: {
      Cognito: {
        userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
        userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
        identityPoolId: process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID!,
        loginWith: {
          email: true,
        },
        userAttributes: {
          email: {
            required: true,
          },
        },
      },
    },
    Storage: {
      S3: {
        bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
        region: process.env.NEXT_PUBLIC_S3_REGION!,
      },
    },
  },
  {
    ssr: true, // Required for Next.js
  },
);

/**
 * Client component that configures Amplify
 * Import this in your root layout to initialize Amplify
 */
export function ConfigureAmplifyClientSide(): null {
  return null;
}
