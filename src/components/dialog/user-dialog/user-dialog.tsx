'use client';

import {
  Button,
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  ErrorBoundary,
  Field,
  FieldError,
  FieldLabel,
  FormComboboxField,
  FormInputField,
  useComboboxAnchor,
} from '@/components';
import { StoreType, UserType } from '@/types';
import { useTranslations } from 'next-intl';
import { Controller } from 'react-hook-form';

import { getRoleLabel } from '@/lib/utils';
import { type UserFormData } from './user-dialog.schema';
import useUserDialog from './useUserDialog';

/* ─── Types ─── */
type BaseUserDialogProps = {
  onSubmit?: (data: UserType) => void;
  onClose: () => void;
  disabledFields?: (keyof UserFormData)[];
  hiddenFields?: (keyof UserFormData)[];
  /** When true, the dialog close button and pointer dismissal are enabled even if disabledFields is set */
  isDismissible?: boolean;
  /** When true (self/profile edit), only fullName is sent in the update API call */
  selfEdit?: boolean;
};

type CreateUserDialogProps = BaseUserDialogProps & {
  mode: 'create';
  initialData?: UserFormData; // optional
};

type EditUserDialogProps = BaseUserDialogProps & {
  mode: 'edit';
  initialData: UserFormData & { userId: string; isPending: boolean };
};

export type UserDialogProps = CreateUserDialogProps | EditUserDialogProps;

/* ─── Form Label ─── */
function FormLabel({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <FieldLabel
      htmlFor={htmlFor}
      className='flex items-center text-[var(--label-size)] font-[var(--font-weight-medium)] leading-[19.5px] '
      required={required}
    >
      {children}
    </FieldLabel>
  );
}

/* ─── Create User Dialog ─── */
export default function UserDialog({
  mode,
  initialData,
  onSubmit,
  onClose,
  disabledFields = [],
  hiddenFields = [],
  isDismissible,
  selfEdit,
}: UserDialogProps) {
  const t = useTranslations('userManagement');
  const tRoles = useTranslations('roles');
  const multiStoreAnchorRef = useComboboxAnchor();
  const {
    config,

    // form handling
    control,
    errors,
    isSubmitting,
    register,
    handleOpenChange,
    onFormSubmit,

    // permission-driven role list
    allowedRoles,
    resetEntityFields,

    // conditional field visibility
    showPspDropdown,
    showBrandDropdown,
    showStoreDropdown,
    isStoreMultiSelect,

    // PSP dropdown data
    psps,
    pspsLoading,

    // Brand dropdown data
    brands,
    brandsLoading,

    // Store dropdown data
    stores,
    storesLoading,

    // Campaign names returned when update fails due to active campaigns
    updateCampaignNames,
  } = useUserDialog({ mode, initialData, onSubmit, onClose, selfEdit });

  const sortedAllowedRoles = [...allowedRoles].sort((a, b) => a.name.localeCompare(b.name));

  const sortedPsps = [...psps].sort((a, b) => a.name.localeCompare(b.name));
  const sortedBrands = [...brands].sort((a, b) => a.name.localeCompare(b.name));

  const sortedStores = [...stores].sort((a, b) => a.name.localeCompare(b.name));

  const rolesWithLabel = sortedAllowedRoles.map((role) => ({
    ...role,
    displayName: getRoleLabel(role.name, tRoles),
  }));
  const activePsps = sortedPsps.filter((psp) => psp.isActive);
  const activeBrands = sortedBrands.filter((b) => b.isActive);
  const activeStores = sortedStores.filter((s) => s.isActive);

  return (
    <ErrorBoundary>
      <Dialog
        open
        onOpenChange={handleOpenChange}
        disablePointerDismissal={isDismissible ? false : !!disabledFields.length}
      >
        <DialogContent
          showCloseButton={false}
          className='flex max-h-[calc(100dvh-2rem)] w-full flex-col gap-0 overflow-hidden rounded-xl p-0 ring-0 sm:max-h-[90vh] sm:max-w-[600px]'
        >
          {/* ── Header ── */}
          <DialogHeader className='flex h-auto flex-row items-center justify-between sm:h-[104px]'>
            <div className='flex h-[55px] flex-col gap-1'>
              <DialogTitle>{config.title}</DialogTitle>
              <DialogDescription>{config.description}</DialogDescription>
            </div>
            {(isDismissible ?? !disabledFields.length) && <DialogClose />}
          </DialogHeader>

          {/* ── Form Body (scrollable) ── */}
          {/* id="user-dialog-form" + form attr on footer button keeps submit semantic outside form (WCAG 1.3.1) */}
          <form
            id='user-dialog-form'
            aria-label={config.title}
            onSubmit={onFormSubmit}
            className='flex-1 overflow-y-auto px-5 py-5 sm:px-8 sm:py-6'
          >
            <div className='flex flex-col gap-5'>
              {/* Full Name */}
              {!hiddenFields.includes('fullName') && (
                <FormInputField<UserFormData>
                  id='fullName'
                  label={t('userDialog.fields.fullName.label')}
                  error={errors?.fullName?.message}
                  placeholder={t('userDialog.fields.fullName.placeholder')}
                  register={register}
                  required
                />
              )}

              {/* Email Address */}
              {!hiddenFields.includes('email') && (
                <FormInputField<UserFormData>
                  id='email'
                  label={t('userDialog.fields.email.label')}
                  error={errors?.email?.message}
                  placeholder={t('userDialog.fields.email.placeholder')}
                  register={register}
                  disabled={
                    disabledFields.includes('email') || (mode === 'edit' && initialData?.isPending)
                  }
                  type='email'
                  required
                />
              )}

              {/* User Role – hidden when the current admin type has no creatable roles */}
              {sortedAllowedRoles.length > 0 && !hiddenFields.includes('role') && (
                <Controller
                  control={control}
                  name='role'
                  render={({ field, fieldState: { error } }) => (
                    <FormComboboxField
                      id='create-user-role'
                      label={t('userDialog.fields.userRole.label')}
                      required
                      items={rolesWithLabel}
                      labelKey='displayName'
                      valueKey='id'
                      value={field.value ?? null}
                      onChange={(value) => {
                        if (value && value !== field.value) {
                          field.onChange(value);
                          resetEntityFields();
                        }
                      }}
                      placeholder={t('userDialog.fields.userRole.placeholder')}
                      emptyText={t('userDialog.fields.userRole.emptyText')}
                      disabled={disabledFields.includes('role')}
                      error={error?.message}
                    />
                  )}
                />
              )}

              {/* Assigned PSP – Platform Admin creating PSP Admin */}
              {showPspDropdown && !hiddenFields.includes('pspId') && (
                <Controller
                  control={control}
                  name='pspId'
                  render={({ field, fieldState: { error } }) => (
                    <FormComboboxField
                      id='assigned-psp'
                      label={t('userDialog.fields.assignedPsp.label')}
                      required
                      items={activePsps}
                      labelKey='name'
                      valueKey='id'
                      value={field.value ?? null}
                      onChange={(value) => field.onChange(value ?? '')}
                      placeholder={
                        pspsLoading
                          ? t('userDialog.fields.assignedPsp.loadingPlaceholder')
                          : t('userDialog.fields.assignedPsp.placeholder')
                      }
                      emptyText={
                        pspsLoading
                          ? t('userDialog.fields.assignedPsp.loadingPlaceholder')
                          : t('userDialog.fields.assignedPsp.emptyText')
                      }
                      disabled={disabledFields.includes('pspId')}
                      isLoading={pspsLoading}
                      error={error?.message}
                    />
                  )}
                />
              )}

              {/* Assigned Brand – PSP Admin creating Brand Admin */}
              {showBrandDropdown && !hiddenFields.includes('brandId') && (
                <Controller
                  control={control}
                  name='brandId'
                  render={({ field, fieldState: { error } }) => (
                    <FormComboboxField
                      id='assigned-brand'
                      label={t('userDialog.fields.assignedBrand.label')}
                      required
                      items={activeBrands}
                      labelKey='name'
                      valueKey='id'
                      value={field.value ?? null}
                      onChange={(value) => field.onChange(value ?? '')}
                      placeholder={
                        brandsLoading
                          ? t('userDialog.fields.assignedBrand.loadingPlaceholder')
                          : t('userDialog.fields.assignedBrand.placeholder')
                      }
                      emptyText={
                        brandsLoading
                          ? t('userDialog.fields.assignedBrand.loadingPlaceholder')
                          : t('userDialog.fields.assignedBrand.emptyText')
                      }
                      disabled={disabledFields.includes('brandId')}
                      isLoading={brandsLoading}
                      error={error?.message}
                    />
                  )}
                />
              )}

              {/* Assigned Store – Brand Admin creating Store Admin (single select) */}
              {showStoreDropdown && !isStoreMultiSelect && !hiddenFields.includes('storeIds') && (
                <Controller
                  control={control}
                  name='storeIds'
                  render={({ field, fieldState: { error } }) => (
                    <FormComboboxField
                      id='assigned-store'
                      label={t('userDialog.fields.assignedStore.label')}
                      required
                      items={activeStores}
                      labelKey='name'
                      valueKey='id'
                      value={field.value?.[0] ?? null}
                      onChange={(value) => {
                        if (value) field.onChange([value]);
                      }}
                      placeholder={
                        storesLoading
                          ? t('userDialog.fields.assignedStore.loadingPlaceholder')
                          : t('userDialog.fields.assignedStore.placeholder')
                      }
                      emptyText={
                        storesLoading
                          ? t('userDialog.fields.assignedStore.loadingPlaceholder')
                          : t('userDialog.fields.assignedStore.emptyText')
                      }
                      disabled={disabledFields.includes('storeIds')}
                      isLoading={storesLoading}
                      error={error?.message}
                    />
                  )}
                />
              )}

              {/* Assigned Stores – Brand Admin creating Regional Manager (multi-select) */}
              {showStoreDropdown && isStoreMultiSelect && !hiddenFields.includes('storeIds') && (
                <Field className='flex min-h-[72px] flex-col gap-2'>
                  <FormLabel htmlFor='assigned-stores-multi' required>
                    {t('userDialog.fields.assignedStores.label')}
                  </FormLabel>
                  <Controller
                    control={control}
                    name='storeIds'
                    render={({ field, fieldState: { error } }) => {
                      const selectedStoreObjects = activeStores.filter((s) =>
                        field.value?.includes(s.id),
                      );
                      return (
                        <>
                          <Combobox
                            items={activeStores}
                            itemToStringLabel={(item: StoreType) => item.name}
                            itemToStringValue={(item: StoreType) => item.id}
                            value={selectedStoreObjects}
                            onValueChange={(items: StoreType[]) =>
                              field.onChange(items.map((s) => s.id))
                            }
                            multiple
                            disabled={storesLoading || disabledFields.includes('storeIds')}
                          >
                            <ComboboxChips
                              ref={multiStoreAnchorRef}
                              id='assigned-stores-multi'
                              aria-invalid={!!error}
                            >
                              {selectedStoreObjects.map((store) => (
                                <ComboboxChip key={store.id} value={store}>
                                  {store.name}
                                </ComboboxChip>
                              ))}
                              <ComboboxChipsInput
                                placeholder={
                                  storesLoading
                                    ? t('userDialog.fields.assignedStores.loadingPlaceholder')
                                    : selectedStoreObjects.length === 0
                                      ? t('userDialog.fields.assignedStores.placeholder')
                                      : ''
                                }
                                disabled={storesLoading || disabledFields.includes('storeIds')}
                              />
                            </ComboboxChips>
                            <ComboboxContent anchor={multiStoreAnchorRef}>
                              <ComboboxEmpty>
                                {storesLoading
                                  ? t('userDialog.fields.assignedStores.loadingPlaceholder')
                                  : t('userDialog.fields.assignedStores.emptyText')}
                              </ComboboxEmpty>
                              <ComboboxList>
                                {(item: StoreType) => (
                                  <ComboboxItem key={item.id} value={item}>
                                    {item.name}
                                  </ComboboxItem>
                                )}
                              </ComboboxList>
                            </ComboboxContent>
                          </Combobox>
                          <FieldError errors={error ? [{ message: error.message }] : []} />
                        </>
                      );
                    }}
                  />
                </Field>
              )}
            </div>

            {/* Campaign Names Error – shown when update returns success:false with campaign names */}
            {mode === 'edit' && updateCampaignNames !== null && (
              <div
                role='alert'
                aria-atomic='true'
                className='mt-5 flex gap-3 rounded-lg border border-red-300 bg-red-50 px-4 py-3'
              >
                <div className='flex flex-col gap-1'>
                  <p className='text-[13px] leading-[19px] text-red-600'>
                    {t('userDialog.campaignNamesError.description')}
                  </p>
                  <ul
                    className='mt-1 list-inside list-disc space-y-0.5'
                    aria-label={t('userDialog.campaignNamesError.campaignsListLabel')}
                  >
                    {updateCampaignNames.map((name) => (
                      <li key={name} className='text-[13px] font-bold leading-[19px] text-red-600'>
                        {name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </form>

          {/* ── Footer ── */}
          <DialogFooter className='flex h-auto shrink-0 flex-col-reverse gap-3 px-5 py-3 sm:h-[88px] sm:flex-row sm:items-center sm:justify-end sm:px-8 sm:pb-0 sm:pt-px'>
            {(isDismissible ?? !disabledFields.length) && (
              <DialogClose
                render={
                  <Button
                    type='button'
                    variant='outline'
                    className='h-[47px] flex-1 sm:text-[16px]'
                  >
                    {t('userDialog.cancelButton')}
                  </Button>
                }
              />
            )}
            {/* form="user-dialog-form" links this button to the form above so type="submit" works even outside the form element */}
            <Button
              type='submit'
              form='user-dialog-form'
              variant='default'
              isLoading={isSubmitting}
              className='h-[45px] flex-1 sm:text-[16px]'
            >
              {isSubmitting ? t('userDialog.submitting') : config.submitButtonText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ErrorBoundary>
  );
}
