'use client';

import { Button, EmailIcon, Input } from '@/components';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
  BRAND_ID_COOKIE_NAME,
  LoginRedirectReason,
  PSP_ID_COOKIE_NAME,
  STORE_ID_COOKIE_NAME,
  USER_ROLE_COOKIE_NAME,
} from '@/constant';
import { sendLoginOtp, signOutUser } from '@/lib/amplify';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { LoginSchema, type LoginFormData } from '../auth.schema';

interface LoginFormProps {
  onSuccess: (email: string) => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const t = useTranslations('auth.layout.loginForm');
  const tErrors = useTranslations('auth.layout.errors');

  const router = useRouter();
  const pathname = usePathname();

  // get search params
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason');
  const emailParam = searchParams.get('email');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: emailParam ?? '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    const result = await sendLoginOtp(data.email);

    if (result.success) {
      // remove all search params from url after successful login to prevent confusion for users and to have a clean url when user is redirected back from verification page
      const params = new URLSearchParams(searchParams.toString());

      // Remove specific params
      params.delete('email');
      params.delete('reason');

      router.replace(`${pathname}?${params.toString()}`);

      // OTP sent successfully, trigger callback to show verification form
      onSuccess(data.email);
    } else {
      setError('email', {
        message: result.error ?? 'unexpected_error',
      });
    }
  };

  // on Load of this component, we need to call logout function from amplify to clear any existing session. This is to handle the case where we logout from the app, but amplify session is still active, which can cause issues with login flow.
  // We need to do this approach because there was no way to logout cognito session cookies if next js server actions needs to logout from backend as well to clear httpOnly cookies, and we want to avoid the scenario where backend cookies are cleared but cognito session is still active, which can cause confusion for users and potential security issues.
  useEffect(() => {
    signOutUser();

    //  remove all session cookies on load of login page to clear any existing session
    //  that might interfere with the login flow and cause issues with authorization after login
    document.cookie = `${USER_ROLE_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
    document.cookie = `${PSP_ID_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
    document.cookie = `${BRAND_ID_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
    document.cookie = `${STORE_ID_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;

    // Clear the idle-timeout activity timestamp so a fresh login starts clean
    localStorage.removeItem('pop_last_active_at');
  }, []);

  const reasonMessages = useMemo<Record<LoginRedirectReason, string>>(
    () => ({
      [LoginRedirectReason.SESSION_EXPIRED]: t('reasons.session_expired'),
      [LoginRedirectReason.AUTHENTICATION_FAILED]: t('reasons.authentication_failed'),
      [LoginRedirectReason.INV_TOKEN]: t('reasons.INV_TOKEN'),
      [LoginRedirectReason.INV_TOKEN_INVALID]: t('reasons.INV_TOKEN_INVALID'),
      [LoginRedirectReason.INV_TOKEN_EXPIRED]: t('reasons.INV_TOKEN_EXPIRED'),
      [LoginRedirectReason.INV_USER_INACTIVE]: t('reasons.INV_USER_INACTIVE'),
      [LoginRedirectReason.INV_USER_DELETED]: t('reasons.INV_USER_DELETED'),
      [LoginRedirectReason.USER_NOT_FOUND]: t('reasons.USER_NOT_FOUND'),
      [LoginRedirectReason.IDLE_TIMEOUT]: t('reasons.idle_timeout'),
    }),
    [t],
  );

  // Show a success toast when the user lands here after email verification.
  useEffect(() => {
    if (emailParam !== null) {
      requestAnimationFrame(() => {
        toast.success(t('emailVerified'));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailParam]);

  // If the user is redirected to the login page with a reason query param (set by the
  // backend at various stages), show a localised toast message. This covers session
  // expiry, invalid/expired tokens, deactivated/deleted accounts, and more.
  useEffect(() => {
    if (reason !== null && reason in reasonMessages) {
      requestAnimationFrame(() => {
        toast.error(reasonMessages[reason as LoginRedirectReason]);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reason]);

  return (
    <div className='max-w-[520px]'>
      {/* Form header */}
      <div className='mb-6 sm:mb-8 lg:mb-10'>
        <div className='w-[50px] sm:w-[60px] h-[4px] bg-[#fab95b] rounded-full mb-3 sm:mb-4' />
        <h2 className='text-[24px] sm:text-[28px] lg:text-[32px] font-bold leading-[32px] sm:leading-[36px] lg:leading-[40px] text-[#1a1d21] tracking-[0.3955px] mb-2'>
          {t('title')}
        </h2>
        <p className='text-[14px] sm:text-[16px] font-normal leading-[20px] sm:leading-[24px] text-[var(--gray-600)] tracking-[-0.3125px]'>
          {t('subTitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 sm:space-y-5 lg:space-y-[24px]'>
        {/* Email */}
        <Field>
          <FieldLabel
            htmlFor='email'
            className='text-[14px] font-medium leading-[20px] text-[#1a1d21] tracking-[-0.1504px] mb-2'
          >
            {t('emailLabel')}
          </FieldLabel>
          <div className='relative'>
            <div
              className='absolute left-4 top-[56%] -translate-y-1/2 w-5 h-5 text-[var(--gray-400)]'
              aria-hidden='true'
            >
              <EmailIcon />
            </div>
            <Input
              id='email'
              type='email'
              autoComplete='email'
              placeholder={t('emailPlaceholder')}
              disabled={isSubmitting}
              aria-invalid={!!(errors.email ?? errors.root)}
              aria-describedby={
                errors.email ? 'email-error' : errors.root ? 'email-root-error' : undefined
              }
              className='h-[44px] sm:h-[48px] lg:h-[50px] pl-[44px] sm:pl-[48px] pr-4 rounded-[12px] sm:rounded-[14px] border-[rgba(229,231,235,0.92)] bg-[#f9fafb] text-[14px] sm:text-[16px] tracking-[-0.3125px] placeholder:text-[var(--gray-400)] shadow-[0px_0px_0px_0.159px_rgba(0,136,204,0.08)]'
              {...register('email')}
            />
          </div>
          <FieldError
            id='email-error'
            className='text-[13px] sm:text-[14px] mt-[0.25rem]'
            errors={
              errors?.email?.message
                ? [{ message: tErrors(errors.email.message as Parameters<typeof tErrors>[0]) }]
                : []
            }
          />
          <FieldError
            id='email-root-error'
            className='text-[13px] sm:text-[14px] mt-[0.25rem]'
            errors={
              errors?.root?.message
                ? [{ message: tErrors(errors.root.message as Parameters<typeof tErrors>[0]) }]
                : []
            }
          />
        </Field>

        {/* Info Box */}
        <div className='bg-[#F7F9FB] border border-[#F7F9FB] rounded-[12px] sm:rounded-[14px] p-4 sm:p-[17px]'>
          <p className='text-[13px] sm:text-[14px] font-normal leading-[20px] text-[#005F8C] tracking-[-0.1504px]'>
            {t('infoBox')}
          </p>
        </div>

        {/* Send Verification Code Button */}
        {/* sr-only live region announces loading state to screen readers (WCAG 4.1.3) */}
        <div aria-live='polite' aria-atomic='true' className='sr-only'>
          {isSubmitting ? t('sendingCode') : null}
        </div>
        <Button type='submit' className='w-full h-[44px] sm:h-[48px]' isLoading={isSubmitting}>
          {isSubmitting ? 'Sending...' : t('sendCodeButton')}
        </Button>
      </form>
    </div>
  );
}
