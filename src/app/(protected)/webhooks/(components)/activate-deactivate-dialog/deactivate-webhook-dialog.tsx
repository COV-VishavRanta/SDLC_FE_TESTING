'use client';

import {
  Button,
  Card,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components';
import { WebhookCredentialType } from '@/types';
import { useTranslations } from 'next-intl';

interface DeactivateWebhookDialogProps {
  credential: WebhookCredentialType;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export function DeactivateWebhookDialog({
  credential,
  onClose,
  onConfirm,
  isLoading,
}: DeactivateWebhookDialogProps) {
  const t = useTranslations('webhooks.deactivateDialog');

  const handleDeactivate = () => {
    onConfirm();
  };

  return (
    <Dialog open onOpenChange={onClose} disablePointerDismissal={isLoading}>
      <DialogContent
        showCloseButton
        className='flex flex-col gap-0 overflow-hidden rounded-xl p-0 sm:max-w-[500px]'
      >
        {/* Header */}
        <DialogHeader className='border-b border-[var(--neutral-300)] px-4 py-4 sm:px-8 sm:py-6'>
          <div className='flex flex-col gap-2'>
            <DialogTitle className='text-[20px] font-semibold leading-normal text-[var(--neutral-900)]'>
              {t('title')}
            </DialogTitle>
            <DialogDescription className='text-[14px] font-normal leading-5 tracking-[-0.15px] text-[var(--neutral-500)]'>
              {t('description')}
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Body */}
        <div className='flex flex-col gap-4 px-4 pb-4 pt-4 sm:gap-5 sm:px-8 sm:pb-6 sm:pt-6'>
          {/* Credential Info Card */}
          <Card className='flex flex-col gap-3 rounded-lg border border-[var(--neutral-300)] bg-[var(--neutral-200)] px-3 py-3'>
            <p className='text-[16px] font-medium leading-5 text-[var(--neutral-900)]'>
              {credential.label}
            </p>
            <p className='text-[14px] font-medium leading-5 tracking-[-0.15px] text-[var(--neutral-500)]'>
              {t('adminNote')}
            </p>
          </Card>

          {/* Actions */}
          <div className='flex items-center gap-[17px]'>
            <DialogClose
              render={
                <Button
                  variant='outline'
                  className='h-[43px] flex-1 rounded-lg border-[var(--neutral-300)] bg-[var(--neutral-200)] font-medium text-[var(--neutral-900)] sm:text-[16px]'
                  disabled={isLoading}
                >
                  {t('cancelButton')}
                </Button>
              }
            />
            <Button
              className='h-[44px] flex-1 rounded-lg bg-gradient-to-b from-red-500 to-red-700 font-medium text-white hover:from-red-600 hover:to-red-800 sm:text-[16px]'
              onClick={handleDeactivate}
              isLoading={isLoading}
            >
              {t('submitButton')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
