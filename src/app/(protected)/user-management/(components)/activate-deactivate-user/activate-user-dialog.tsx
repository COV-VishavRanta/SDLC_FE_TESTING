'use client';

import {
  Button,
  Card,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
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
interface ActivateUserDialogProps {
  user: Pick<UserType, 'id' | 'name' | 'email' | 'roles'>;
  onClose: () => void;
}

/* ─── Activate User Dialog ─── */
export function ActivateUserDialog({ user, onClose }: ActivateUserDialogProps) {
  const t = useTranslations('userManagement');
  const tRoles = useTranslations('roles');
  const { handleActivateUser } = useContext(UserManagementContext);
  const [constraintsName, setConstraintsName] = useState<string[] | null>(null);

  const [toggleUserActiveStatus, { loading: toggleLoading }] = useMutation<
    ToggleUserActiveStatusResponse,
    ToggleUserActiveStatusArguments
  >(TOGGLE_USER_ACTIVE_STATUS);

  const handleActivate = async () => {
    await toggleUserActiveStatus({
      variables: {
        input: {
          userId: user.id,
          isActive: true,
        },
      },
      onCompleted(data) {
        if (data.toggleUserActiveStatus.success) {
          toast.success(t('messages.success.userActivated'));
          onClose();
          handleActivateUser();
        } else {
          setConstraintsName(data.toggleUserActiveStatus.constraintNames);
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
        <div className='flex items-start justify-between gap-5 px-8 py-6'>
          <div className='flex flex-1 flex-col gap-7'>
            <DialogTitle className='text-[20px] font-semibold leading-normal text-[var(--neutral-900)]'>
              {t('activateDialog.title')}
            </DialogTitle>
            <DialogDescription className='text-[14px] font-normal leading-5 tracking-[-0.15px] text-[var(--neutral-500)]'>
              {t('activateDialog.description')}
            </DialogDescription>
          </div>
        </div>

        {/* Divider */}
        <div className='h-px w-full bg-[var(--neutral-300)]' />

        {/* ── Body ── */}
        <div className='flex flex-col gap-5 px-8 py-6'>
          {/* User Info Card */}
          <Card className='flex flex-col gap-3 rounded-lg border border-[var(--neutral-300)] bg-[var(--neutral-200)] px-3 py-3'>
            <p className='text-[16px] font-medium leading-5 tracking-[-0.15px] text-[var(--neutral-900)]'>
              {user.name}
            </p>
            <p className='text-[14px] font-medium leading-5 tracking-[-0.15px] text-[var(--activate-green-from)]'>
              {user?.roles?.[0]?.name ? `${getRoleLabel(user.roles[0].name, tRoles)} • ` : ''}
              {user.email}
            </p>
          </Card>

          {/* Campaign Names Error */}
          {constraintsName !== null && (
            <div
              role='alert'
              aria-atomic='true'
              className='flex gap-3 rounded-lg border border-red-300 bg-red-50 px-4 py-3'
            >
              <div className='flex flex-col gap-1'>
                <p className='text-[13px] leading-[19px] text-red-600'>
                  {t('activateDialog.entityNamesError.description')}
                </p>
                <ul
                  className='mt-1 list-inside list-disc space-y-0.5'
                  aria-label={t('activateDialog.entityNamesError.entityNamesListLabel')}
                >
                  {constraintsName.map((name) => (
                    <li key={name} className='text-[13px] font-bold leading-[19px] text-red-600'>
                      {name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className='flex items-center gap-[17px]'>
            <DialogClose
              render={
                <Button
                  type='button'
                  variant='outline'
                  className='h-[43px] flex-1 rounded-lg border-[var(--neutral-300)] bg-[var(--neutral-200)] font-medium text-[var(--neutral-900)] sm:text-[16px]'
                  disabled={toggleLoading}
                >
                  {t('activateDialog.cancelButton')}
                </Button>
              }
            />
            <Button
              type='button'
              onClick={handleActivate}
              className='h-[44px] flex-1 rounded-lg bg-gradient-to-b from-[var(--activate-green-from)] to-[var(--activate-green-to)] font-medium text-white hover:from-[#2D7A2F] hover:to-[#1e5e20] sm:text-[16px]'
              isLoading={toggleLoading}
              disabled={toggleLoading || constraintsName !== null}
            >
              {t('activateDialog.submitButton')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
