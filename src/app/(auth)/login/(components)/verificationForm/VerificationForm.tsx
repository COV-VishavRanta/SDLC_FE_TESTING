'use client';

import {
  ArrowLeftIcon,
  Button,
  ErrorIcon,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  Label,
} from '@/components';
import { REGEXP_ONLY_DIGITS } from 'input-otp';

import useVerificationForm from './useVerificationForm';

export interface VerificationFormProps {
  email: string;
  onBack?: () => void;
}

export default function VerificationForm({ email, onBack }: VerificationFormProps) {
  const {
    otpValue,
    t,
    translatedError,
    translatedSuccess,
    isLoading,
    isResending,
    resendCooldown,
    handleOtpChange,
    handleVerify,
    handleResendCode,
    OTP_LENGTH,

    // disable states for buttons
    isVerifyDisabled,
    isResendDisabled,
    isInputDisabled,
  } = useVerificationForm({ email });

  return (
    <div className='w-full max-w-[530px]'>
      {/* Verification header */}
      <div className='mb-6 sm:mb-8 lg:mb-10'>
        <div className='w-[50px] sm:w-[60px] h-[4px] bg-[#fab95b] rounded-full mb-3 sm:mb-4' />
        <h2 className='text-[24px] sm:text-[28px] lg:text-[32px] font-bold leading-[32px] sm:leading-[36px] lg:leading-[40px] text-[#1a1d21] tracking-[0.3955px] mb-2'>
          {t('title')}
        </h2>
        <p className='text-[14px] sm:text-[16px] font-normal leading-[20px] sm:leading-[24px] text-[var(--gray-600)] tracking-[-0.3125px]'>
          {t('subTitle')}
        </p>
      </div>

      {/* Email info box */}
      <div className='bg-[var(--neutral-200)] border-2 border-[var(--neutral-200)] rounded-[8px] p-[14px] sm:p-[17px] flex items-center gap-3 mb-6 sm:mb-8 lg:mb-[30px]'>
        <div
          className='bg-[var(--primary-500)] rounded-[8px] w-[36px] h-[36px] flex items-center justify-center flex-shrink-0'
          aria-hidden='true'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='15'
            height='10'
            viewBox='0 0 15 10'
            fill='none'
            aria-hidden='true'
          >
            <path
              d='M1.66667 0C0.746192 0 0 0.746192 0 1.66667V2.63456L7.03415 6.15164C7.32741 6.29827 7.67259 6.29827 7.96585 6.15164L15 2.63456V1.66667C15 0.746192 14.2538 0 13.3333 0H1.66667Z'
              fill='white'
            />
            <path
              d='M15 4.0321L8.52486 7.26967C7.8797 7.59226 7.1203 7.59226 6.47513 7.26967L0 4.0321V8.33333C0 9.25381 0.746192 10 1.66667 10H13.3333C14.2538 10 15 9.25381 15 8.33333V4.0321Z'
              fill='white'
            />
          </svg>
        </div>
        <div>
          <p className='text-[12px] font-normal leading-[16px] text-[var(--gray-600)] tracking-[-0.1504px]'>
            {t('codeSentTo')}
          </p>
          <p className='text-[14px] font-medium leading-[20px] text-[var(--primary-500)] tracking-[-0.1504px]'>
            {email}
          </p>
        </div>
      </div>

      <form
        className='space-y-3 sm:mb-2'
        aria-label={t('title')}
        onSubmit={(e) => {
          e.preventDefault();
          if (!isVerifyDisabled) {
            handleVerify();
          }
        }}
      >
        <Label
          htmlFor='otp-input'
          className='text-[14px] font-medium leading-[20px] text-[#1a1d21] tracking-[-0.1504px]'
        >
          {t('verificationCodeLabel')}
        </Label>
        <InputOTP
          id='otp-input'
          maxLength={OTP_LENGTH}
          pattern={REGEXP_ONLY_DIGITS}
          value={otpValue}
          onChange={handleOtpChange}
          disabled={isInputDisabled}
          aria-label={t('verificationCodeLabel')}
          aria-describedby={translatedError ? 'otp-error' : undefined}
          containerClassName='w-full'
        >
          <InputOTPGroup className='w-full gap-[6px] sm:gap-[10px] md:w-auto md:mx-auto border-0'>
            {new Array(OTP_LENGTH).fill(null).map((_, i) => (
              <InputOTPSlot
                index={i}
                key={i}
                aria-disabled={isInputDisabled}
                aria-invalid={!!translatedError}
                aria-describedby={translatedError ? 'otp-error' : undefined}
                className='flex-1 aspect-square min-w-0 md:flex-none md:w-[60px] md:h-[60px] text-center text-[18px] sm:text-[24px] font-medium bg-[#f9fafb] border-2 border-[#e5e7eb] rounded-[10px] sm:rounded-[14px] data-[active=true]:border-[var(--focus-border)] data-[active=true]:ring-3 data-[active=true]:ring-[var(--focus-ring)] shadow-none has-aria-invalid:shadow-none first:rounded-[10px] sm:first:rounded-[14px] last:rounded-[10px] sm:last:rounded-[14px]'
              />
            ))}
          </InputOTPGroup>
        </InputOTP>

        {/* Error Message */}
        {translatedError && (
          <div role='alert' className='flex items-baseline gap-2 text-[#dc2626]'>
            <div className='w-4 h-4 mt-0.5 flex-shrink-0' aria-hidden='true'>
              <ErrorIcon />
            </div>
            <p id='otp-error' className='text-[13px] sm:text-[14px] leading-[20px]'>
              {translatedError}
            </p>
          </div>
        )}

        {/* Success Message */}
        {translatedSuccess && (
          <div role='status' className='flex items-start gap-2 text-[#059669]'>
            <div className='w-4 h-4 mt-0.5 flex-shrink-0' aria-hidden='true'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 20 20'
                fill='currentColor'
                className='w-4 h-4'
              >
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <p className='text-[13px] sm:text-[14px] leading-[20px]'>{translatedSuccess}</p>
          </div>
        )}

        {/* Verify Button */}
        <Button
          type='submit'
          disabled={isVerifyDisabled}
          isLoading={isLoading}
          className='mt-6 w-full h-[44px] sm:h-[48px]'
        >
          {t('verifyCodeButton')}
        </Button>
      </form>

      {/* Resend code section */}
      <div className='flex flex-row items-center justify-center gap-1'>
        <p className='text-[13px] sm:text-[14px] leading-[20px] text-[var(--neutral-500)] tracking-[-0.1504px]'>
          {t('resendCode')}
        </p>
        <Button
          type='button'
          variant='ghost'
          onClick={handleResendCode}
          disabled={isResendDisabled}
          className='text-[13px] sm:text-[14px] font-medium p-0 h-auto text-[var(--primary-400)]'
        >
          {isResending
            ? t('sendingCode')
            : resendCooldown > 0
              ? `${t('resendCodeButton')} (${resendCooldown}s)`
              : t('resendCodeButton')}
        </Button>
      </div>

      {/* Back to login button */}
      {onBack && (
        <div className='flex justify-center mb-4 sm:mb-5'>
          <Button
            onClick={onBack}
            disabled={isLoading}
            variant='ghost'
            type='button'
            className='flex items-center gap-2 text-[13px] sm:text-[14px] font-normal  text-[var(--primary-400)] tracking-[-0.1504px] hover:text-[#1a1d21]'
          >
            <div className='w-4 h-4' aria-hidden='true'>
              <ArrowLeftIcon />
            </div>
            {t('backToLogin')}
          </Button>
        </div>
      )}
    </div>
  );
}
