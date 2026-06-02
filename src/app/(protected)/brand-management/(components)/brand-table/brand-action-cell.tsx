'use client';

import {
  ActionButtonCell,
  ActionCellContainer,
  BrandDialog,
  EditIcon,
  PauseCircleIcon,
  PowerIcon,
} from '@/components';
import { BrandType } from '@/types';
import { useTranslations } from 'next-intl';
import { useContext, useState } from 'react';

import { BrandManagementContext } from '../../context/BrandManagementContext';
import { ActivateBrandDialog } from '../activate-deactivate-dialog/activate-brand-dialog';
import { DeactivateBrandDialog } from '../activate-deactivate-dialog/deactivate-brand-dialog';

interface BrandActionCellProps {
  row: { original: BrandType };
}

export default function BrandActionCell({ row }: BrandActionCellProps) {
  const brand = row.original;
  const t = useTranslations('brandManagement');

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);
  const [isActivateOpen, setIsActivateOpen] = useState(false);

  const { handleUpdateBrand, handleDeactivateBrand, handleActivateBrand, isUpdatingStatus } =
    useContext(BrandManagementContext);

  return (
    <ActionCellContainer className='justify-end'>
      {/* aria-hidden on all icons: aria-label on each button provides the accessible name (WCAG 1.1.1) */}

      {/* Edit will be only for Active Brands*/}
      {brand.isActive && (
        <ActionButtonCell
          icon={<EditIcon className='size-[18px] text-primary' aria-hidden='true' />}
          tooltip={t('actions.editBrand')}
          onClick={() => setIsEditOpen(true)}
          className='hover:bg-stat-icon-blue'
        />
      )}

      {/* Deactivate (only when active) */}
      {brand.isActive && (
        <ActionButtonCell
          icon={<PauseCircleIcon className='size-[18px] text-text-secondary' aria-hidden='true' />}
          tooltip={t('actions.deactivateBrand')}
          onClick={() => setIsDeactivateOpen(true)}
          className='hover:bg-gray-100'
        />
      )}

      {/* Activate (only when inactive) */}
      {!brand.isActive && (
        <ActionButtonCell
          icon={<PowerIcon className='size-[18px] text-[#10B981]' aria-hidden='true' />}
          tooltip={t('actions.activateBrand')}
          onClick={() => setIsActivateOpen(true)}
          className='hover:bg-green-50'
        />
      )}

      {/* Dialogs */}
      {isEditOpen && (
        <BrandDialog
          mode='edit'
          initialData={{
            id: brand.id,
            name: brand.name,
            countryId: brand.countryId ?? undefined,
            stateId: brand.stateId ?? undefined,
            cityName: brand.cityName ?? undefined,
            streetAddress: brand.address ?? undefined,
            website: brand.website ?? undefined,
            zipCode: brand.zipCode ?? undefined,
          }}
          onClose={() => setIsEditOpen(false)}
          onSubmit={handleUpdateBrand}
        />
      )}

      {isDeactivateOpen && (
        <DeactivateBrandDialog
          brand={brand}
          onClose={() => setIsDeactivateOpen(false)}
          handleDeactivateBrand={handleDeactivateBrand}
          isUpdatingStatus={isUpdatingStatus}
        />
      )}
      {isActivateOpen && (
        <ActivateBrandDialog
          brand={brand}
          onClose={() => setIsActivateOpen(false)}
          handleActivateBrand={handleActivateBrand}
          isUpdatingStatus={isUpdatingStatus}
        />
      )}
    </ActionCellContainer>
  );
}
