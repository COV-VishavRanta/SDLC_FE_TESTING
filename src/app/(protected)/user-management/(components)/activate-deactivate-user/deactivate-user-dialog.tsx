'use client';

import {
  Button,
  Card,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components';
import {
  TOGGLE_USER_ACTIVE_STATUS,
  ToggleUserActiveStatusArguments,
  ToggleUserActiveStatusResponse,
} from '@/graphql';
import { getRoleLabel } from '@/lib/utils';
import { UserType } from '@/types';
import { useMutation } from '@apollo/client/react';
import { useTranslations } from 'next-intl';
import { useContext, useState } from 'react';
import { toast } from 'sonner';

import { UserManagementContext } from '../../context/UserManagementContext';

/* ─── Types ─── */

interface DeactivateUserDialogProps {
  user: Pick<UserType, 'id' | 'name' | 'email' | 'roles'>;
  onClose: () => void;
}

/* ─── Deactivate User Dialog ─── */
export function DeactivateUserDialog({ user, onClose }: DeactivateUserDialogProps) {
  const t = useTranslations('userManagement');
  const tRoles = useTranslations('roles');
  const { handleDeactivateUser } = useContext(UserManagementContext);
  const [campaignNames, setCampaignNames] = useState<string[] | null>(null);
  const [toggleUserActiveStatus, { loading: toggleLoading }] = useMutation<
    ToggleUserActiveStatusResponse,
    ToggleUserActiveStatusArguments
  >(TOGGLE_USER_ACTIVE_STATUS);

  const handleDeactivate = async () => {
    await toggleUserActiveStatus({
      variables: {
        input: {
          userId: user.id,
          isActive: false,
        },
      },
      onCompleted(data) {
        if (data.toggleUserActiveStatus.success) {
          toast.success(t('messages.success.userDeactivated'));
          onClose();
          handleDeactivateUser();
        } else {
          setCampaignNames(data.toggleUserActiveStatus.constraintNames);
        }
      },
    });
  };

  return (
    <Dialog open onOpenChange={onClose} disablePointerDismissal={toggleLoading}>
      <DialogContent
        showCloseButton
        className='flex w-full flex-col gap-0 overflow-hidden rounded-xl p-0 ring-0 sm:max-w-[600px]'
      >
        {/* ── Header ── */}
        <DialogHeader className='border-b border-[var(--neutral-300)] px-8 py-6'>
          <div className='flex items-start justify-between gap-5'>
            <div className='flex flex-col gap-2'>
              <DialogTitle className='text-[20px] font-semibold leading-normal text-[var(--neutral-900)]'>
                {t('deactivateDialog.title')}
              </DialogTitle>
              <DialogDescription className='text-[14px] font-normal leading-5 tracking-[-0.15px] text-[var(--neutral-500)]'>
                {t('deactivateDialog.description')}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* ── Body ── */}
        <div className='flex flex-col gap-5 px-8 py-6'>
          {/* User Info Card */}
          <Card className='gap-3 rounded-lg border border-[var(--neutral-300)] bg-[var(--neutral-200)] px-3 py-3'>
            <p className='text-[16px] font-medium leading-5 text-[var(--neutral-900)]'>
              {user.name}
            </p>
            <p className='text-[14px] font-medium leading-5 tracking-[-0.15px] text-[var(--neutral-500)]'>
              {user?.roles?.[0]?.name ? getRoleLabel(user.roles[0].name, tRoles) : ''} •{' '}
              {user.email}
            </p>
          </Card>

          {/* Campaign Names Error */}
          {campaignNames !== null && (
            <div
              role='alert'
              aria-atomic='true'
              className='flex gap-3 rounded-lg border border-red-300 bg-red-50 px-4 py-3'
            >
              <div className='flex flex-col gap-1'>
                <p className='text-[13px] leading-[19px] text-red-600'>
                  {t('deactivateDialog.campaignNamesError.description')}
                </p>
                <ul
                  className='mt-1 list-inside list-disc space-y-0.5'
                  aria-label={t('deactivateDialog.campaignNamesError.campaignsListLabel')}
                >
                  {campaignNames.map((name) => (
                    <li key={name} className='text-[13px] font-bold leading-[19px] text-red-600'>
                      {name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className='flex flex-col-reverse gap-3 sm:flex-row sm:items-center'>
            <DialogClose
              render={
                <Button
                  type='button'
                  variant='outline'
                  className='h-[43px] flex-1 rounded-lg border-[var(--neutral-300)] bg-[var(--neutral-200)] font-medium text-[var(--neutral-900)] sm:text-[16px]'
                  disabled={toggleLoading}
                >
                  {t('deactivateDialog.cancelButton')}
                </Button>
              }
            />
            <Button
              type='button'
              onClick={handleDeactivate}
              className='h-[44px] flex-1 rounded-lg bg-gradient-to-b from-[var(--deactivate-btn-from)] to-[var(--deactivate-btn-to)] font-medium text-white hover:from-[var(--deactivate-btn-hover-from)] hover:to-[var(--deactivate-btn-hover-to)] disabled:pointer-events-auto disabled:cursor-not-allowed disabled:text-white! sm:text-[16px]'
              isLoading={toggleLoading}
              disabled={toggleLoading || campaignNames !== null}
            >
              {t('deactivateDialog.submitButton')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
