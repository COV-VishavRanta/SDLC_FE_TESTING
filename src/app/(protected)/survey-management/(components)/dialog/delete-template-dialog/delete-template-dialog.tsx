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

interface DeleteTemplateDialogProps {
  templateName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteTemplateDialog({
  templateName,
  onConfirm,
  onCancel,
}: DeleteTemplateDialogProps) {
  const t = useTranslations('surveyManagement.template.deleteDialog');

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className='flex w-full flex-col gap-0 overflow-hidden rounded-2xl p-0 ring-0 sm:max-w-[600px]'
      >
        {/* ── Header  ── */}
        <DialogHeader className='flex h-[85px] flex-row items-center justify-between border-b border-[#e5e7eb] px-6 pb-px'>
          <DialogTitle className='text-[20px] font-semibold leading-[30px] text-text-heading'>
            {t('title')}
          </DialogTitle>
          <DialogClose
            render={
              <button
                type='button'
                className='flex size-6 shrink-0 cursor-pointer items-center justify-center text-[var(--neutral-500)] transition-colors hover:text-[var(--neutral-900)]'
                onClick={onCancel}
                aria-label={t('cancelButton')}
              >
                <CloseIcon className='size-6' aria-hidden='true' />
              </button>
            }
          />
        </DialogHeader>

        {/* ── Body ── */}
        <DialogDescription
          render={
            <div className='flex items-start gap-4'>
              <div className='flex size-12 shrink-0 items-center justify-center rounded-lg bg-[var(--delete-icon-bg)]'>
                <TrashIcon className='size-[22px] text-[var(--error)]' aria-hidden='true' />
              </div>
              <div className='flex flex-1 flex-col gap-2'>
                <p className='text-[14px] font-medium leading-normal text-[var(--neutral-900)]'>
                  {t('confirmTitle')}
                </p>
                <p className='text-[14px] font-normal leading-5 tracking-[-0.15px] text-[var(--neutral-500)]'>
                  {t('confirmDescription', { name: templateName })}
                </p>
              </div>
            </div>
          }
          className='px-8 py-6'
        />

        {/* ── Footer ── */}
        <DialogFooter className='flex flex-row items-center justify-end gap-3 border-t border-[#e5e7eb] px-6 py-6'>
          <Button
            variant='outline'
            className='h-[43px] flex-1 rounded-lg border-[var(--neutral-300)] bg-[var(--neutral-200)] px-6 font-medium text-[var(--neutral-900)] hover:bg-[var(--neutral-300)] sm:text-[16px]'
            onClick={onCancel}
          >
            {t('cancelButton')}
          </Button>
          <Button
            className='h-[43px] flex-1 rounded-lg bg-gradient-to-b from-[var(--delete-btn-from)] to-[var(--delete-btn-to)] px-6 font-medium text-white hover:from-[var(--delete-btn-hover-from)] hover:to-[var(--delete-btn-hover-to)] sm:text-[16px]'
            onClick={onConfirm}
          >
            {t('deleteButton')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
