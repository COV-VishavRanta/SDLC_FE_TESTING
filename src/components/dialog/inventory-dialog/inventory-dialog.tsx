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
  FormComboboxField,
  FormInputField,
  FormTextareaField,
} from '@/components';
import { InventoryType } from '@/types';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';
import { Controller, useWatch } from 'react-hook-form';

import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { InventoryFormData } from './inventory-dialog.schema';
import useInventoryDialog from './useInventoryDialog';

/* ─── Helpers ─── */
function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* ─── Types ─── */
type BaseInventoryDialogProps = {
  onClose: () => void;
  onSubmit?: () => void;
  /** When true only the Available Quantity field is editable (Production Operator). */
  quantityOnly?: boolean;
};

type CreateInventoryDialogProps = BaseInventoryDialogProps & {
  mode: 'create';
  initialData?: InventoryType;
};

type EditInventoryDialogProps = BaseInventoryDialogProps & {
  mode: 'edit';
  initialData: InventoryType;
};

export type InventoryDialogProps = CreateInventoryDialogProps | EditInventoryDialogProps;

/* ─── Inventory Dialog ─── */
export default function InventoryDialog({
  mode,
  onClose,
  initialData,
  onSubmit,
  quantityOnly = false,
}: InventoryDialogProps) {
  const t = useTranslations('inventoryManagement.inventoryDialog');
  const tFields = useTranslations('inventoryManagement.inventoryDialog.fields');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    config,
    brands,
    handleOpenChange,

    // form handlers
    errors,
    isSubmitting,
    register,
    control,
    setValue,
    onFormSubmit,

    // loading states
    brandsLoading,
  } = useInventoryDialog({
    mode,
    initialData,
    onSubmit,
    onClose,
    quantityOnly,
  } as InventoryDialogProps);

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
          id='inventory-dialog-form'
          aria-label={config.title}
          onSubmit={onFormSubmit}
          className='flex-1 overflow-y-auto px-4 py-4 sm:pl-8 sm:pr-6 sm:py-6'
        >
          <div className='flex flex-col gap-5'>
            {/* Item Name */}
            <FormInputField<InventoryFormData>
              id='name'
              label={tFields('name.label')}
              required
              error={errors?.name?.message}
              placeholder={tFields('name.placeholder')}
              register={register}
              disabled={quantityOnly}
            />

            {/* Width + Height (2-col) */}
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <FormInputField<InventoryFormData>
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
                disabled={quantityOnly}
              />

              <FormInputField<InventoryFormData>
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
                disabled={quantityOnly}
              />
            </div>

            {/* Available Quantity */}
            <FormInputField<InventoryFormData>
              id='availableQuantity'
              label={tFields('availableQuantity.label')}
              type='number'
              step='1'
              min='0'
              error={errors?.availableQuantity?.message}
              placeholder={tFields('availableQuantity.placeholder')}
              register={register}
              registerOptions={{ setValueAs: (v: string) => (v === '' ? undefined : Number(v)) }}
            />

            {/* Brand (combobox with loading + empty state) */}
            <Controller
              name='brandId'
              control={control}
              render={({ field }) => (
                <FormComboboxField
                  id='brandId'
                  label={tFields('brand.label')}
                  emptyText={tFields('brand.emptyText')}
                  error={errors?.brandId?.message}
                  placeholder={tFields('brand.placeholder')}
                  items={brands}
                  labelKey='name'
                  valueKey='id'
                  value={field.value ?? null}
                  onChange={field.onChange}
                  isLoading={brandsLoading}
                  disabled={brandsLoading || quantityOnly}
                  required
                />
              )}
            />

            {/* Material */}
            <FormInputField<InventoryFormData>
              id='material'
              label={tFields('material.label')}
              error={errors?.material?.message}
              placeholder={tFields('material.placeholder')}
              register={register}
              disabled={quantityOnly}
            />

            {/* Finishing Specification */}
            <FormTextareaField<InventoryFormData>
              id='specifications'
              label={tFields('specifications.label')}
              error={errors?.specifications?.message}
              placeholder={tFields('specifications.placeholder')}
              register={register}
              disabled={quantityOnly}
            />

            {/* Description */}
            <FormTextareaField<InventoryFormData>
              id='description'
              label={tFields('description.label')}
              error={errors?.description?.message}
              placeholder={tFields('description.placeholder')}
              register={register}
              disabled={quantityOnly}
            />

            {/* Photo Upload — hidden for quantity-only editors */}
            {!quantityOnly && (
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
                      <FileTextIcon className='size-5 text-primary' aria-hidden='true' />
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
            form='inventory-dialog-form'
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
