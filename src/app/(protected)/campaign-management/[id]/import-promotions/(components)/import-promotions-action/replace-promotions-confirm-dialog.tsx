'use client';

import {
  Button,
  CloseIcon,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  TrashIcon,
} from '@/components';
import { useTranslations } from 'next-intl';

interface ReplacePromotionsConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function ReplacePromotionsConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
}: ReplacePromotionsConfirmDialogProps) {
  const t = useTranslations('campaignManagement.importPromotions.replaceConfirmDialog');

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className='flex w-full flex-col gap-0 overflow-hidden rounded-2xl p-0 ring-0 sm:max-w-[500px]'
      >
        {/* ── Header ── */}
        <DialogHeader className='flex h-[85px] flex-row items-center justify-between border-b border-[#e5e7eb] px-6 pb-px'>
          <DialogTitle className='text-[20px] font-semibold leading-[30px] text-text-heading'>
            {t('title')}
          </DialogTitle>
          <DialogClose
            render={
              <button
                type='button'
                className='flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-input-bg hover:text-text-heading'
              >
                <CloseIcon className='size-5' aria-hidden='true' />
                <span className='sr-only'>{t('cancelButton')}</span>
              </button>
            }
          />
        </DialogHeader>

        {/* ── Body ── */}
        <DialogDescription
          render={
            <div className='flex items-start gap-4'>
              {/* Red icon circle */}
              <div className='flex size-12 shrink-0 items-center justify-center rounded-xl bg-[rgba(255,82,82,0.1)]'>
                <TrashIcon className='size-5 text-destructive' aria-hidden='true' />
              </div>

              <div className='flex flex-col gap-1'>
                <p className='text-[15px] font-semibold leading-[22.5px] text-text-heading'>
                  {t('confirmTitle')}
                </p>
                <p className='text-[14px] font-normal leading-[21px] tracking-[-0.15px] text-text-secondary'>
                  {t('confirmDescription')}
                </p>
              </div>
            </div>
          }
          className='px-6 py-6'
        />

        {/* ── Footer ── */}
        <DialogFooter className='flex flex-row items-center justify-end gap-3 border-t border-[#e5e7eb] px-6 py-6'>
          <Button
            variant='outline'
            className='h-[47px] flex-1 rounded-lg border-[var(--neutral-300)] bg-[var(--neutral-200)] px-6 font-medium text-[var(--neutral-900)] hover:bg-[var(--neutral-300)] sm:text-[16px]'
            onClick={() => onOpenChange(false)}
          >
            {t('cancelButton')}
          </Button>
          <Button
            className='h-[45px] flex-1 rounded-lg bg-gradient-to-b from-[#A80000] to-[#dc2626] px-6 font-semibold text-white hover:from-[#e04848] hover:to-[#c42222] sm:text-[16px]'
            onClick={handleConfirm}
          >
            {t('confirmButton')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
