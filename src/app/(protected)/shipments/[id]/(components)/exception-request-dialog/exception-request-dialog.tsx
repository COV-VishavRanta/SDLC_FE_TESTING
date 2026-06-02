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
  FileTextIcon,
  FormTextareaField,
} from '@/components';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { ReorderImageInput } from '@/graphql';

import { ExceptionRequestFormData } from './exception-request-dialog.schema';
import useExceptionRequestDialog from './useExceptionRequestDialog';

export enum ExceptionDialogMode {
  SHIPMENT = 'SHIPMENT',
  EXCEPTION_REQUEST = 'EXCEPTION_REQUEST',
}

/* ─── Helpers ─── */
function formatFilesize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* ─── Props ─── */
export interface ExceptionRequestDialogProps {
  isOpen: boolean;
  shipmentId?: string;
  onSubmit: (reason: string, images: ReorderImageInput[]) => Promise<void>;
  onClose: () => void;
  type: ExceptionDialogMode;
}

/* ─── Component ─── */
export default function ExceptionRequestDialog({
  isOpen,
  shipmentId,
  onSubmit,
  onClose,
  type,
}: ExceptionRequestDialogProps) {
  const {
    t,
    fileInputRef,
    errors,
    isWorking,
    register,
    selectedFiles,
    handleAddFiles,
    handleRemoveFile,
    handleOpenChange,
    onFormSubmit,
  } = useExceptionRequestDialog({ shipmentId, onSubmit, onClose, type });

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange} disablePointerDismissal={isWorking}>
      <DialogContent
        showCloseButton={false}
        className='flex max-h-[90vh] w-full flex-col gap-0 overflow-hidden rounded-xl p-0 ring-0 sm:max-w-[600px]'
      >
        {/* ── Header ── */}
        <DialogHeader className='flex h-auto flex-row items-center justify-between sm:h-[104px]'>
          <div className='flex h-[55px] flex-col gap-1'>
            <DialogTitle>{t('title')}</DialogTitle>
            <DialogDescription>{t('description')}</DialogDescription>
          </div>
          <DialogClose disabled={isWorking} />
        </DialogHeader>

        {/* ── Form Body (scrollable) ── */}
        <form
          id='exception-request-dialog-form'
          aria-label={t('title')}
          onSubmit={onFormSubmit}
          className='flex-1 overflow-y-auto px-4 py-4 sm:pl-8 sm:pr-6 sm:py-6'
        >
          <div className='flex flex-col gap-5'>
            {/* Reason */}
            <FormTextareaField<ExceptionRequestFormData>
              id='reason'
              label={t('fields.reason.label')}
              required
              error={errors?.reason?.message}
              placeholder={t('fields.reason.placeholder')}
              register={register}
            />

            {/* Photo Upload */}
            <Field className='flex flex-col gap-2'>
              <FieldLabel
                htmlFor='exception_file_upload'
                className='flex items-center text-[var(--label-size)] font-[var(--font-weight-medium)] leading-[19.5px]'
                required
              >
                {t('fields.photoUpload.label')}
              </FieldLabel>

              <input
                ref={fileInputRef}
                id='exception_file_upload'
                type='file'
                accept='image/jpeg,image/png,image/webp'
                multiple
                className='hidden'
                onChange={(e) => handleAddFiles(e.target.files)}
                disabled={isWorking}
              />

              {/* Drop zone */}
              <button
                type='button'
                onClick={() => fileInputRef.current?.click()}
                disabled={isWorking}
                className='flex min-h-[120px] w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-[var(--input-radius)] border-2 border-dashed border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-6 transition-colors hover:border-primary/50 hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50'
              >
                <div className='flex flex-col items-center gap-1'>
                  <p className='text-[14px] font-semibold leading-[21px] text-text-heading'>
                    {t('fields.photoUpload.dropHint')}
                  </p>
                  <p className='text-[12px] leading-[18px] text-text-secondary'>
                    {t('fields.photoUpload.typeHint')}
                  </p>
                </div>
                <span className='inline-flex h-9 items-center rounded-lg border border-primary px-4 text-[13px] font-semibold text-primary hover:bg-blue-50'>
                  {t('fields.photoUpload.selectButton')}
                </span>
              </button>

              {/* Images array-level validation error */}
              <FieldError
                className='mt-[0.5] text-[13px] sm:text-[14px]'
                errors={
                  errors.images && !Array.isArray(errors.images)
                    ? [{ message: errors.images.message as string }]
                    : []
                }
              />

              {/* File list */}
              {selectedFiles.length > 0 && (
                <ul className='flex flex-col gap-3 mt-2' aria-label={t('fields.photoUpload.label')}>
                  {selectedFiles.map((file, index) => (
                    <li
                      key={`${file.name}-${index}`}
                      className='relative flex flex-col items-center gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3'
                    >
                      {/* File type icon */}
                      <div className='flex items-center gap-3 justify-start w-full'>
                        <div className='flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10'>
                          <FileTextIcon className='size-5 text-primary' />
                        </div>

                        {/* File info */}
                        <div className='min-w-0 flex-1'>
                          <p className='truncate text-[13px] font-medium leading-[19.5px] text-text-heading'>
                            {file.name}
                          </p>
                          <p className='text-[12px] leading-[18px] text-text-secondary'>
                            {formatFilesize(file.size)}
                          </p>
                        </div>
                      </div>
                      {/* Per-file validation error */}
                      {Array.isArray(errors.images) && errors.images[index] && (
                        <p className='text-[12px] text-destructive'>
                          {errors.images[index]?.message as string}
                        </p>
                      )}

                      {/* Remove button */}
                      <button
                        type='button'
                        onClick={() => handleRemoveFile(index)}
                        disabled={isWorking}
                        className='absolute -right-2.5 -top-2.5 flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-sm transition-colors hover:bg-primary/80 disabled:cursor-not-allowed disabled:opacity-50'
                        aria-label={t('fields.photoUpload.removeFile', { fileName: file.name })}
                      >
                        <span className='text-[14px] font-bold leading-none'>&times;</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </Field>
          </div>
        </form>

        {/* ── Footer ── */}
        <DialogFooter className='flex h-auto min-h-[70px] shrink-0 flex-col-reverse gap-3 px-4 py-3 sm:h-[88px] sm:flex-row sm:items-center sm:justify-end sm:px-8 sm:py-0'>
          <DialogClose
            render={
              <Button
                type='button'
                variant='outline'
                className='h-[47px] flex-1 rounded-[8px] border border-[var(--neutral-300)] bg-[var(--neutral-200)] font-medium text-[var(--neutral-900)] hover:bg-[var(--neutral-300)] sm:text-[16px]'
                disabled={isWorking}
              >
                {t('cancelButton')}
              </Button>
            }
          />
          <Button
            type='submit'
            form='exception-request-dialog-form'
            variant='default'
            isLoading={isWorking}
            className='h-[45px] flex-1 rounded-[8px] bg-gradient-to-b font-medium leading-[21px] sm:text-[16px]'
          >
            {t('submitButton')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
