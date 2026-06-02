# Authentication Feature Overview

## Description

This document provides an overview of the authentication system in the Pop Logic frontend application. The system implements a passwordless, email-based One-Time Password (OTP) flow utilizing AWS Cognito via AWS Amplify, followed by a backend token exchange via GraphQL.

## Status

Implemented

## Architecture Diagram

```text
┌─────────────────────────────────────────────────────────────┐
│  Next.js Frontend (App Router)                              │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Auth Layout & Pages (src/app/(auth)/)                │  │
│  │                                                       │  │
│  │   ┌──────────────┐    ┌───────────────────────────┐   │  │
│  │   │  LoginForm   │───▶│  VerificationForm         │   │  │
│  │   │  (Email input│    │  (OTP input + hook logic) │   │  │
│  │   └──────┬───────┘    └─────────────┬─────────────┘   │  │
│  │          │                          │                 │  │
│  │          │                          │                 │  │
│  │          ▼                          ▼                 │  │
│  │  ┌──────────────────────────────────────────────────┐ │  │
│  │  │  AWS Amplify SDK (src/lib/amplify)               │ │  │
│  │  │  (sendLoginOtp, verifyLoginOtp)                  │ │  │
│  │  └──────────────────────────────────────────────────┘ │  │
│  └────────────────────────┬──────────────────────────────┘  │
│                           │                                 │
│  ┌────────────────────────▼──────────────────────────────┐  │
│  │  GlobalProtectedContext + Apollo Client (RSC)         │  │
│  │  (Manages post-login roles, permissions, session)     │  │
│  └───────────────────────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  Backend Services / Identity Provider                       │
│                                                             │
│  ┌─────────────────┐    ┌───────────────────────────────┐   │
│  │ AWS Cognito     │    │ GraphQL BFF / API             │   │
│  │ (Issues OTP &   │◀──▶│ (Validates Cognito Tokens,    │   │
│  │ Session Tokens) │    │  Returns HTTP-only Cookies &  │   │
│  │                 │    │  User Role/Context Data)      │   │
│  └─────────────────┘    └───────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Core Components & Flow

1. **Email Submission (`LoginForm.tsx`)**
   - User enters their email address.
   - The client invokes Amplify's `signIn()` with `preferredChallenge: 'EMAIL_OTP'`.
   - AWS Cognito sends an 8-digit OTP to the provided email.
   - UI transitions to the OTP entry screen.

2. **OTP Verification (`VerificationForm.tsx` & `useVerificationForm.ts`)**
   - User enters the 8-digit OTP.
   - The client invokes Amplify's `confirmSignIn()` to validate the code.
   - Upon success, Amplify returns a Cognito session (`accessToken` and `idToken`).

3. **Backend Token Exchange (`auth.mutations.ts`)**
   - The frontend immediately sends the Cognito `idToken` and `accessToken` to the backend via a GraphQL `LOGIN` mutation.
   - The backend validates the tokens, checking user permissions and roles.
   - The backend sets secure, HTTP-only session cookies (`access_token`, `USER_ROLE_COOKIE_NAME`, etc.) on the response.
   - The backend responds with the user's role context (Roles, PSPs, Brands, Stores).

4. **Routing & Context (`proxy.ts` & `GlobalProtectedContext.tsx`)**
   - A Next.js middleware (`src/proxy.ts`) checks for the presence of the `access_token` HTTP-only cookie to guard protected routes.
   - `GlobalProtectedContext` retrieves the user's role and state via the `GET_CURRENT_USER` query using the established session cookies.

---

Last Update:- 06/04/2026
Agent name:- doc-updater
Author:- Vishav Ranta
