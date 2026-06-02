import {
  AuthErrorCode,
  BRAND_ID_COOKIE_NAME,
  PROTECTED_ROOT_ROUTE,
  PSP_ID_COOKIE_NAME,
  STORE_ID_COOKIE_NAME,
  USER_ROLE_COOKIE_NAME,
} from '@/constant';
import { LOGIN, LoginResponse, LoginVariables } from '@/graphql';

import { resendLoginOtp, signOutUser, verifyLoginOtp } from '@/lib/amplify';
import { CombinedGraphQLErrors, ServerError, ServerParseError } from '@apollo/client/errors';
import { useMutation } from '@apollo/client/react';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useReducer, useTransition } from 'react';

import { VerificationFormProps } from './VerificationForm';

const OTP_LENGTH = 8;
const RESEND_COOLDOWN = 60; // 60 seconds cooldown

type VerificationFormParams = Pick<VerificationFormProps, 'email'>;

// Consolidated state type
type FormState = {
  otpValue: string;
  // error can only be values of all keys of AuthErrorCode enum
  error: AuthErrorCode | '';
  successMessage: string;
  resendCooldown: number;
  isAllFieldsDisabled: boolean;
};

// Action types for state updates
type FormAction =
  | { type: 'SET_OTP'; value: string }
  | { type: 'SET_ERROR'; error: AuthErrorCode | '' }
  | { type: 'SET_SUCCESS'; message: string }
  | { type: 'CLEAR_MESSAGES' }
  | { type: 'SET_RESEND_COOLDOWN'; cooldown: number }
  | { type: 'DECREMENT_COOLDOWN' }
  | { type: 'DISABLE_ALL_FIELDS'; disabled: boolean }
  | { type: 'RESET_OTP' };

// Reducer function for state management
function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_OTP':
      return { ...state, otpValue: action.value, error: '', successMessage: '' };
    case 'SET_ERROR':
      return { ...state, error: action.error, successMessage: '' };
    case 'SET_SUCCESS':
      return { ...state, successMessage: action.message, error: '', otpValue: '' };
    case 'CLEAR_MESSAGES':
      return { ...state, error: '', successMessage: '' };
    case 'SET_RESEND_COOLDOWN':
      return { ...state, resendCooldown: action.cooldown };
    case 'DECREMENT_COOLDOWN':
      return { ...state, resendCooldown: Math.max(0, state.resendCooldown - 1) };
    case 'DISABLE_ALL_FIELDS':
      return { ...state, isAllFieldsDisabled: action.disabled };
    case 'RESET_OTP':
      return { ...state, otpValue: '' };
    default:
      return state;
  }
}

const initialState: FormState = {
  otpValue: '',
  error: '',
  successMessage: '',
  resendCooldown: RESEND_COOLDOWN,
  isAllFieldsDisabled: false,
};

export default function useVerificationForm({ email }: VerificationFormParams) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect');
  const translateError = useTranslations('auth.layout.errors');
  const translateSuccess = useTranslations('auth.layout.success');

  const t = useTranslations('auth.layout.verificationForm');

  const [state, dispatch] = useReducer(formReducer, initialState);

  // Use transitions for async operations
  const [isVerifying, startVerifyTransition] = useTransition();
  const [isResending, startResendTransition] = useTransition();

  // Compute translated messages (React Compiler will memoize automatically)
  const translatedError = state.error
    ? translateError(state.error as Parameters<typeof translateError>[0])
    : '';
  const translatedSuccess = state.successMessage
    ? translateSuccess(state.successMessage as Parameters<typeof translateSuccess>[0])
    : '';

  // Computed disabled states (React Compiler will auto-memoize)
  const isInputDisabled = isVerifying || state.isAllFieldsDisabled;
  const isVerifyDisabled =
    state.otpValue.length !== OTP_LENGTH ||
    isInputDisabled ||
    state.error?.includes(AuthErrorCode.TOO_MANY_ATTEMPTS) ||
    state.error?.includes(AuthErrorCode.CODE_EXPIRED);
  const isResendDisabled = state.resendCooldown > 0 || isResending || isInputDisabled;

  const [loginMutation] = useMutation<LoginResponse, LoginVariables>(LOGIN);

  const handleVerify = () => {
    // Basic validation
    if (state.otpValue.length !== OTP_LENGTH) {
      dispatch({ type: 'SET_ERROR', error: AuthErrorCode.INCOMPLETE_CODE });
      return;
    }

    // Use transition for verification operation
    startVerifyTransition(async () => {
      dispatch({ type: 'CLEAR_MESSAGES' });

      // Verify OTP via Amplify
      const result = await verifyLoginOtp(state.otpValue);

      // Handle verification result
      if (!(result.success && result.tokens)) {
        // verification failed
        dispatch({
          type: 'SET_ERROR',
          error: (result.error as AuthErrorCode) ?? AuthErrorCode.VERIFICATION_FAILED,
        });

        // If too many attempts, disable input and show specific message
        if (result.error === AuthErrorCode.TOO_MANY_ATTEMPTS) {
          dispatch({ type: 'RESET_OTP' });
          dispatch({ type: 'SET_RESEND_COOLDOWN', cooldown: RESEND_COOLDOWN });
        }
      } else {
        // verification succeeded
        try {
          // Send tokens to backend via GraphQL mutation
          const mutationResult = await loginMutation({
            variables: {
              input: {
                idToken: result.tokens.idToken,
                accessToken: result.tokens.accessToken,
              },
            },
          });

          if (mutationResult.data?.login.authenticated) {
            // Set the USER_ROLE cookie from the first role in the login response
            const roleName = mutationResult.data.login.user?.roles?.[0]?.name;
            if (roleName) {
              document.cookie = `${USER_ROLE_COOKIE_NAME}=${roleName}; path=/; max-age=31536000; SameSite=Lax`;
            }
            const selectedPspId = mutationResult.data.login.user?.psps?.[0]?.id;
            if (selectedPspId) {
              document.cookie = `${PSP_ID_COOKIE_NAME}=${selectedPspId}; path=/; max-age=31536000; SameSite=Lax`;
            }
            const selectedBrandId = mutationResult.data.login.user?.brands?.[0]?.id;
            if (selectedBrandId) {
              document.cookie = `${BRAND_ID_COOKIE_NAME}=${selectedBrandId}; path=/; max-age=31536000; SameSite=Lax`;
            }
            const selectedStoreId = mutationResult.data.login.user?.stores?.[0]?.id;
            if (selectedStoreId) {
              document.cookie = `${STORE_ID_COOKIE_NAME}=${selectedStoreId}; path=/; max-age=31536000; SameSite=Lax`;
            }

            // Navigate to last logged-in page (get from the redirect parameter) or dashboard
            if (redirectParam) {
              router.push(redirectParam);
            } else {
              router.push(PROTECTED_ROOT_ROUTE);
            }
          } else {
            dispatch({ type: 'SET_ERROR', error: AuthErrorCode.VERIFICATION_FAILED });
            dispatch({ type: 'DISABLE_ALL_FIELDS', disabled: true });
          }
        } catch (apolloError: unknown) {
          // if this happens that means the OTP was correct but there was an issue with the backend exchange, so we need to disable every button except the back to login button and show a specific error message
          if (
            CombinedGraphQLErrors.is(apolloError) ||
            ServerError.is(apolloError) ||
            ServerParseError.is(apolloError)
          ) {
            // You can check specific error codes from the backend
            dispatch({ type: 'SET_ERROR', error: AuthErrorCode.LOGIN_EXCHANGE_FAILED });
          } else {
            dispatch({ type: 'SET_ERROR', error: AuthErrorCode.LOGIN_EXCHANGE_FAILED });
          }
          // Sign out the user to clear any existing session that might interfere with the login flow
          signOutUser();
          dispatch({ type: 'DISABLE_ALL_FIELDS', disabled: true });
        }
      }
    });
  };

  const handleOtpChange = (value: string) => {
    dispatch({ type: 'SET_OTP', value });
  };

  const handleResendCode = () => {
    if (state.resendCooldown > 0 || isResending) {
      return;
    }

    // Use transition for resend operation
    startResendTransition(async () => {
      dispatch({ type: 'CLEAR_MESSAGES' });

      const result = await resendLoginOtp(email);

      if (result.success) {
        dispatch({ type: 'SET_SUCCESS', message: 'resend_success' });
        dispatch({ type: 'SET_RESEND_COOLDOWN', cooldown: RESEND_COOLDOWN });
      } else {
        dispatch({
          type: 'SET_ERROR',
          error: (result.error as AuthErrorCode) ?? AuthErrorCode.RESEND_FAILED,
        });
      }
    });
  };

  // Cooldown timer effect
  useEffect(() => {
    if (state.resendCooldown === 0) return;
    const interval = setInterval(() => {
      dispatch({ type: 'DECREMENT_COOLDOWN' });
    }, 1000);
    return () => clearInterval(interval);
  }, [state.resendCooldown]);

  return {
    otpValue: state.otpValue,
    t,
    translatedError,
    translatedSuccess,
    isLoading: isVerifying,
    isResending,
    resendCooldown: state.resendCooldown,
    handleOtpChange,
    handleVerify,
    handleResendCode,
    OTP_LENGTH,

    // disable states for buttons
    isVerifyDisabled,
    isResendDisabled,
    isInputDisabled,
  } as const;
}
