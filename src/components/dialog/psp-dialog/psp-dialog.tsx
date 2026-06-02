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
  FormComboboxField,
  FormInputField,
} from '@/components';
import { PSPType } from '@/types';
import { useTranslations } from 'next-intl';
import { Controller } from 'react-hook-form';

import { DialogCreateSuccess } from '../dialog-create-success/dialog-create-success';
import UserDialog from '../user-dialog/user-dialog';
import { PspFormData } from './psp-dialog.schema';
import usePspDialog from './usePspDialog';

/* ─── Types ─── */
type BasePspDialogProps = {
  onClose: () => void;
  onSubmit?: () => void;
};

type CreatePspDialogProps = BasePspDialogProps & {
  mode: 'create';
  initialData?: PSPType;
};

type EditPspDialogProps = BasePspDialogProps & {
  mode: 'edit';
  initialData: PSPType;
};

export type PspDialogProps = CreatePspDialogProps | EditPspDialogProps;

/* ─── PSP Dialog ─── */
export default function PspDialog({ mode, onClose, initialData, onSubmit }: PspDialogProps) {
  const t = useTranslations('pspManagement.dialog');
  const tFields = useTranslations('pspManagement.dialog.fields');

  const {
    handleOpenChange,
    config,

    // form handlers
    errors,
    isSubmitting,
    register,
    control,
    onFormSubmit,
    setValue,

    // dropdown data
    countriesData,
    statesData,
    getStates,
    isDropdownLoading,

    // success state
    createdPsp,

    // user dialog state
    showUserDialog,
    setShowUserDialog,
    pspAdminRole,
  } = usePspDialog({ mode, initialData, onSubmit, onClose });

  /* ─── After successful create: open UserDialog ─── */
  if (showUserDialog && createdPsp) {
    return (
      <UserDialog
        mode='create'
        initialData={{
          fullName: '',
          email: '',
          role: pspAdminRole?.id ?? '',
          pspId: createdPsp.id,
        }}
        disabledFields={['role', 'pspId']}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    );
  }

  return (
    <Dialog
      open
      onOpenChange={handleOpenChange}
      disablePointerDismissal={isSubmitting || !!createdPsp}
    >
      <DialogContent
        showCloseButton={false}
        className='flex max-h-[calc(100dvh-2rem)] w-full flex-col gap-0 overflow-hidden rounded-xl p-0 ring-0 sm:max-h-[90vh] sm:max-w-[800px]'
      >
        {createdPsp ? (
          /* ── Success View ── */
          <DialogCreateSuccess
            title={t('createSuccess.title')}
            description={t('createSuccess.description')}
            entityName={createdPsp.name}
            subtitle={t('createSuccess.subtitle')}
          >
            <Button
              type='button'
              variant='default'
              onClick={() => setShowUserDialog(true)}
              disabled={!pspAdminRole}
              className='h-[45px] min-w-[220px] rounded-[8px] bg-gradient-to-b text-[14px] font-medium leading-[21px] sm:text-[16px]'
            >
              {t('createSuccess.createUserButton')}
            </Button>
          </DialogCreateSuccess>
        ) : (
          /* ── Form View ── */
          <>
            {/* ── Header ── */}
            <DialogHeader className='flex h-auto flex-row items-center justify-between sm:h-[104px]'>
              <div className='flex h-[55px] flex-col gap-1'>
                <DialogTitle>{config.title}</DialogTitle>
                <DialogDescription>{config.description}</DialogDescription>
              </div>
              <DialogClose />
            </DialogHeader>

            {/* ── Form Body (scrollable) ── */}
            {/* id="psp-dialog-form" + form attr on footer button links submit even outside <form> (WCAG 1.3.1) */}
            <form
              id='psp-dialog-form'
              aria-label={config.title}
              onSubmit={onFormSubmit}
              className='flex-1 overflow-y-auto px-4 py-4 sm:px-8 sm:py-6 mt-1'
            >
              <div className='flex flex-col gap-5'>
                {/* Company Name */}
                <FormInputField<PspFormData>
                  id='name'
                  label={tFields('name.label')}
                  required
                  error={errors?.name?.message}
                  placeholder={tFields('name.placeholder')}
                  register={register}
                />

                {/* Country + City + State (3-col) */}
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
                  {/* Country */}
                  <Controller
                    control={control}
                    name='country'
                    render={({ field }) => (
                      <FormComboboxField
                        id='country'
                        label={tFields('country.label')}
                        emptyText={tFields('country.emptyText')}
                        placeholder={tFields('country.placeholder')}
                        labelKey='name'
                        valueKey='id'
                        error={errors?.country?.message}
                        onChange={(value) => {
                          // if values are same as before, do nothing (prevents unnecessary API calls)
                          if (value === field.value) return;

                          field.onChange(value);
                          if (value) {
                            getStates({ variables: { countryId: value } });
                            setValue('state', ''); // Reset state when country changes
                            setValue('city', ''); // Reset city when country changes
                            setValue('streetAddress', ''); // Reset street address when country changes
                            setValue('zipCode', ''); // Reset zip code when country changes
                          }
                        }}
                        value={field.value}
                        items={countriesData}
                        isLoading={isDropdownLoading}
                        disabled={isDropdownLoading}
                        required
                      />
                    )}
                  />

                  {/* State */}
                  <Controller
                    control={control}
                    name='state'
                    render={({ field }) => (
                      <FormComboboxField
                        id='state'
                        label={tFields('state.label')}
                        emptyText={tFields('state.emptyText')}
                        placeholder={tFields('state.placeholder')}
                        labelKey='name'
                        valueKey='id'
                        error={errors?.state?.message}
                        onChange={(value) => {
                          // if values are same as before, do nothing (prevents unnecessary API calls)
                          if (value === field.value) return;

                          field.onChange(value);
                          if (value) {
                            setValue('city', ''); // Reset city when state changes
                            setValue('streetAddress', ''); // Reset street address when state changes
                            setValue('zipCode', ''); // Reset zip code when state changes
                          }
                        }}
                        value={field.value}
                        items={statesData}
                        isLoading={isDropdownLoading}
                        disabled={!control._formValues.country || isDropdownLoading}
                        required
                      />
                    )}
                  />

                  {/* City */}
                  <FormInputField<PspFormData>
                    id='city'
                    label={tFields('city.label')}
                    required
                    error={errors?.city?.message}
                    placeholder={tFields('city.placeholder')}
                    register={register}
                  />
                </div>

                {/* Street Address */}

                <FormInputField<PspFormData>
                  id='streetAddress'
                  label={tFields('streetAddress.label')}
                  required
                  error={errors?.streetAddress?.message}
                  placeholder={tFields('streetAddress.placeholder')}
                  register={register}
                  disabled={isDropdownLoading}
                />

                {/* Zip id + Website (2-col) */}
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                  {/* Zip Code */}
                  <FormInputField<PspFormData>
                    id='zipCode'
                    label={tFields('zipCode.label')}
                    required
                    error={errors?.zipCode?.message}
                    placeholder={tFields('zipCode.placeholder')}
                    register={register}
                  />

                  {/* Website */}
                  <FormInputField<PspFormData>
                    id='website'
                    label={tFields('website.label')}
                    error={errors?.website?.message}
                    placeholder={tFields('website.placeholder')}
                    register={register}
                  />
                </div>
              </div>
            </form>

            {/* ── Footer ── */}
            <DialogFooter className='flex h-auto min-h-[70px] shrink-0 flex-col-reverse gap-3 px-5 py-2 sm:h-[88px] sm:flex-row sm:items-center sm:justify-end sm:px-8 sm:py-0'>
              <DialogClose
                render={
                  <Button
                    type='button'
                    variant='outline'
                    className='h-[47px] flex-1 rounded-[8px] border border-border bg-input-bg font-medium leading-normal text-text-heading hover:bg-muted sm:text-[16px]'
                    disabled={isSubmitting}
                  >
                    {t('cancelButton')}
                  </Button>
                }
              />
              <Button
                type='submit'
                form='psp-dialog-form'
                variant='default'
                isLoading={isSubmitting}
                className='h-[45px] flex-1 rounded-[8px] bg-gradient-to-b font-medium leading-normal sm:text-[16px]'
              >
                {config.submitButtonText}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
