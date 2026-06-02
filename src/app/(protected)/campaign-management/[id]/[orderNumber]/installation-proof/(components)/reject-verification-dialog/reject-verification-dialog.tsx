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
  FormTextareaField,
} from '@/components';

import useRejectVerificationDialog from './useRejectVerificationDialog';

/* ─── Types ─── */
interface RejectVerificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  promotionNames: string[];
  onSubmit: (notes: string) => void;
}

/* ─── Reject Verification Dialog ─── */
export default function RejectVerificationDialog({
  open,
  onOpenChange,
  promotionNames,
  onSubmit,
}: RejectVerificationDialogProps) {
  const { t, register, errors, isSubmitting, onFormSubmit, handleOpenChange } =
    useRejectVerificationDialog({
      onSubmit,
      onClose: () => onOpenChange(false),
    });

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className='flex w-full flex-col gap-0 overflow-hidden rounded-xl p-0 ring-0 sm:max-w-[600px]'
        aria-labelledby='reject-verification-title'
        aria-describedby='reject-verification-description'
      >
        {/* ── Header ── */}
        <DialogHeader className='flex flex-row items-start justify-between gap-5 border-b border-[var(--neutral-300)] px-5 py-4 sm:px-8 sm:py-6'>
          <div className='flex flex-1 flex-col gap-2'>
            <DialogTitle
              id='reject-verification-title'
              className='text-[20px] font-semibold leading-normal text-[var(--neutral-900)]'
            >
              {t('title')}
            </DialogTitle>
            <DialogDescription
              id='reject-verification-description'
              render={
                <p className='text-[14px] font-normal leading-5 tracking-[-0.15px] text-[var(--neutral-500)]' />
              }
            >
              {t('description')}
            </DialogDescription>
          </div>
          <DialogClose
            render={
              <Button
                variant='ghost'
                size='icon'
                className='size-8 shrink-0 text-[var(--neutral-500)] hover:text-[var(--neutral-700)]'
                aria-label='Close'
                disabled={isSubmitting}
              >
                <CloseIcon className='size-5' />
              </Button>
            }
          />
        </DialogHeader>

        {/* ── Body ── */}
        <form id='reject-verification-form' onSubmit={onFormSubmit}>
          <div className='px-5 py-5 sm:px-8 sm:py-6'>
            {/* Promotion list */}
            <p className='mb-3 text-[10px] font-semibold uppercase tracking-wider text-[var(--neutral-500)] sm:text-xs'>
              {t('promotionListLabel')}
            </p>
            <ul className='mb-5 list-disc space-y-1 pl-5'>
              {promotionNames.map((name) => (
                <li key={name} className='text-sm font-semibold text-[var(--neutral-900)]'>
                  {name}
                </li>
              ))}
            </ul>

            <FormTextareaField
              id='notes'
              label={t('reasonLabel')}
              required
              error={errors?.notes?.message}
              placeholder={t('reasonPlaceholder')}
              register={register}
            />
          </div>

          {/* ── Footer ── */}
          <DialogFooter className='flex flex-row justify-end gap-3 border-t border-[var(--neutral-300)] px-5 py-4 sm:px-8 sm:py-5'>
            <DialogClose
              render={
                <Button
                  type='button'
                  variant='outline'
                  disabled={isSubmitting}
                  className='h-[40px] flex-1 rounded-[8px] px-5 text-[13px] font-semibold sm:h-[44px] sm:px-6 sm:text-[16px]'
                >
                  {t('cancelButton')}
                </Button>
              }
            />
            <Button
              type='submit'
              form='reject-verification-form'
              variant='default'
              isLoading={isSubmitting}
              className='h-[40px] flex-1 rounded-[8px] bg-gradient-to-b from-[var(--btn-primary-from)] to-[var(--btn-primary-to)] px-5 text-[13px] font-semibold text-white shadow-sm transition-opacity hover:opacity-90 sm:h-[44px] sm:px-6 sm:text-[16px]'
            >
              {t('saveButton')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
