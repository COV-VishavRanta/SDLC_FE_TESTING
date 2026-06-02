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
import { BrandType } from '@/types';
import { useTranslations } from 'next-intl';

interface ActivateBrandDialogProps {
  brand: BrandType;
  onClose: () => void;
  handleActivateBrand: (id: string) => Promise<void>;
  isUpdatingStatus: boolean;
}

export function ActivateBrandDialog({
  brand,
  onClose,
  handleActivateBrand,
  isUpdatingStatus,
}: ActivateBrandDialogProps) {
  const t = useTranslations('brandManagement.activateDialog');

  const handleActivate = async () => {
    await handleActivateBrand(brand.id);
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose} disablePointerDismissal={isUpdatingStatus}>
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
        <div className='flex flex-col gap-4 sm:gap-6 px-4 pt-4 pb-4 sm:px-8 sm:pt-6 sm:pb-6'>
          {/* Brand Info Card */}
          <Card className='flex flex-col gap-3 rounded-lg border border-[var(--neutral-300)] bg-[var(--neutral-200)] px-3 py-3'>
            <p className='text-[16px] font-medium leading-5 tracking-[-0.15px] text-[var(--neutral-900)]'>
              {brand?.name ?? ''}
            </p>

            <p className='text-[14px] font-medium leading-5 tracking-[-0.15px] text-[var(--activate-green-from)]'>
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
                  disabled={isUpdatingStatus}
                >
                  {t('cancelButton')}
                </Button>
              }
            />
            <Button
              className='h-[44px] flex-1 rounded-lg bg-gradient-to-b from-[var(--activate-green-from)] to-[var(--activate-green-to)] font-medium text-white hover:from-[#2D7A2F] hover:to-[#1e5e20] sm:text-[16px]'
              onClick={handleActivate}
              isLoading={isUpdatingStatus}
            >
              {t('submitButton')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
