'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  QuickActionButton,
  StoreDialog,
  StoreIcon,
  UserDialog,
  UserPlusIcon,
} from '@/components';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function BrandAdminQuickActionCard() {
  const t = useTranslations('dashboard.quick-action');

  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isAddStoreOpen, setIsAddStoreOpen] = useState(false);

  const toggleAddUserDialog = () => {
    setIsAddUserOpen((prev) => !prev);
  };

  const toggleAddStoreDialog = () => {
    setIsAddStoreOpen((prev) => !prev);
  };

  return (
    <Card className='border border-[var(--neutral-300)] bg-[var(--neutral-100)] p-[15px] sm:px-6 sm:py-6'>
      <CardHeader className='gap-0 p-0 pb-5'>
        <CardTitle className='text-[16px] font-[var(--font-weight-medium)] leading-5 tracking-[-0.15px] text-[var(--neutral-900)]'>
          {t('title')}
        </CardTitle>
      </CardHeader>
      <CardContent className='grid grid-cols-2 gap-2 p-0 sm:gap-5'>
        <QuickActionButton
          icon={<UserPlusIcon className='size-[22px] text-white' />}
          label={t('buttons.create-user')}
          onClick={toggleAddUserDialog}
        />

        <QuickActionButton
          icon={<StoreIcon className='size-[22px] text-white' />}
          label={t('buttons.create-store')}
          onClick={toggleAddStoreDialog}
        />

        {isAddUserOpen && <UserDialog mode='create' onClose={toggleAddUserDialog} />}

        {isAddStoreOpen && <StoreDialog mode='create' onClose={toggleAddStoreDialog} />}
      </CardContent>
    </Card>
  );
}
