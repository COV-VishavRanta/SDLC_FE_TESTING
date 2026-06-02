'use client';

import {
  Button,
  Checkbox,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FileTextIcon,
  FormInputField,
  FormTextareaField,
  Switch,
} from '@/components';
import { CampaignType, PromotionType } from '@/types';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';
import { Controller, useWatch } from 'react-hook-form';

import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { PromotionFormData } from './promotion-dialog.schema';
import usePromotionDialog from './usePromotionDialog';

/* ─── Helpers ─── */
function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* ─── Types ─── */
type BasePromotionDialogProps = {
  campaignData: CampaignType | null;
  onClose: () => void;
  onSubmit?: () => void;
};

type CreatePromotionDialogProps = BasePromotionDialogProps & {
  mode: 'create';
  initialData?: PromotionType;
};

type EditPromotionDialogProps = BasePromotionDialogProps & {
  mode: 'edit';
  initialData: PromotionType;
};

export type PromotionDialogProps = CreatePromotionDialogProps | EditPromotionDialogProps;

/* ─── Promotion Dialog ─── */
export default function PromotionDialog({
  mode,
  campaignData,
  onClose,
  initialData,
  onSubmit,
}: PromotionDialogProps) {
  const t = useTranslations('campaignManagement.promotionDialog');
  const tFields = useTranslations('campaignManagement.promotionDialog.fields');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    config,
    handleOpenChange,

    // form handlers
    errors,
    isSubmitting,
    register,
    control,
    setValue,
    onFormSubmit,
  } = usePromotionDialog({
    mode,
    campaignData,
    initialData,
    onSubmit,
    onClose,
  } as PromotionDialogProps);

  const needsDesign = useWatch({ control, name: 'needDesign' });
  const uploadedFile = useWatch({ control, name: 'image' });
  const existingImageName = useWatch({ control, name: 'existingImageName' });

  // Displayed file card: new file takes priority, then fall back to the server image (edit mode)
  const fileCardName = uploadedFile?.name ?? existingImageName;
  const fileCardSize = uploadedFile ? formatFileSize(uploadedFile.size) : null;

  return (
    <Dialog open onOpenChange={handleOpenChange} disablePointerDismissal={isSubmitting}>
      <DialogContent
        showCloseButton={false}
        className='flex max-h-[calc(100dvh-2rem)] w-full flex-col gap-0 overflow-hidden rounded-xl p-0 ring-0 sm:max-h-[90vh] sm:max-w-[700px]'
      >
        {/* ── Header ── */}
        <DialogHeader className='flex h-auto flex-row items-center justify-between sm:h-[104px]'>
          <div className='flex h-[55px] flex-col gap-1'>
            <DialogTitle>{config.title}</DialogTitle>
            <DialogDescription>{config.description}</DialogDescription>
          </div>
          <DialogClose />
        </DialogHeader>

        {/* ── Form Body (scrollable) ── */}
        <form
          id='promotion-dialog-form'
          aria-label={config.title}
          onSubmit={onFormSubmit}
          className='flex-1 overflow-y-auto px-4 py-4 sm:pl-8 sm:pr-6 sm:py-6'
        >
          <div className='flex flex-col gap-5'>
            {/* Promotion Name */}
            <FormInputField<PromotionFormData>
              id='name'
              label={tFields('name.label')}
              required
              error={errors?.name?.message}
              placeholder={tFields('name.placeholder')}
              register={register}
            />

            {/* Width + Height (2-col) */}
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <FormInputField<PromotionFormData>
                id='width'
                label={tFields('width.label')}
                description={tFields('width.dimensionHint')}
                required
                type='number'
                step='0.01'
                error={errors?.width?.message}
                placeholder={tFields('width.placeholder')}
                register={register}
                registerOptions={{ valueAsNumber: true }}
              />

              <FormInputField<PromotionFormData>
                id='height'
                label={tFields('height.label')}
                description={tFields('height.dimensionHint')}
                type='number'
                step='0.01'
                pattern='^\d*(\.\d{0,2})?$'
                error={errors?.height?.message}
                placeholder={tFields('height.placeholder')}
                register={register}
                registerOptions={{ valueAsNumber: true }}
                required
              />
            </div>

            {/* Material */}
            <FormInputField<PromotionFormData>
              id='material'
              label={tFields('material.label')}
              error={errors?.material?.message}
              placeholder={tFields('material.placeholder')}
              register={register}
            />

            {/* Finishing Specification */}
            <FormTextareaField<PromotionFormData>
              id='specifications'
              label={tFields('specifications.label')}
              error={errors?.specifications?.message}
              placeholder={tFields('specifications.placeholder')}
              register={register}
            />

            {/* Description */}
            <FormTextareaField<PromotionFormData>
              id='description'
              label={tFields('description.label')}
              error={errors?.description?.message}
              placeholder={tFields('description.placeholder')}
              register={register}
            />
            {/* Need Design Checkbox */}
            <Controller
              name='needDesign'
              control={control}
              render={({ field }) => (
                <FieldLabel
                  htmlFor='needDesign'
                  className='flex cursor-pointer items-center gap-3 text-[14px] font-medium leading-[21px] text-text-heading'
                >
                  <Checkbox
                    id='needDesign'
                    checked={field.value}
                    onCheckedChange={(value) => {
                      // reset both new file and existing image reference when toggling
                      setValue('image', undefined);
                      setValue('existingImageName', undefined);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                      field.onChange(value);
                    }}
                  />
                  {tFields('needDesign.label')}
                </FieldLabel>
              )}
            />

            {/* Photo Upload — shown only when needDesign is unchecked */}
            {!needsDesign && (
              <Field className='flex flex-col gap-2'>
                <FieldLabel
                  htmlFor='file_upload'
                  className='flex items-center text-[var(--label-size)] font-[var(--font-weight-medium)] leading-[19.5px]'
                  required
                >
                  {tFields('photoUpload.label')}
                </FieldLabel>

                <input
                  ref={fileInputRef}
                  id='file_upload'
                  type='file'
                  accept='image/jpeg,image/png,image/webp'
                  className='hidden'
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? undefined;
                    setValue('image', file, { shouldValidate: true });
                    // replacing the server image with a new file
                    if (file) setValue('existingImageName', undefined);
                  }}
                />

                {/* Drop zone */}
                <button
                  type='button'
                  onClick={() => fileInputRef.current?.click()}
                  className='flex min-h-[120px] w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-[var(--input-radius)] border-2 border-dashed border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-6 transition-colors hover:border-primary/50 hover:bg-primary/5'
                >
                  <div className='flex flex-col items-center gap-1'>
                    <p className='text-[14px] font-semibold leading-[21px] text-text-heading'>
                      {tFields('photoUpload.dropHint')}
                    </p>
                    <p className='text-[12px] leading-[18px] text-text-secondary'>
                      {tFields('photoUpload.typeHint')}
                    </p>
                  </div>
                  <span className='inline-flex h-9 items-center rounded-lg border border-primary px-4 text-[13px] font-semibold text-primary hover:bg-blue-50'>
                    {tFields('photoUpload.selectButton')}
                  </span>
                </button>

                <FieldError
                  className='mt-[0.5] text-[13px] sm:text-[14px]'
                  errors={errors.image ? [{ message: errors.image.message as string }] : []}
                />

                {/* File card — shows a newly selected file OR the existing server image (edit mode) */}
                {fileCardName && (
                  <div className='relative flex items-center gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3'>
                    {/* File type icon */}
                    <div className='flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10'>
                      <FileTextIcon className='size-5 text-primary' />
                    </div>

                    {/* File info */}
                    <div className='min-w-0 flex-1'>
                      <p className='truncate text-[13px] font-medium leading-[19.5px] text-text-heading'>
                        {fileCardName}
                      </p>
                      {fileCardSize && (
                        <p className='text-[12px] leading-[18px] text-text-secondary'>
                          {fileCardSize}
                        </p>
                      )}
                    </div>

                    {/* Remove button */}
                    <button
                      type='button'
                      onClick={() => {
                        setValue('image', undefined);
                        setValue('existingImageName', undefined);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className='absolute -right-2.5 -top-2.5 flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-sm transition-colors hover:bg-primary/80'
                      aria-label={tFields('photoUpload.removeFile')}
                    >
                      <span className='text-[14px] font-bold leading-none'>&times;</span>
                    </button>
                  </div>
                )}
              </Field>
            )}

            {/* Is Reusable Toggle */}
            <Controller
              name='isReusable'
              control={control}
              render={({ field }) => (
                <div className='flex items-center justify-between rounded-[8px] border border-[var(--neutral-300)] bg-white px-4 py-4'>
                  <FieldLabel className='flex flex-col gap-1 items-baseline' htmlFor='isReusable'>
                    <p className='text-[14px] font-medium leading-[21px]'>
                      {tFields('isReusable.label')}
                    </p>
                    <p className='text-[12px] leading-[18px] text-muted-foreground'>
                      {tFields('isReusable.description')}
                    </p>
                  </FieldLabel>
                  <Switch
                    id='isReusable'
                    disabled={campaignData?.isPermanent} // only allow toggling reusability for non-permanent campaigns
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-label={tFields('isReusable.label')}
                  />
                </div>
              )}
            />
          </div>
        </form>

        {/* ── Footer ── */}
        <DialogFooter className='flex h-auto min-h-[70px] shrink-0 flex-col-reverse gap-3 px-5 py-2 sm:h-[88px] sm:flex-row sm:items-center sm:justify-end sm:px-8 sm:py-0'>
          <DialogClose
            render={
              <Button
                type='button'
                variant='outline'
                className='h-[47px] flex-1 rounded-[8px] border border-[var(--neutral-300)] bg-[var(--neutral-200)] font-medium text-[var(--neutral-900)] hover:bg-[var(--neutral-300)] sm:text-[16px]'
                disabled={isSubmitting}
              >
                {t('cancelButton')}
              </Button>
            }
          />
          <Button
            type='submit'
            form='promotion-dialog-form'
            variant='default'
            isLoading={isSubmitting}
            className='h-[45px] flex-1 rounded-[8px] bg-gradient-to-b font-medium leading-[21px] sm:text-[16px]'
          >
            {config.submitButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
