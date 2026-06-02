import { AuthErrorCode } from '@/constant';
import { confirmSignIn, fetchAuthSession, signIn, signOut } from 'aws-amplify/auth';

/**
 * Send OTP to user's email for password-less login
 * @param email - User's email address
 * @returns Object with success status and optional error message
 */
export async function sendLoginOtp(email: string): Promise<{
  success: boolean;
  error?: string;
  nextStep?: string;
}> {
  try {
    const res = await signIn({
      username: email,
      options: {
        authFlowType: 'USER_AUTH',
        preferredChallenge: 'EMAIL_OTP',
      },
    });

    if (res.nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_EMAIL_CODE') {
      return {
        success: true,
        nextStep: res.nextStep.signInStep,
      };
    }

    return {
      success: false,
      error: AuthErrorCode.EMAIL_NOT_REGISTERED,
    };
  } catch (err) {
    // Handle specific Amplify/Cognito errors
    if (err instanceof Error) {
      if (err.message.includes('User does not exist')) {
        return {
          success: false,
          error: AuthErrorCode.EMAIL_NOT_REGISTERED,
        };
      }
      if (err.message.includes('Too many invalid') || err.message.includes('exceeded')) {
        return {
          success: false,
          error: AuthErrorCode.TOO_MANY_ATTEMPTS,
        };
      }
      if (err.message.toLowerCase().includes('disable')) {
        return {
          success: false,
          error: AuthErrorCode.USER_DISABLED,
        };
      }
      return {
        success: false,
        error: AuthErrorCode.UNEXPECTED_ERROR,
      };
    }

    return {
      success: false,
      error: AuthErrorCode.UNEXPECTED_ERROR,
    };
  }
}

/**
 * Verify OTP code sent to user's email
 * @param code - 8-digit OTP code entered by user
 * @returns Object with success status, optional error message, and tokens if successful
 */
export async function verifyLoginOtp(code: string): Promise<{
  success: boolean;
  error?: string;
  session?: Awaited<ReturnType<typeof fetchAuthSession>>;
  tokens?: {
    accessToken: string;
    idToken: string;
  };
}> {
  try {
    const res = await confirmSignIn({
      challengeResponse: code,
    });

    if (res.isSignedIn) {
      // Fetch the auth session to get tokens
      const session = await fetchAuthSession();

      if (!session?.tokens) {
        return {
          success: false,
          error: AuthErrorCode.SESSION_RETRIEVAL_FAILED,
        };
      }

      // Extract all tokens as strings
      const accessToken = session.tokens.accessToken?.toString();
      const idToken = session.tokens.idToken?.toString();

      if (!accessToken || !idToken) {
        return {
          success: false,
          error: AuthErrorCode.SESSION_RETRIEVAL_FAILED,
        };
      }

      return {
        success: true,
        session,
        tokens: {
          accessToken,
          idToken,
        },
      };
    }

    return {
      success: false,
      error: AuthErrorCode.VERIFICATION_FAILED,
    };
  } catch (err) {
    // Handle specific Amplify/Cognito errors
    if (err instanceof Error) {
      if (err.message.includes('Invalid code') || err.message.includes('Code mismatch')) {
        return {
          success: false,
          error: AuthErrorCode.INVALID_CODE,
        };
      }
      if (err.message.includes('expired')) {
        return {
          success: false,
          error: AuthErrorCode.CODE_EXPIRED,
        };
      }
      if (err.message.includes('Too many invalid') || err.message.includes('exceeded')) {
        return {
          success: false,
          error: AuthErrorCode.TOO_MANY_ATTEMPTS,
        };
      }
      if (err.message.toLowerCase().includes('disable')) {
        return {
          success: false,
          error: AuthErrorCode.USER_DISABLED,
        };
      }
      return {
        success: false,
        error: AuthErrorCode.VERIFICATION_FAILED,
      };
    }

    return {
      success: false,
      error: AuthErrorCode.UNEXPECTED_ERROR,
    };
  }
}

/**
 * Resend OTP code to user's email
 * @param email - User's email address
 * @returns Object with success status and optional error message
 */
export async function resendLoginOtp(email: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const res = await signIn({
      username: email,
      options: {
        authFlowType: 'USER_AUTH',
        preferredChallenge: 'EMAIL_OTP',
      },
    });

    if (res.nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_EMAIL_CODE') {
      return {
        success: true,
      };
    }

    return {
      success: false,
      error: AuthErrorCode.RESEND_FAILED,
    };
  } catch (err) {
    // Handle specific Amplify/Cognito errors
    if (err instanceof Error) {
      if (
        err.message.includes('exceeded') ||
        err.message.includes('Limit') ||
        err.message.includes('Too many invalid')
      ) {
        return {
          success: false,
          error: AuthErrorCode.RESEND_LIMIT_EXCEEDED,
        };
      }
      if (err.message.toLowerCase().includes('disable')) {
        return {
          success: false,
          error: AuthErrorCode.USER_DISABLED,
        };
      }
      return {
        success: false,
        error: AuthErrorCode.RESEND_FAILED,
      };
    }

    return {
      success: false,
      error: AuthErrorCode.UNEXPECTED_ERROR,
    };
  }
}

/**
 * Sign out the current user
 * @returns Object with success status and optional error message
 */
export async function signOutUser(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await signOut();
    return {
      success: true,
    };
  } catch (err) {
    if (err instanceof Error) {
      return {
        success: false,
        error: AuthErrorCode.SIGNOUT_FAILED,
      };
    }

    return {
      success: false,
      error: AuthErrorCode.SIGNOUT_FAILED,
    };
  }
}
