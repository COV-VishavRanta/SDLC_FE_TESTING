'use client';

import {
  ActionButtonCell,
  ActionCellContainer,
  EditIcon,
  PauseCircleIcon,
  PowerIcon,
  PspDialog,
} from '@/components';
import { PSPType } from '@/types';
import { useTranslations } from 'next-intl';
import { useContext, useState } from 'react';

import { PspManagementContext } from '../../context/PspManagementContext';
import { ActivatePspDialog } from '../activate-deactivate-dialog/activate-psp-dialog';
import { DeactivatePspDialog } from '../activate-deactivate-dialog/deactivate-psp-dialog';
import { DeletePspDialog } from '../delete-psp/delete-psp-dialog';

interface PspActionCellProps {
  row: { original: PSPType };
}

export default function PspActionCell({ row }: PspActionCellProps) {
  const psp = row.original;
  const t = useTranslations('pspManagement.actions');
  const { handleUpdatePsp, handleDeactivatePsp, isUpdatingStatus, handleActivatePsp } =
    useContext(PspManagementContext);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);
  const [isActivateOpen, setIsActivateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <ActionCellContainer className='justify-end'>
      {/* aria-hidden on all icons: aria-label on each button provides the accessible name (WCAG 1.1.1) */}

      {/* Edit will be only for Active PSPs*/}
      {psp.isActive && (
        <ActionButtonCell
          icon={<EditIcon className='size-[18px] text-primary' aria-hidden='true' />}
          tooltip={t('editPsp')}
          onClick={() => setIsEditOpen(true)}
          className='hover:bg-stat-icon-blue'
        />
      )}

      {/* Deactivate (only when active) */}
      {psp.isActive && (
        <ActionButtonCell
          icon={<PauseCircleIcon className='size-[18px] text-text-secondary' aria-hidden='true' />}
          tooltip={t('deactivatePsp')}
          onClick={() => setIsDeactivateOpen(true)}
          className='hover:bg-gray-100'
        />
      )}

      {/* Activate (only when inactive) */}
      {!psp.isActive && (
        <ActionButtonCell
          icon={<PowerIcon className='size-[18px] text-[#10B981]' aria-hidden='true' />}
          tooltip={t('activatePsp')}
          onClick={() => setIsActivateOpen(true)}
          className='hover:bg-green-50'
        />
      )}

      {/* Dialogs */}
      {isEditOpen && (
        <PspDialog
          mode='edit'
          initialData={psp}
          onClose={() => {
            setIsEditOpen(false);
          }}
          onSubmit={handleUpdatePsp}
        />
      )}
      {isDeactivateOpen && (
        <DeactivatePspDialog
          psp={psp}
          onClose={() => setIsDeactivateOpen(false)}
          handleDeactivatePsp={handleDeactivatePsp}
          isUpdatingStatus={isUpdatingStatus}
        />
      )}
      {isActivateOpen && (
        <ActivatePspDialog
          psp={psp}
          onClose={() => setIsActivateOpen(false)}
          handleActivatePsp={handleActivatePsp}
          isUpdatingStatus={isUpdatingStatus}
        />
      )}
      {isDeleteOpen && <DeletePspDialog psp={psp} onClose={() => setIsDeleteOpen(false)} />}
    </ActionCellContainer>
  );
}
