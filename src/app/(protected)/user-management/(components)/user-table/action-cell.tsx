import {
  ActionButtonCell,
  ActionCellContainer,
  EditIcon,
  KeyIcon,
  PauseCircleIcon,
  PowerIcon,
  SendIcon,
  UserDialog,
} from '@/components';
import { UserStatusEnum } from '@/constant';
import { useGlobalProtected } from '@/contexts';
import { canImpersonate } from '@/lib/permissions/impersonation.permissions';
import { UserType } from '@/types';
import { useTranslations } from 'next-intl';
import { useContext, useState } from 'react';

import { UserManagementContext } from '../../context/UserManagementContext';
import { ActivateUserDialog } from '../activate-deactivate-user/activate-user-dialog';
import { DeactivateUserDialog } from '../activate-deactivate-user/deactivate-user-dialog';
import { ImpersonateUserDialog } from '../impersonate-user/impersonate-user-dialog';
import { ResendInvitationDialog } from '../resend-invitation-dialog/resend-invitation-dialog';

interface ActionCellProps {
  row: {
    original: UserType;
  };
}

export default function ActionCell({ row }: ActionCellProps) {
  const user = row.original;
  const t = useTranslations('userManagement.actions');

  const { handleUpdateUser } = useContext(UserManagementContext);
  const { currentUserData, isImpersonating } = useGlobalProtected();

  const currentUserRole = currentUserData?.me?.roles?.[0]?.name ?? '';
  const targetUserRole = user?.roles?.[0]?.name ?? '';
  const showImpersonate =
    !isImpersonating &&
    user?.status === UserStatusEnum.ACTIVE &&
    canImpersonate(currentUserRole, targetUserRole);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);
  const [isActivateOpen, setIsActivateOpen] = useState(false);
  const [isImpersonateOpen, setIsImpersonateOpen] = useState(false);
  const [isResendOpen, setIsResendOpen] = useState(false);

  const toggleEditDialog = () => {
    setIsEditOpen((prev) => !prev);
  };

  const toggleDeactivateDialog = () => {
    setIsDeactivateOpen((prev) => !prev);
  };

  const toggleActivateDialog = () => {
    setIsActivateOpen((prev) => !prev);
  };

  const toggleImpersonateDialog = () => {
    setIsImpersonateOpen((prev) => !prev);
  };

  const toggleResendDialog = () => {
    setIsResendOpen((prev) => !prev);
  };

  return (
    <ActionCellContainer className='justify-end'>
      {/* Edit Icon */}
      {user?.status !== UserStatusEnum.INACTIVE && (
        <ActionButtonCell
          icon={<EditIcon className='size-[18px] text-primary' />}
          tooltip={t('editUser')}
          className='hover:bg-stat-icon-blue'
          onClick={toggleEditDialog}
        />
      )}

      {user?.status !== UserStatusEnum.PENDING && (
        <>
          {/* Deactivate Icon */}
          {user?.status === UserStatusEnum.ACTIVE && (
            <ActionButtonCell
              icon={<PauseCircleIcon className='size-[18px] text-text-secondary' />}
              tooltip={t('deactivateUser')}
              className='hover:bg-stat-icon-gray'
              onClick={toggleDeactivateDialog}
            />
          )}

          {/* Activate Icon */}
          {user?.status === UserStatusEnum.INACTIVE && (
            <ActionButtonCell
              icon={<PowerIcon className='size-[18px] text-badge-active-text' />}
              tooltip={t('activateUser')}
              className='hover:bg-stat-icon-green'
              onClick={toggleActivateDialog}
            />
          )}

          {/* Impersonate Icon */}
          {showImpersonate && (
            <ActionButtonCell
              icon={<KeyIcon className='size-[18px] text-icon-purple' />}
              tooltip={t('impersonateUser')}
              className='hover:bg-stat-icon-blue'
              onClick={toggleImpersonateDialog}
            />
          )}
        </>
      )}

      {user?.status === UserStatusEnum.PENDING && (
        <>
          {/* Resend Invitation Icon */}
          <ActionButtonCell
            icon={<SendIcon className='size-[18px] text-primary' />}
            tooltip={t('resendInvitation')}
            className='hover:bg-[rgba(139,92,246,0.1)]'
            onClick={toggleResendDialog}
          />
        </>
      )}

      {/* Edit User Modal */}
      {isEditOpen && (
        <UserDialog
          mode='edit'
          onSubmit={() => handleUpdateUser()}
          onClose={toggleEditDialog}
          initialData={{
            userId: user.id,
            fullName: user?.name ?? '',
            email: user?.email,
            role: user?.roles?.[0]?.id ?? '',
            pspId: user?.psps?.[0]?.id ?? '',
            brandId: user?.brands?.[0]?.id ?? '',
            storeIds:
              user?.stores?.filter((store) => store.isActive).map((store) => store.id) ?? [],
            isPending: user?.status !== UserStatusEnum.PENDING,
          }}
        />
      )}

      {/*  Deactivate Modal */}
      {isDeactivateOpen && (
        <DeactivateUserDialog
          onClose={toggleDeactivateDialog}
          user={{
            name: user?.name ?? '',
            roles: user?.roles ?? [],
            email: user?.email ?? '',
            id: user?.id ?? '',
          }}
        />
      )}

      {/*   Activate Modal */}
      {isActivateOpen && (
        <ActivateUserDialog
          onClose={toggleActivateDialog}
          user={{
            name: user?.name ?? '',
            roles: user?.roles ?? [],
            email: user?.email ?? '',
            id: user.id,
          }}
        />
      )}

      {/*  Impersonate Modal */}
      {isImpersonateOpen && showImpersonate && (
        <ImpersonateUserDialog
          onClose={toggleImpersonateDialog}
          user={{
            name: user.name,
            email: user.email,
            roles: user.roles,
            id: user.id,
          }}
        />
      )}

      {/* Resend Invitation Modal */}
      {isResendOpen && (
        <ResendInvitationDialog
          onClose={toggleResendDialog}
          user={{ name: user.name, email: user.email, roles: user.roles, id: user.id }}
        />
      )}
    </ActionCellContainer>
  );
}
