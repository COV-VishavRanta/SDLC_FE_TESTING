'use client';

import {
  Button,
  Card,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components';
import { IncompleteCampaignType, PSPType } from '@/types';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface DeactivatePspDialogProps {
  psp: PSPType;
  onClose: () => void;
  handleDeactivatePsp: (id: string) => Promise<IncompleteCampaignType[] | null>;
  isUpdatingStatus: boolean;
}

export function DeactivatePspDialog({
  psp,
  onClose,
  handleDeactivatePsp,
  isUpdatingStatus,
}: DeactivatePspDialogProps) {
  const t = useTranslations('pspManagement.deactivateDialog');
  const [incompleteCampaigns, setIncompleteCampaigns] = useState<IncompleteCampaignType[] | null>(
    null,
  );

  const handleDeactivate = async () => {
    const campaigns = await handleDeactivatePsp(psp.id);
    if (campaigns) {
      setIncompleteCampaigns(campaigns);
      return;
    }
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose} disablePointerDismissal={isUpdatingStatus}>
      <DialogContent
        showCloseButton
        className='flex flex-col gap-0 overflow-hidden rounded-xl p-0 sm:max-w-[600px]'
      >
        {/* Header */}
        <DialogHeader className='border-b border-[var(--neutral-300)] px-8 py-6'>
          <div className='flex items-start justify-between gap-5'>
            <div className='flex flex-col gap-2'>
              <DialogTitle className='text-[20px] font-semibold leading-normal text-[var(--neutral-900)]'>
                {t('title')}
              </DialogTitle>
              <DialogDescription className='text-[14px] font-normal leading-5 tracking-[-0.15px] text-[var(--neutral-500)]'>
                {t('description')}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Body */}
        <div className='flex flex-col gap-5 px-8 py-6'>
          {/* PSP Info Card */}
          <Card className='flex flex-col gap-3 rounded-lg border border-[var(--neutral-300)] bg-[var(--neutral-200)] px-3 py-3'>
            <p className='text-[16px] font-medium leading-5 text-[var(--neutral-900)]'>
              {psp?.name ?? ''}
            </p>

            <p className='text-[14px] font-medium leading-5 tracking-[-0.15px] text-[var(--neutral-500)]'>
              {t('adminNote')}
            </p>
          </Card>

          {/* Incomplete Campaigns Error */}
          {incompleteCampaigns !== null && (
            <div
              role='alert'
              aria-atomic='true'
              className='flex gap-3 rounded-lg border border-red-300 bg-red-50 px-4 py-3'
            >
              <div className='flex flex-col gap-1'>
                <p className='text-[13px] leading-[19px] text-red-600'>
                  {t('incompleteCampaignsError.description')}
                </p>
                <ul
                  className='mt-1 list-inside list-disc space-y-0.5'
                  aria-label={t('incompleteCampaignsError.campaignsListLabel')}
                >
                  {incompleteCampaigns.map((campaign) => (
                    <li
                      key={campaign.id}
                      className='text-[13px] font-bold leading-[19px] text-red-600'
                    >
                      {campaign.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Actions */}
          <DialogFooter className='flex-col-reverse gap-3 border-none sm:flex-row'>
            <DialogClose
              render={
                <Button
                  variant='outline'
                  className='h-[43px] flex-1 rounded-lg border-[var(--neutral-300)] bg-[var(--neutral-200)] font-medium text-[var(--neutral-900)] sm:text-[16px]'
                  disabled={isUpdatingStatus}
                >
                  {t('cancelButton')}
                </Button>
              }
            />
            <Button
              className='h-[44px] flex-1 rounded-lg bg-gradient-to-b from-[var(--deactivate-btn-from)] to-[var(--deactivate-btn-to)] font-medium text-white hover:from-[var(--deactivate-btn-hover-from)] hover:to-[var(--deactivate-btn-hover-to)] disabled:pointer-events-auto disabled:cursor-not-allowed disabled:text-white! sm:text-[16px]'
              onClick={handleDeactivate}
              isLoading={isUpdatingStatus}
              disabled={isUpdatingStatus || incompleteCampaigns !== null}
            >
              {t('submitButton')}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
