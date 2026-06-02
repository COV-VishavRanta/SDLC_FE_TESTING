'use client';

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  InfoCircleIcon,
} from '@/components';
import {
  DELETE_USER,
  DeleteUserArguments,
  DeleteUserResponse,
  UPDATE_USER,
  UpdateUserArguments,
  UpdateUserResponse,
} from '@/graphql';
import { UserType } from '@/types';
import { useMutation } from '@apollo/client/react';
import { useTranslations } from 'next-intl';
import { useContext } from 'react';
import { toast } from 'sonner';

import { UserManagementContext } from '../../context/UserManagementContext';

/* ─── Types ─── */
interface DeleteUserDialogProps {
  user: Pick<UserType, 'id' | 'name' | 'email' | 'roles'>;
  onClose: () => void;
}

/* ─── Delete User Dialog ─── */
export function DeleteUserDialog({ user, onClose }: DeleteUserDialogProps) {
  const t = useTranslations('userManagement');
  const { handleDeactivateUser, handleDeleteUser } = useContext(UserManagementContext);

  const [deleteUser, { loading: deleteLoading }] = useMutation<
    DeleteUserResponse,
    DeleteUserArguments
  >(DELETE_USER);

  const [updateUser, { loading: updateLoading }] = useMutation<
    UpdateUserResponse,
    UpdateUserArguments
  >(UPDATE_USER);

  const loading = deleteLoading || updateLoading;

  const handleDeactivate = async () => {
    await updateUser({
      variables: {
        input: {
          userId: user.id,
          email: user.email,
          fullName: user.name ?? '',
          roleIds: user.roles?.map((role) => role.id) ?? [],
        },
      },
      onCompleted() {
        toast.success(t('messages.success.userDeactivated'));

        // Close dialog
        handleDeactivateUser();
        onClose();
      },
    });
  };

  const handleDelete = async () => {
    await deleteUser({
      variables: {
        input: {
          userId: user.id,
        },
      },
      onCompleted() {
        toast.success(t('messages.success.userDeleted'));
        handleDeleteUser();
        onClose();
      },
    });
  };

  return (
    <Dialog open onOpenChange={onClose} disablePointerDismissal={loading}>
      <DialogContent
        showCloseButton={false}
        className='flex w-full flex-col gap-0 overflow-hidden rounded-xl p-0 ring-0 sm:max-w-[500px]'
      >
        {/* ── Header ── */}
        <div className='flex flex-col gap-2 border-b border-[#e5e7eb] px-5 pt-5 pb-5 sm:px-8 sm:pt-6 sm:pb-6'>
          <DialogTitle className='text-[20px] font-semibold leading-[30px] text-text-heading'>
            {t('deleteDialog.title')}
          </DialogTitle>
          <DialogDescription className='text-[14px] font-normal leading-[21px] tracking-[-0.15px] text-text-secondary'>
            {t('deleteDialog.description')}
          </DialogDescription>
        </div>

        {/* ── Body ── */}
        <div className='flex flex-col gap-0 px-5 pt-5 sm:px-8 sm:pt-6'>
          {/* User Info Card */}
          <div className='flex flex-col gap-2 rounded-lg border border-[#e5e7eb] bg-input-bg px-5 py-5'>
            <p className='text-[16px] font-semibold leading-[24px] text-text-heading'>
              {user.name}
            </p>
            <p className='text-[14px] font-normal leading-[21px] tracking-[-0.15px] text-text-secondary'>
              {user.roles?.[0]?.name} • {user.email}
            </p>
          </div>

          {/* Recommended Info Box */}
          <div className='mt-5 flex gap-3 rounded-lg border border-dialog-info-border bg-dialog-info-bg px-4 py-4'>
            <div className='flex size-8 shrink-0 items-center justify-center rounded-md bg-dialog-info-icon-bg'>
              {/* aria-hidden: decorative icon — adjacent text explains context (WCAG 1.1.1) */}
              <InfoCircleIcon className='size-4 text-primary' aria-hidden='true' />
            </div>
            <div className='flex flex-col gap-1'>
              <p className='text-[14px] font-semibold leading-[21px] text-text-heading'>
                {t('deleteDialog.recommendedTitle')}
              </p>
              <p className='text-[13px] font-normal leading-[19.5px] tracking-[-0.08px] text-text-secondary'>
                {t('deleteDialog.recommendedDescription')}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:items-center'>
            <DialogClose
              render={
                <Button
                  type='button'
                  variant='outline'
                  className='h-[47px] flex-1 sm:text-[16px]'
                  disabled={loading}
                >
                  {t('deleteDialog.cancelButton')}
                </Button>
              }
            />
            <Button
              type='button'
              onClick={handleDeactivate}
              disabled={loading}
              className='h-[45px] flex-1 sm:text-[16px]'
            >
              {t('deleteDialog.deactivateButton')}
            </Button>
          </div>

          {/* Separator + Permanent Delete */}
          <div className='mt-4 flex flex-col gap-3 border-t border-[#e5e7eb] pt-4 pb-6'>
            <p className='text-center text-[12px] font-normal leading-[18px] text-text-secondary'>
              {t('deleteDialog.permanentDeleteWarning')}
            </p>
            <Button
              type='button'
              variant='destructive'
              onClick={handleDelete}
              isLoading={loading}
              className='w-full'
            >
              {t('deleteDialog.deleteButton')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
