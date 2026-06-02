'use client';

import {
  ActionButtonCell,
  ActionCellContainer,
  EditIcon,
  PauseCircleIcon,
  PowerIcon,
  StoreDialog,
} from '@/components';
import { StoreType } from '@/types';
import { useTranslations } from 'next-intl';
import { useContext, useState } from 'react';

import { StoreManagementContext } from '../../context/StoreManagementContext';
import { ActivateStoreDialog } from '../activate-deactivate-dialog/activate-store-dialog';
import { DeactivateStoreDialog } from '../activate-deactivate-dialog/deactivate-store-dialog';

interface StoreActionCellProps {
  row: { original: StoreType };
}

export default function StoreActionCell({ row }: StoreActionCellProps) {
  const store = row.original;
  const t = useTranslations('storeManagement.actions');
  const { handleUpdateStore, handleDeactivateStore, handleActivateStore, isUpdatingStatus } =
    useContext(StoreManagementContext);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);
  const [isActivateOpen, setIsActivateOpen] = useState(false);

  return (
    <ActionCellContainer className='justify-end'>
      {/* aria-hidden on all icons: aria-label on each button provides the accessible name (WCAG 1.1.1) */}

      {/* Edit — only for active stores */}
      {store.isActive && (
        <ActionButtonCell
          icon={<EditIcon className='size-[18px] text-primary' aria-hidden='true' />}
          tooltip={t('editStore')}
          onClick={() => setIsEditOpen(true)}
          className='hover:bg-stat-icon-blue'
        />
      )}

      {/* Deactivate (only when active) */}
      {store.isActive && (
        <ActionButtonCell
          icon={<PauseCircleIcon className='size-[18px] text-text-secondary' aria-hidden='true' />}
          tooltip={t('deactivateStore')}
          onClick={() => setIsDeactivateOpen(true)}
          className='hover:bg-gray-100'
        />
      )}

      {/* Activate (only when inactive) */}
      {!store.isActive && (
        <ActionButtonCell
          icon={<PowerIcon className='size-[18px] text-[#10B981]' aria-hidden='true' />}
          tooltip={t('activateStore')}
          onClick={() => setIsActivateOpen(true)}
          className='hover:bg-green-50'
        />
      )}

      {/* Dialogs */}
      {isEditOpen && (
        <StoreDialog
          mode='edit'
          initialData={store}
          onClose={() => {
            setIsEditOpen(false);
          }}
          onSubmit={handleUpdateStore}
        />
      )}
      {isDeactivateOpen && (
        <DeactivateStoreDialog
          store={store}
          onClose={() => setIsDeactivateOpen(false)}
          handleDeactivateStore={handleDeactivateStore}
          isUpdatingStatus={isUpdatingStatus}
        />
      )}
      {isActivateOpen && (
        <ActivateStoreDialog
          store={store}
          onClose={() => setIsActivateOpen(false)}
          handleActivateStore={handleActivateStore}
          isUpdatingStatus={isUpdatingStatus}
        />
      )}
    </ActionCellContainer>
  );
}
