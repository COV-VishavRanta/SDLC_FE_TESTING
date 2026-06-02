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
} from '@/components';
import { Field, FieldError, FieldLabel, FormTextareaField } from '@/components/ui/field';

import useUploadInstallationProofDialog from './useUploadInstallationProofDialog';

/* ─── Helpers ─── */
function formatFilesize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* ─── Props ─── */
interface UploadInstallationProofDialogProps {
  open: boolean;
  promotionName: string;
  initialFiles: File[];
  initialNote: string;
  onSave: (files: File[]) => void;
  onNoteSave: (note: string) => void;
  onClose: () => void;
}

/* ─── Component ─── */
export default function UploadInstallationProofDialog({
  open,
  promotionName,
  initialFiles,
  initialNote,
  onSave,
  onNoteSave,
  onClose,
}: UploadInstallationProofDialogProps) {
  const {
    t,
    fileInputRef,
    errors,
    isSubmitting,
    selectedFiles,
    register,
    handleAddFiles,
    handleRemoveFile,
    handleOpenChange,
    onFormSubmit,
  } = useUploadInstallationProofDialog({ initialFiles, initialNote, onSave, onNoteSave, onClose });

  return (
    <Dialog open={open} onOpenChange={handleOpenChange} disablePointerDismissal={isSubmitting}>
      <DialogContent
        showCloseButton={false}
        className='flex max-h-[90vh] w-full flex-col gap-0 overflow-hidden rounded-xl p-0 ring-0 sm:max-w-[600px]'
      >
        {/* ── Header ── */}
        <DialogHeader className='flex h-auto flex-row items-center justify-between sm:h-[104px]'>
          <div className='flex h-[55px] flex-col gap-1'>
            <DialogTitle>{t('title')}</DialogTitle>
            <DialogDescription>{t('description', { promotionName })}</DialogDescription>
          </div>
          <DialogClose disabled={isSubmitting} />
        </DialogHeader>

        {/* ── Form Body (scrollable) ── */}
        <form
          id='upload-installation-proof-form'
          aria-label={t('title')}
          onSubmit={onFormSubmit}
          className='flex-1 overflow-y-auto px-4 py-4 sm:pl-8 sm:pr-6 sm:py-6'
        >
          {/* Notes */}
          <FormTextareaField
            id='notes'
            label={t('fields.notes.label')}
            error={errors?.notes?.message}
            placeholder={t('fields.notes.placeholder')}
            register={register}
          />

          {/* Photo Upload */}
          <Field className='flex flex-col mt-3 gap-2'>
            <FieldLabel
              htmlFor='installation_proof_file_upload'
              className='flex items-center text-[var(--label-size)] font-[var(--font-weight-medium)] leading-[19.5px]'
              required
            >
              {t('fields.photoUpload.label')}
            </FieldLabel>

            <input
              ref={fileInputRef}
              id='installation_proof_file_upload'
              type='file'
              accept='image/jpeg,image/png,image/webp'
              multiple
              className='hidden'
              onChange={(e) => handleAddFiles(e.target.files)}
              disabled={isSubmitting}
            />

            {/* Drop zone */}
            <button
              type='button'
              onClick={() => fileInputRef.current?.click()}
              disabled={isSubmitting}
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

            {/* Array-level validation error */}
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
              <ul className='mt-2 flex flex-col gap-3' aria-label={t('fields.photoUpload.label')}>
                {selectedFiles.map((file, index) => (
                  <li
                    key={`${file.name}-${index}`}
                    className='relative flex flex-col items-center gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3'
                  >
                    <div className='flex w-full items-center gap-3'>
                      <div className='flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10'>
                        <FileTextIcon className='size-5 text-primary' />
                      </div>
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
                      disabled={isSubmitting}
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
        </form>

        {/* ── Footer ── */}
        <DialogFooter className='flex items-center gap-[17px] px-4 py-4'>
          <DialogClose
            render={
              <Button
                type='button'
                variant='outline'
                className='h-[43px] flex-1 rounded-lg border-[var(--neutral-300)] bg-[var(--neutral-200)] font-medium text-[var(--neutral-900)] sm:text-[16px]'
                disabled={isSubmitting}
              >
                {t('cancelButton')}
              </Button>
            }
          />
          <Button
            type='submit'
            form='upload-installation-proof-form'
            variant='default'
            isLoading={isSubmitting}
            className='h-[43px] flex-1 rounded-lg bg-gradient-to-b font-medium leading-[21px] sm:text-[16px]'
          >
            {t('saveButton')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
