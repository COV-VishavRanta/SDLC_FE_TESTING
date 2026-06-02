'use client';

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FormTextareaField,
} from '@/components';
import { useTranslations } from 'next-intl';

import { ActionReasonFormData } from './action-reason-dialog.schema';
import useActionReasonDialog from './useActionReasonDialog';

export type ActionReasonDialogVariant = 'reject' | 'cancel';

interface ActionReasonDialogProps {
  isOpen: boolean;
  variant: ActionReasonDialogVariant;
  onSubmit: (reason: string) => Promise<void>;
  onClose: () => void;
}

export default function ActionReasonDialog({
  isOpen,
  variant,
  onSubmit,
  onClose,
}: ActionReasonDialogProps) {
  const t = useTranslations('reorderDetails.actionDialog');
  const tReject = useTranslations('reorderDetails.actionDialog.reject');
  const tCancel = useTranslations('reorderDetails.actionDialog.cancel');
  const { errors, isSubmitting, register, handleOpenChange, onFormSubmit } = useActionReasonDialog({
    onSubmit,
    onClose,
  });

  const isReject = variant === 'reject';
  const variantT: typeof tReject = isReject ? tReject : tCancel;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange} disablePointerDismissal={isSubmitting}>
      <DialogContent
        showCloseButton={false}
        className='flex max-h-[90vh] w-full flex-col gap-0 overflow-hidden rounded-xl p-0 ring-0 sm:max-w-[600px]'
      >
        {/* Header */}
        <DialogHeader className='flex h-auto flex-row items-center justify-between sm:h-[104px]'>
          <div className='flex h-[55px] flex-col gap-1'>
            <DialogTitle>{variantT('title')}</DialogTitle>
            <DialogDescription>{variantT('description')}</DialogDescription>
          </div>
          <DialogClose disabled={isSubmitting} />
        </DialogHeader>

        {/* Form body */}
        <form
          id={`action-reason-dialog-form-${variant}`}
          aria-label={variantT('title')}
          onSubmit={onFormSubmit}
          className='flex-1 overflow-y-auto px-4 py-4 sm:px-8 sm:py-6'
        >
          <FormTextareaField<ActionReasonFormData>
            id='reason'
            label={variantT('reasonLabel')}
            required
            error={errors?.reason?.message}
            placeholder={t('reasonPlaceholder')}
            register={register}
          />
        </form>

        {/* Footer */}
        <DialogFooter className='flex h-auto min-h-[70px] shrink-0 flex-col-reverse gap-3 px-4 py-3 sm:h-[88px] sm:flex-row sm:items-center sm:justify-end sm:px-8 sm:py-0'>
          <DialogClose
            render={
              <Button type='button' variant='outline' disabled={isSubmitting}>
                {t('cancelButton')}
              </Button>
            }
          />
          <Button
            type='submit'
            variant={isReject ? 'destructive' : 'secondary'}
            form={`action-reason-dialog-form-${variant}`}
            disabled={isSubmitting}
          >
            {variantT('submitButton')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
