'use client';

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components';
import {
  RESEND_INVITATION,
  type ResendInvitationArguments,
  type ResendInvitationResponse,
} from '@/graphql';
import { getRoleLabel } from '@/lib/utils';
import { UserType } from '@/types';
import { useMutation } from '@apollo/client/react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

/* ─── Types ─── */
interface ResendInvitationDialogProps {
  user: Pick<UserType, 'id' | 'name' | 'email' | 'roles'>;
  onClose: () => void;
}

/* ─── Resend Invitation Dialog ─── */
export function ResendInvitationDialog({ user, onClose }: ResendInvitationDialogProps) {
  const t = useTranslations('userManagement.resendInvitationDialog');
  const tRoles = useTranslations('roles');

  const [resendInvitation, { loading }] = useMutation<
    ResendInvitationResponse,
    ResendInvitationArguments
  >(RESEND_INVITATION);

  const handleResend = async () => {
    await resendInvitation({
      variables: { input: { userId: user.id } },
      onCompleted: () => {
        toast.success(t('successMessage', { email: user.email }));
        onClose();
      },
    });
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        className='flex w-full flex-col gap-0 overflow-hidden rounded-xl p-0 ring-0 sm:max-w-[500px]'
      >
        {/* ── Header ── */}
        <div className='flex flex-col gap-2 border-b border-[#e5e7eb] px-5 pt-5 pb-5 sm:px-8 sm:pt-6 sm:pb-6'>
          <DialogTitle className='text-[20px] font-semibold leading-[30px] text-text-heading'>
            {t('title')}
          </DialogTitle>
          <DialogDescription className='text-[14px] font-normal leading-[21px] tracking-[-0.15px] text-text-secondary'>
            {t('description')}
          </DialogDescription>
        </div>

        {/* ── Body ── */}
        <div className='flex flex-col gap-5 px-5 pt-5 pb-6 sm:px-8 sm:pt-6 sm:pb-8'>
          {/* User Info Card */}
          <div className='flex flex-col gap-2 rounded-lg border border-[#e5e7eb] bg-input-bg px-5 py-5'>
            <p className='text-[16px] font-semibold leading-[24px] text-text-heading'>
              {user?.name}
            </p>
            <p className='text-[14px] font-normal leading-[21px] tracking-[-0.15px] text-text-secondary'>
              {user?.email} •{' '}
              {user?.roles?.[0]?.name ? getRoleLabel(user.roles[0].name, tRoles) : ''}
            </p>
          </div>

          {/* Invitation Email Info Box */}
          <div className='flex gap-3 rounded-[var(--radius-sm)] border-2 border-[var(--neutral-200)] bg-[var(--neutral-200)] p-3.5'>
            <div className='flex size-9 shrink-0 items-center justify-center rounded-lg bg-[var(--primary-500)]'>
              {/* aria-hidden: decorative icon — adjacent text explains context (WCAG 1.1.1) */}
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
            <div className='flex flex-col gap-0'>
              <p className='text-[14px] font-medium leading-5 text-[var(--primary-500)]'>
                {t('invitationEmailTitle')}
              </p>
              <p className='text-[12px] font-normal leading-5 tracking-[-0.15px] text-[var(--primary-700)]'>
                {t('invitationEmailDescription', { email: user?.email })}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex flex-col-reverse gap-3 sm:flex-row sm:items-center'>
            <DialogClose
              render={
                <Button
                  type='button'
                  variant='outline'
                  className='h-[47px] flex-1 rounded-lg border border-[#e5e7eb] bg-input-bg text-[14px] leading-[21px] text-sm text-text-secondary sm:text-[16px]'
                >
                  {t('cancelButton')}
                </Button>
              }
            />
            <Button
              type='button'
              onClick={handleResend}
              isLoading={loading}
              className='h-[45px] flex-1 rounded-lg bg-gradient-to-b from-[#005C8A] to-[#0077B3] text-[14px] font-semibold leading-[21px] text-white sm:text-[16px]'
            >
              {t('submitButton')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
