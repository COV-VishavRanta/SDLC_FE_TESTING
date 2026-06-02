'use client';

import { PagePrimaryAction, UserDialog } from '@/components';
import { useTranslations } from 'next-intl';
import { useContext, useState } from 'react';

import { UserManagementContext } from '../../context/UserManagementContext';

export default function UserCreationButton() {
  const t = useTranslations('userManagement');
  const { handleCreateUser } = useContext(UserManagementContext);

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {/* aria-label removed — accessible name comes from visible button text (WCAG 2.5.3) */}
      <PagePrimaryAction
        aria-label={t('actions.createUser')}
        className='px-6'
        onClick={() => setIsOpen(true)}
      >
        {t('actions.createUser')}
      </PagePrimaryAction>
      {isOpen && (
        <UserDialog onSubmit={handleCreateUser} mode='create' onClose={() => setIsOpen(false)} />
      )}
    </div>
  );
}
