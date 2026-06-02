'use client';

import {
  ArchiveIcon,
  Button,
  CloseIcon,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components';
import { useTranslations } from 'next-intl';

interface ArchiveCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaignName: string;
  onConfirm: () => void;
}

export function ArchiveCampaignDialog({
  open,
  onOpenChange,
  campaignName,
  onConfirm,
}: ArchiveCampaignDialogProps) {
  const t = useTranslations('campaignManagement.archiveDialog');

  const handleArchive = () => {
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
            <div className='flex items-start gap-4 px-6 py-6'>
              {/* Archive Icon Container */}
              <div className='flex size-12 shrink-0 items-center justify-center rounded-xl bg-warning'>
                <ArchiveIcon className='size-6 text-white' aria-hidden='true' />
              </div>

              {/* Text Content */}
              <div className='flex flex-col gap-2'>
                <p className='text-[15px] font-medium leading-[22.5px] text-text-heading'>
                  {t.rich('confirmMessage', {
                    name: campaignName,
                    strong: (chunks) => <strong>{chunks}</strong>,
                  })}
                </p>
                <p className='text-[14px] font-normal leading-[21px] tracking-[-0.15px] text-text-secondary'>
                  {t('description')}
                </p>
              </div>
            </div>
          }
        ></DialogDescription>

        {/* ── Footer ── */}
        <DialogFooter className='flex flex-row items-center justify-end gap-3 border-t border-[#e5e7eb] px-6 py-6'>
          <Button
            variant='outline'
            className='h-[47px] rounded-lg border-[var(--neutral-300)] bg-[var(--neutral-200)] px-6 font-medium text-[var(--neutral-900)] hover:bg-[var(--neutral-300)] sm:text-[16px]'
            onClick={() => onOpenChange(false)}
          >
            {t('cancelButton')}
          </Button>
          <Button
            className='h-[45px] rounded-lg bg-gradient-to-b from-warning to-warning-darker px-6 font-semibold text-white hover:from-warning-light hover:to-warning sm:text-[16px]'
            onClick={handleArchive}
          >
            {t('archiveButton')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
