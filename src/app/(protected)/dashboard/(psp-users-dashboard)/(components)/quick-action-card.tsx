'use client';

import {
  BrandDialog,
  BrandsIcon,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DocumentPlusIcon,
  InventoryDialog,
  QuickActionButton,
  UserDialog,
  UserPlusIcon,
} from '@/components';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function PspAdminQuickActionCard() {
  const t = useTranslations('dashboard.quick-action');

  const [isAddBrandOpen, setIsAddBrandOpen] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isAddInventoryOpen, setIsAddInventoryOpen] = useState(false);

  const toggleAddBrandDialog = () => {
    setIsAddBrandOpen((prev) => !prev);
  };

  const toggleAddUserDialog = () => {
    setIsAddUserOpen((prev) => !prev);
  };

  const toggleAddInventoryDialog = () => {
    setIsAddInventoryOpen((prev) => !prev);
  };

  return (
    <Card className='border border-[var(--neutral-300)] bg-[var(--neutral-100)] p-[15px] sm:px-6 sm:py-6'>
      <CardHeader className='gap-0 p-0 pb-5'>
        <CardTitle className='text-[16px] font-[var(--font-weight-medium)] leading-5 tracking-[-0.15px] text-[var(--neutral-900)]'>
          {t('title')}
        </CardTitle>
      </CardHeader>
      <CardContent className='grid grid-cols-3 gap-2 p-0 sm:gap-5'>
        <QuickActionButton
          icon={<BrandsIcon className='size-[22px] text-white' />}
          label={t('buttons.add-brand')}
          onClick={toggleAddBrandDialog}
        />

        <QuickActionButton
          icon={<UserPlusIcon className='size-[22px] text-white' />}
          label={t('buttons.create-user')}
          onClick={toggleAddUserDialog}
        />

        <QuickActionButton
          icon={<DocumentPlusIcon className='size-[22px] text-white' />}
          label={t('buttons.create-inventory-item')}
          onClick={toggleAddInventoryDialog}
        />

        {isAddBrandOpen && <BrandDialog mode='create' onClose={toggleAddBrandDialog} />}

        {isAddUserOpen && <UserDialog mode='create' onClose={toggleAddUserDialog} />}

        {isAddInventoryOpen && <InventoryDialog mode='create' onClose={toggleAddInventoryDialog} />}
      </CardContent>
    </Card>
  );
}
