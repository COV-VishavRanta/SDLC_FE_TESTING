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
import { useTranslations } from 'next-intl';
import { Controller } from 'react-hook-form';

import { DialogCreateSuccess } from '../dialog-create-success/dialog-create-success';
import UserDialog from '../user-dialog/user-dialog';
import { BrandFormData } from './brand-dialog.schema';
import useBrandDialog from './useBrandDialog';

/* ─── Types ─── */
export interface BrandInitialData {
  id?: string;
  name: string;
  countryId?: string;
  stateId?: string;
  cityName?: string;
  streetAddress?: string;
  zipCode?: number | string;
  website?: string;
}

type BaseBrandDialogProps = {
  onClose: () => void;
  onSubmit?: (data: BrandFormData) => void;
};

type CreateBrandDialogProps = BaseBrandDialogProps & {
  mode: 'create';
  initialData?: BrandInitialData;
};

type EditBrandDialogProps = BaseBrandDialogProps & {
  mode: 'edit';
  initialData: BrandInitialData & { id: string };
};

export type BrandDialogProps = CreateBrandDialogProps | EditBrandDialogProps;

/* ─── Brand Dialog ─── */
export default function BrandDialog({ mode, onClose, initialData, onSubmit }: BrandDialogProps) {
  const t = useTranslations('brandManagement.dialog');
  const tFields = useTranslations('brandManagement.dialog.fields');

  const {
    config,
    handleOpenChange,

    // form handlers
    errors,
    isSubmitting,
    register,
    control,
    onFormSubmit,
    setValue,
    watch,

    // dropdown data
    countriesData,
    statesData,
    getStates,
    isDropdownLoading,

    // success state
    createdBrand,

    // user dialog state
    showUserDialog,
    setShowUserDialog,
    brandAdminRole,
  } = useBrandDialog({ mode, initialData, onSubmit, onClose });

  /* ─── After successful create: open UserDialog ─── */
  if (showUserDialog && createdBrand) {
    return (
      <UserDialog
        mode='create'
        initialData={{
          fullName: '',
          email: '',
          role: brandAdminRole?.id ?? '',
          brandId: createdBrand.id,
        }}
        disabledFields={['role', 'brandId']}
        onClose={onClose}
        onSubmit={onSubmit as () => void}
      />
    );
  }

  return (
    <Dialog
      open
      onOpenChange={handleOpenChange}
      disablePointerDismissal={isSubmitting || !!createdBrand}
    >
      <DialogContent
        showCloseButton={false}
        className='flex max-h-[calc(100dvh-2rem)] w-full flex-col gap-0 overflow-hidden rounded-xl p-0 ring-0 sm:max-h-[90vh] sm:max-w-[800px]'
      >
        {createdBrand ? (
          /* ── Success View ── */
          <DialogCreateSuccess
            title={t('createSuccess.title')}
            description={t('createSuccess.description')}
            entityName={createdBrand.name}
            subtitle={t('createSuccess.subtitle')}
          >
            <Button
              type='button'
              variant='default'
              onClick={() => setShowUserDialog(true)}
              disabled={!brandAdminRole}
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
            {/* id="brand-dialog-form" + form attr on footer button links submit even outside <form> (WCAG 1.3.1) */}
            <form
              id='brand-dialog-form'
              aria-label={config.title}
              onSubmit={onFormSubmit}
              className='mt-1 flex-1 overflow-y-auto px-4 py-4 sm:px-8 sm:py-6'
            >
              <div className='flex flex-col gap-5'>
                {/* Brand Name */}
                <FormInputField<BrandFormData>
                  id='name'
                  label={tFields('name.label')}
                  required
                  error={errors?.name?.message}
                  placeholder={tFields('name.placeholder')}
                  register={register}
                />

                {/* Address Group: Country / State / City / Street / Zip (WCAG 1.3.1) */}
                <div role='group' aria-label='Brand address' className='flex flex-col gap-5'>
                  {/* Country + State + City (3-col) */}
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
                            if (value === field.value) return;

                            field.onChange(value);
                            if (value) {
                              getStates({ variables: { countryId: value } });
                              setValue('state', '');
                              setValue('city', '');
                              setValue('streetAddress', '');
                              setValue('zipCode', '');
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
                            if (value === field.value) return;

                            field.onChange(value);
                            if (value) {
                              setValue('city', '');
                              setValue('streetAddress', '');
                              setValue('zipCode', '');
                            }
                          }}
                          value={field.value}
                          items={statesData}
                          isLoading={isDropdownLoading}
                          disabled={!watch('country') || isDropdownLoading}
                          required
                        />
                      )}
                    />

                    {/* City */}
                    <FormInputField<BrandFormData>
                      id='city'
                      label={tFields('city.label')}
                      required
                      error={errors?.city?.message}
                      placeholder={tFields('city.placeholder')}
                      register={register}
                    />
                  </div>

                  {/* Street Address */}
                  <FormInputField<BrandFormData>
                    id='streetAddress'
                    label={tFields('streetAddress.label')}
                    required
                    error={errors?.streetAddress?.message}
                    placeholder={tFields('streetAddress.placeholder')}
                    register={register}
                    disabled={isDropdownLoading}
                  />

                  {/* Zip Code + Website (2-col) */}
                  <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                    {/* Zip Code */}
                    <FormInputField<BrandFormData>
                      id='zipCode'
                      label={tFields('zipCode.label')}
                      required
                      error={errors?.zipCode?.message}
                      placeholder={tFields('zipCode.placeholder')}
                      register={register}
                    />

                    {/* Website */}
                    <FormInputField<BrandFormData>
                      id='website'
                      label={tFields('website.label')}
                      error={errors?.website?.message}
                      placeholder={tFields('website.placeholder')}
                      register={register}
                    />
                  </div>
                </div>
                {/* end address group */}
              </div>
            </form>

            {/* ── Footer ── */}
            <DialogFooter className='flex h-auto min-h-[70px] shrink-0 flex-col-reverse gap-3 px-5 py-2 sm:h-[88px] sm:flex-row sm:items-center sm:justify-end sm:px-8 sm:py-0'>
              <DialogClose
                render={
                  <Button
                    type='button'
                    variant='outline'
                    className='h-[47px] flex-1 rounded-[8px] border border-[#e5e7eb] text-[14px] font-medium leading-[21px] text-[#1a1d21] sm:text-[16px]'
                    disabled={isSubmitting}
                  >
                    {t('cancelButton')}
                  </Button>
                }
              />
              <Button
                type='submit'
                form='brand-dialog-form'
                variant='default'
                isLoading={isSubmitting}
                className='h-[45px] flex-1 rounded-[8px] bg-gradient-to-b text-[14px] font-medium leading-[21px] sm:text-[16px]'
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
