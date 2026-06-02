'use client';

import { Button } from '@/components';
import { ImportPromotionMode } from '@/constant';
import { useContext, useState } from 'react';

import { ImportPromotionsContext } from '../../context/ImportPromotionsContext';
import { ReplacePromotionsConfirmDialog } from './replace-promotions-confirm-dialog';

export default function ImportPromotionsActions() {
  const {
    setRowSelection,
    hasSelection,
    isImporting,
    handleAddToCampaign,
    sourceCampaignId,
    importAction,
    t,
  } = useContext(ImportPromotionsContext);

  const [confirmOpen, setConfirmOpen] = useState(false);

  const isDisabled = !hasSelection || isImporting || !sourceCampaignId;

  const handleButtonClick = () => {
    if (importAction === ImportPromotionMode.REPLACE) {
      setConfirmOpen(true);
    } else {
      handleAddToCampaign();
    }
  };

  return (
    <>
      <div className='flex justify-end gap-3'>
        <Button
          variant='outline'
          onClick={() => setRowSelection({})}
          disabled={!hasSelection || isImporting}
          className='h-[44px] rounded-[8px] border-[var(--neutral-300)] bg-[var(--neutral-200)] px-6 text-[16px] font-medium text-[var(--neutral-900)] hover:bg-[var(--neutral-300)]'
        >
          {t('clearButton')}
        </Button>
        <Button
          onClick={handleButtonClick}
          disabled={isDisabled}
          aria-disabled={isDisabled}
          className='h-[44px] rounded-[8px] bg-gradient-to-b from-primary to-[var(--blue-medium)] px-6 text-[16px] font-medium text-white'
        >
          {isImporting ? t('addingButton') : t('addButton')}
        </Button>
      </div>

      <ReplacePromotionsConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={() => handleAddToCampaign()}
      />
    </>
  );
}
