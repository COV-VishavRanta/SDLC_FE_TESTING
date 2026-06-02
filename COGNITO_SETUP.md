# AWS Cognito Setup

This project uses **AWS Cognito User Pools** for passwordless email OTP authentication. Below are the steps to create a new user pool and configure it with our system.

---

## Prerequisites

- AWS account with access to the Cognito console
- Access to AWS Secrets Manager for updating frontend and backend secrets

---

## Creating a New User Pool

1. **Log in** to the AWS Cognito console:
   [https://us-west-2.console.aws.amazon.com/cognito/v2/home?region=us-west-2](https://us-west-2.console.aws.amazon.com/cognito/v2/home?region=us-west-2)

2. In the left sidebar menu, click **User pools**.

3. Click **Create user pool**.

4. Configure the following settings:

   | Setting                  | Value                         |
   | ------------------------ | ----------------------------- |
   | **Application type**     | Single Page Application (SPA) |
   | **Application name**     | Your application name         |
   | **Configuration option** | Email                         |

5. Click **Create user directory**.

This creates a user pool with the name you provided.

---

## Retrieving Required IDs

After creation, you need two values to connect the user pool to our system:

### User Pool ID

1. Navigate to the **Overview** page of the newly created user pool.
2. Copy the **User Pool ID** (format: `us-west-2_XXXXXXXXX`).

### Client ID

1. Navigate to the **App clients** page of the user pool.
2. Copy the **Client ID**.

---

## Updating Secrets Manager

Once you have both IDs, update them in **AWS Secrets Manager** for both the frontend and backend:

| Secret Key                         | Value         |
| ---------------------------------- | ------------- |
| `NEXT_PUBLIC_COGNITO_USER_POOL_ID` | User Pool ID  |
| `NEXT_PUBLIC_COGNITO_CLIENT_ID`    | Client ID     |
| `COGNITO_REGION`                   | AWS Region    |
| `COGNITO_USER_POOL_ID`             | User Pool ID  |
| `COGNITO_APP_CLIENT_ID`            | App Client ID |

> **Note:** Both the frontend and backend secrets must be updated for the system to work correctly.

---

## Editing an Existing User Pool

1. Go to the [Cognito console](https://us-west-2.console.aws.amazon.com/cognito/v2/home?region=us-west-2).
2. Click **User pools** in the left sidebar.
3. Select the user pool you want to modify.
4. Edit the configuration based on your requirements.

---
