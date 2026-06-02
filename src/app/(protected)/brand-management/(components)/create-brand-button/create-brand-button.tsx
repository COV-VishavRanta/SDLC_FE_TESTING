'use client';

import { BrandDialog, PagePrimaryAction } from '@/components';
import { useTranslations } from 'next-intl';
import { useContext, useState } from 'react';
import { BrandManagementContext } from '../../context/BrandManagementContext';

export default function BrandCreationButton() {
  const [isBrandDialogOpen, setIsBrandDialogOpen] = useState(false);
  const t = useTranslations('brandManagement');
  const { handleCreateBrand } = useContext(BrandManagementContext);

  const toggleBrandDialog = () => {
    setIsBrandDialogOpen((prev) => !prev);
  };

  return (
    <>
      <PagePrimaryAction className='px-6' onClick={toggleBrandDialog}>
        {t('filter.createButton')}
      </PagePrimaryAction>

      {isBrandDialogOpen && (
        <BrandDialog mode='create' onClose={toggleBrandDialog} onSubmit={handleCreateBrand} />
      )}
    </>
  );
}
