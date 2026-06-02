'use client';

import {
  Button,
  ComboboxItem,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FieldLabel,
  FormComboboxField,
  FormDatePickerField,
  FormInputField,
  FormTextareaField,
  Switch,
} from '@/components';
import { CampaignType } from '@/types';
import { useTranslations } from 'next-intl';
import { Controller, useWatch } from 'react-hook-form';
import { CampaignFormData } from './campaign-dialog.schema';
import useCampaignDialog from './useCampaignDialog';

/* ─── Types ─── */
type BaseCampaignDialogProps = {
  onClose: () => void;
  onSubmit?: () => void;
  /** When true, hides the Campaign Manager dropdown and auto-fills with the current user. */
  isCampaignManagerRole?: boolean;
};

type CreateCampaignDialogProps = BaseCampaignDialogProps & {
  mode: 'create';
  initialData?: CampaignType;
};

type EditCampaignDialogProps = BaseCampaignDialogProps & {
  mode: 'edit';
  initialData: CampaignType;
};

export type CampaignDialogProps = CreateCampaignDialogProps | EditCampaignDialogProps;

/* ─── Create/Edit Campaign Dialog ─── */
export default function CampaignDialog({
  mode,
  onClose,
  initialData,
  onSubmit,
  isCampaignManagerRole,
}: CampaignDialogProps) {
  const t = useTranslations('campaignManagement.dialog');
  const tFields = useTranslations('campaignManagement.dialog.fields');

  const {
    handleOpenChange,
    config,
    isManagerOnlyEdit,

    // form handlers
    errors,
    isSubmitting,
    register,
    control,
    onFormSubmit,

    // dropdown data
    campaignManagersData,
    isCampaignManagersLoading,
  } = useCampaignDialog({ mode, initialData, onSubmit, onClose, isCampaignManagerRole });

  const watchedStartDate = useWatch({ control, name: 'startDate' });

  // Compute tomorrow at local midnight for calendar constraints
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // Parse the watched startDate string (YYYY-MM-DD) into a local Date
  const parsedStartDate = watchedStartDate
    ? (() => {
        const [y, m, d] = watchedStartDate.split('-').map(Number);
        return new Date(y, (m as number) - 1, d as number);
      })()
    : null;

  // startDate: tomorrow or later
  const startDateDisabled = { before: tomorrow };

  // endDate: strictly after startDate (if set), else tomorrow or later
  const endDateDisabled = parsedStartDate
    ? {
        before: new Date(
          parsedStartDate.getFullYear(),
          parsedStartDate.getMonth(),
          parsedStartDate.getDate() + 1,
        ),
      }
    : { before: tomorrow };

  // shipByDate: tomorrow or later AND strictly before startDate
  // Use a function matcher for "on or after startDate" because { from } with no `to`
  // only matches the exact `from` date in react-day-picker.
  const shipByDateDisabled = parsedStartDate
    ? [{ before: tomorrow }, (date: Date) => date >= parsedStartDate]
    : [{ before: tomorrow }];

  return (
    <>
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
          {/* id="campaign-dialog-form" + form attr on footer button links submit even outside <form> (WCAG 1.3.1) */}
          <form
            id='campaign-dialog-form'
            aria-label={config.title}
            onSubmit={onFormSubmit}
            className='flex-1 overflow-y-auto px-4 py-4 sm:pl-8 sm:pr-6 sm:py-6'
          >
            <div className='flex flex-col gap-5'>
              {/* Campaign Name */}
              <FormInputField<CampaignFormData>
                id='campaignName'
                label={tFields('campaignName.label')}
                required
                error={errors?.campaignName?.message}
                placeholder={tFields('campaignName.placeholder')}
                register={register}
                disabled={isManagerOnlyEdit}
              />

              {/* Campaign Objective */}
              <FormInputField<CampaignFormData>
                id='campaignObjective'
                label={tFields('campaignObjective.label')}
                required
                error={errors?.campaignObjective?.message}
                placeholder={tFields('campaignObjective.placeholder')}
                register={register}
                disabled={isManagerOnlyEdit}
              />

              {/* Description */}
              <FormTextareaField<CampaignFormData>
                id='description'
                label={tFields('description.label')}
                error={errors?.description?.message}
                placeholder={tFields('description.placeholder')}
                register={register}
                required
                disabled={isManagerOnlyEdit}
              />

              {/* Is Permanent Campaign Toggle */}
              <Controller
                name='isPermanent'
                control={control}
                render={({ field }) => (
                  <div className='flex items-center justify-between rounded-[8px] border border-[var(--neutral-300)] bg-white px-4 py-4'>
                    <FieldLabel htmlFor='isPermanent' className='flex flex-col gap-1'>
                      <p className='text-[14px] font-medium leading-[21px] w-full'>
                        {tFields('isPermanent.label')}
                      </p>
                      <p className='text-[12px] leading-[18px] text-muted-foreground'>
                        {tFields('isPermanent.description')}
                      </p>
                    </FieldLabel>
                    <Switch
                      id='isPermanent'
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-label={tFields('isPermanent.label')}
                      disabled={isManagerOnlyEdit}
                    />
                  </div>
                )}
              />

              {/* Dates: Start + End (3-col if permanent, 2-col otherwise) */}
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <FormDatePickerField<CampaignFormData>
                  id='startDate'
                  label={tFields('startDate.label')}
                  required
                  placeholder={tFields('startDate.placeholder')}
                  error={errors?.startDate?.message}
                  control={control}
                  disabled={isManagerOnlyEdit}
                  disabledDates={startDateDisabled}
                />

                <FormDatePickerField<CampaignFormData>
                  id='endDate'
                  label={tFields('endDate.label')}
                  required
                  placeholder={tFields('endDate.placeholder')}
                  error={errors?.endDate?.message}
                  control={control}
                  disabled={isManagerOnlyEdit}
                  disabledDates={endDateDisabled}
                />
              </div>

              {/* Ship By Date */}
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <FormDatePickerField<CampaignFormData>
                  id='shipByDate'
                  label={tFields('shipByDate.label')}
                  required
                  placeholder={tFields('shipByDate.placeholder')}
                  error={errors?.shipByDate?.message}
                  control={control}
                  disabled={isManagerOnlyEdit}
                  disabledDates={shipByDateDisabled}
                />
                {/* Campaign Manager — hidden for Campaign Manager role (auto-filled with self) */}
                {!isCampaignManagerRole && (
                  <Controller
                    control={control}
                    name='campaignManagerId'
                    render={({ field }) => (
                      <FormComboboxField
                        id='campaignManagerId'
                        label={tFields('campaignManager.label')}
                        placeholder={tFields('campaignManager.placeholder')}
                        emptyText={tFields('campaignManager.emptyText')}
                        labelKey='name'
                        valueKey='id'
                        error={errors?.campaignManagerId?.message}
                        onChange={(value) => field.onChange(value ?? '')}
                        value={field.value ?? ''}
                        items={campaignManagersData.map((m) => ({
                          id: m.id,
                          name: m.name,
                        }))}
                        isLoading={isCampaignManagersLoading}
                        disabled={isCampaignManagersLoading}
                        renderItem={(item) => (
                          <ComboboxItem key={item.id} value={item}>
                            {item.name}
                          </ComboboxItem>
                        )}
                      />
                    )}
                  />
                )}
              </div>
            </div>
          </form>

          {/* ── Footer ── */}
          <DialogFooter className='flex h-auto min-h-[70px] shrink-0 flex-col-reverse items-stretch gap-3 px-5 py-2 sm:h-[88px] sm:flex-row sm:items-center sm:justify-end sm:px-8 sm:py-0'>
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
              form='campaign-dialog-form'
              variant='default'
              isLoading={isSubmitting}
              className='h-[45px] flex-1 rounded-[8px] bg-gradient-to-b font-medium leading-[21px] sm:text-[16px]'
            >
              {config.submitButtonText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
