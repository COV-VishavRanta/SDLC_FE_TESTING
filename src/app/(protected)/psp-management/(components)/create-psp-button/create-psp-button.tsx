'use client';

import { PagePrimaryAction, PspDialog } from '@/components';
import { useTranslations } from 'next-intl';
import { useContext, useState } from 'react';
import { PspManagementContext } from '../../context/PspManagementContext';

export default function CreatePspButton() {
  const t = useTranslations('pspManagement');
  const [isPspDialogOpen, setIsPspDialogOpen] = useState(false);

  const { handleUpdatePsp } = useContext(PspManagementContext);
  const togglePspDialog = () => {
    setIsPspDialogOpen((prev) => !prev);
  };

  return (
    <>
      {/* accessible name comes from visible button text — no hardcoded aria-label needed (WCAG 2.5.3) */}
      <PagePrimaryAction className='px-6' onClick={togglePspDialog}>
        {t('filter.createButton')}
      </PagePrimaryAction>

      {isPspDialogOpen && (
        <PspDialog mode='create' onClose={togglePspDialog} onSubmit={handleUpdatePsp} />
      )}
    </>
  );
}
