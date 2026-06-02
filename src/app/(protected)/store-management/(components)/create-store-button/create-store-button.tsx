'use client';

import { PagePrimaryAction, StoreDialog } from '@/components';
import { useTranslations } from 'next-intl';
import { useContext, useState } from 'react';

import { StoreManagementContext } from '../../context/StoreManagementContext';

export default function CreateStoreButton() {
  const t = useTranslations('storeManagement');
  const [isStoreDialogOpen, setIsStoreDialogOpen] = useState(false);
  const { handleUpdateStore } = useContext(StoreManagementContext);

  const toggleStoreDialog = () => {
    setIsStoreDialogOpen((prev) => !prev);
  };

  return (
    <>
      {/* accessible name comes from visible button text — no hardcoded aria-label needed (WCAG 2.5.3) */}
      <PagePrimaryAction className='px-6' onClick={toggleStoreDialog}>
        {t('filter.createButton')}
      </PagePrimaryAction>

      {isStoreDialogOpen && (
        <StoreDialog mode='create' onClose={toggleStoreDialog} onSubmit={handleUpdateStore} />
      )}
    </>
  );
}
