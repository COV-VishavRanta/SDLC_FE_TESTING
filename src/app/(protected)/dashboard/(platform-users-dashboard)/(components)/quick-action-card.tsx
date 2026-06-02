'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  PSPManagementIcon,
  PspDialog,
  QuickActionButton,
  UserDialog,
  UserPlusIcon,
} from '@/components';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function QuickActionCard() {
  const t = useTranslations('dashboard.quick-action');

  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isAddPspOpen, setIsAddPspOpen] = useState(false);

  const toggleAddUserDialog = () => {
    setIsAddUserOpen((prev) => !prev);
  };

  const togglePspDialog = () => {
    setIsAddPspOpen((prev) => !prev);
  };

  return (
    <Card className='rounded-md border border-[var(--neutral-300)] bg-[var(--neutral-100)] p-[15px] sm:rounded-lg sm:p-6'>
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
          icon={<PSPManagementIcon className='size-[18px] text-white' />}
          label={t('buttons.create-psp')}
          onClick={togglePspDialog}
        />

        {isAddUserOpen && <UserDialog mode='create' onClose={toggleAddUserDialog} />}

        {isAddPspOpen && <PspDialog mode='create' onClose={togglePspDialog} />}
      </CardContent>
    </Card>
  );
}
