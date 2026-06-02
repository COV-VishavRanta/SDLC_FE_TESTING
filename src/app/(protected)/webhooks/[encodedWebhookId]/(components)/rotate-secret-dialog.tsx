'use client';

import {
  AlertTriangleIcon,
  Button,
  Card,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components';
import { WebhookCredentialsSection } from '@/components/dialog/webhook-dialog/webhook-credentials-section';
import { useTranslations } from 'next-intl';

interface RotateSecretDialogProps {
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isRotating: boolean;
  clientSecret?: string | null;
}

export function RotateSecretDialog({
  onClose,
  onConfirm,
  isRotating,
  clientSecret,
}: RotateSecretDialogProps) {
  const t = useTranslations('webhooks.details.rotateDialog');
  const isRotated = !!clientSecret;

  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <Dialog open onOpenChange={onClose} disablePointerDismissal={isRotating}>
      <DialogContent
        showCloseButton
        className='flex flex-col gap-0 overflow-hidden rounded-xl p-0 sm:max-w-[500px]'
      >
        {/* Header */}
        <DialogHeader className='gap-2 px-4 py-4 sm:px-8 sm:py-6'>
          <DialogTitle className='text-[20px] font-semibold leading-[30px] text-text-heading'>
            {t('title')}
          </DialogTitle>
          <DialogDescription className='text-[14px] leading-[21px] tracking-[-0.15px] text-text-secondary'>
            {t('description')}
          </DialogDescription>
        </DialogHeader>

        {/* Body */}
        <div className='flex flex-col gap-4 px-4 pb-4 pt-4 sm:gap-6 sm:px-8 sm:pb-6 sm:pt-6'>
          {/* Warning — hidden once the secret is revealed */}
          {!isRotated && (
            <Card className='flex flex-col gap-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-3'>
              <div className='flex items-start gap-3'>
                <AlertTriangleIcon
                  className='mt-0.5 size-5 shrink-0 text-amber-500'
                  aria-hidden='true'
                />
                <p className='text-[14px] leading-relaxed text-amber-800'>{t('warning')}</p>
              </div>
            </Card>
          )}

          {/* New secret reveal */}
          {isRotated && <WebhookCredentialsSection clientSecret={clientSecret} />}

          {/* Actions */}
          <div className='flex items-center gap-[17px]'>
            <DialogClose
              render={
                <Button
                  variant='outline'
                  className='h-[43px] flex-1 rounded-lg border-[var(--neutral-300)] bg-[var(--neutral-200)] font-medium text-[var(--neutral-900)] sm:text-[16px]'
                  disabled={isRotating}
                >
                  {t('cancelButton')}
                </Button>
              }
            />
            {!isRotated && (
              <Button
                className='h-[44px] flex-1 rounded-lg bg-gradient-to-b from-[var(--primary-400)] to-[var(--primary-500)] font-medium text-white sm:text-[16px]'
                onClick={handleConfirm}
                isLoading={isRotating}
                disabled={isRotating}
              >
                {isRotating ? t('rotating') : t('confirmButton')}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
