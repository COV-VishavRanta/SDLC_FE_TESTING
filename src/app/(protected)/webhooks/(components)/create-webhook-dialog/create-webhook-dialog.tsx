'use client';

import {
  Button,
  Card,
  CloseIcon,
  CopyIcon,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Field,
  FieldError,
  FieldLabel,
  Input,
  PlusIcon,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components';
import { useTranslations } from 'next-intl';
import { Controller } from 'react-hook-form';

import useCreateWebhookDialog from './useCreateWebhookDialog';

interface CreateWebhookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
}

export default function CreateWebhookDialog({
  open,
  onOpenChange,
  onCreated,
}: CreateWebhookDialogProps) {
  const t = useTranslations('webhooks.dialog');
  const tValidation = useTranslations('webhooks.validation');

  const {
    control,
    errors,
    fields,
    isBusy,
    revealPayload,
    register,
    tokenExpiryOptions,
    addIpAllowlistEntry,
    removeIpAllowlistEntry,
    copyToClipboard,
    handleOpenChange,
    onFormSubmit,
    closeAndReset,
  } = useCreateWebhookDialog({ onOpenChange, onCreated });

  return (
    <Dialog open={open} onOpenChange={handleOpenChange} disablePointerDismissal={isBusy}>
      <DialogContent
        showCloseButton={false}
        className='flex max-h-[calc(100dvh-2rem)] w-full flex-col gap-0 overflow-hidden rounded-xl p-0 ring-0 sm:max-h-[90vh] sm:max-w-[640px]'
      >
        <DialogHeader className='flex h-auto flex-row items-center justify-between sm:h-[104px]'>
          <div className='flex h-[55px] flex-col gap-1'>
            <DialogTitle>{t('title')}</DialogTitle>
            <DialogDescription>{t('description')}</DialogDescription>
          </div>
          <DialogClose />
        </DialogHeader>

        {revealPayload ? (
          <div className='flex-1 overflow-y-auto px-4 py-4 sm:px-8 sm:py-6 mt-1'>
            <Card className='rounded-xl border border-border p-4 sm:p-5'>
              <p className='text-sm font-medium text-text-heading'>{t('secretNoticeTitle')}</p>
              <p className='mt-1 text-xs text-text-secondary'>{t('secretNoticeDescription')}</p>

              <div className='mt-4 space-y-3'>
                <Field>
                  <FieldLabel>{t('fields.clientId.label')}</FieldLabel>
                  <div className='flex gap-2'>
                    <Input value={revealPayload.credential.clientId} readOnly />
                    <Button
                      type='button'
                      variant='outline'
                      className='shrink-0'
                      onClick={() => copyToClipboard(revealPayload.credential.clientId)}
                    >
                      <CopyIcon className='size-4' />
                    </Button>
                  </div>
                </Field>

                <Field>
                  <FieldLabel>{t('fields.clientSecret.label')}</FieldLabel>
                  <div className='flex gap-2'>
                    <Input value={revealPayload.clientSecret} readOnly />
                    <Button
                      type='button'
                      variant='outline'
                      className='shrink-0'
                      onClick={() => copyToClipboard(revealPayload.clientSecret)}
                    >
                      <CopyIcon className='size-4' />
                    </Button>
                  </div>
                </Field>
              </div>
            </Card>
          </div>
        ) : (
          <form
            id='create-webhook-dialog-form'
            aria-label={t('title')}
            onSubmit={onFormSubmit}
            className='flex-1 overflow-y-auto px-4 py-4 sm:px-8 sm:py-6 mt-1'
          >
            <div className='space-y-5'>
              <Field>
                <FieldLabel htmlFor='label'>{t('fields.label.label')}</FieldLabel>
                <Input
                  id='label'
                  placeholder={t('fields.label.placeholder')}
                  aria-invalid={Boolean(errors.label)}
                  {...register('label')}
                />
                <FieldError
                  errors={
                    errors.label?.message
                      ? [
                          {
                            message: tValidation(
                              errors.label.message as Parameters<typeof tValidation>[0],
                            ),
                          },
                        ]
                      : []
                  }
                />
              </Field>

              <Field>
                <FieldLabel htmlFor='tokenExpirationHours'>
                  {t('fields.tokenExpirationHours.label')}
                </FieldLabel>
                <Controller
                  name='tokenExpirationHours'
                  control={control}
                  render={({ field }) => (
                    <Select
                      aria-label={t('fields.tokenExpirationHours.label')}
                      value={String(field.value)}
                      onValueChange={(value) => field.onChange(Number(value))}
                      itemToStringLabel={(selectedItem: string) =>
                        tokenExpiryOptions.find((item) => String(item.value) === selectedItem)
                          ?.label ?? ''
                      }
                    >
                      <SelectTrigger
                        id='tokenExpirationHours'
                        aria-label={t('fields.tokenExpirationHours.label')}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent alignItemWithTrigger={false}>
                        {tokenExpiryOptions.map((option) => (
                          <SelectItem key={option.value} value={String(option.value)}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError
                  errors={
                    errors.tokenExpirationHours?.message
                      ? [
                          {
                            message: tValidation(
                              errors.tokenExpirationHours.message as Parameters<
                                typeof tValidation
                              >[0],
                            ),
                          },
                        ]
                      : []
                  }
                />
              </Field>

              <Field>
                <div className='flex items-center justify-between'>
                  <FieldLabel>{t('fields.ipAllowlist.label')}</FieldLabel>
                  <Button
                    type='button'
                    variant='outline'
                    className='h-8 px-3'
                    onClick={addIpAllowlistEntry}
                  >
                    <PlusIcon className='size-4' />
                    {t('fields.ipAllowlist.addButton')}
                  </Button>
                </div>

                <div className='space-y-2'>
                  {fields.map((field, index) => (
                    <div key={field.id}>
                      <div className='flex items-center gap-2'>
                        <Input
                          placeholder={t('fields.ipAllowlist.placeholder')}
                          aria-invalid={Boolean(errors.ipAllowlist?.[index]?.value)}
                          {...register(`ipAllowlist.${index}.value` as const)}
                        />
                        <Button
                          type='button'
                          variant='outline'
                          className='h-10 px-3'
                          disabled={fields.length === 1}
                          onClick={() => removeIpAllowlistEntry(index)}
                        >
                          <CloseIcon className='size-4' />
                        </Button>
                      </div>
                      <FieldError
                        errors={
                          errors.ipAllowlist?.[index]?.value?.message
                            ? [
                                {
                                  message: tValidation(
                                    errors.ipAllowlist[index]?.value?.message as Parameters<
                                      typeof tValidation
                                    >[0],
                                  ),
                                },
                              ]
                            : []
                        }
                      />
                    </div>
                  ))}
                </div>
              </Field>

              <Card className='rounded-lg border border-border bg-page-control p-3'>
                <p className='text-sm font-medium text-text-heading'>{t('warningTitle')}</p>
                <p className='text-xs text-text-secondary mt-1'>{t('warningDescription')}</p>
              </Card>
            </div>
          </form>
        )}

        <DialogFooter className='flex h-auto min-h-[70px] shrink-0 flex-col-reverse gap-3 px-5 py-2 sm:h-[88px] sm:flex-row sm:items-center sm:justify-end sm:px-8 sm:py-0'>
          <Button
            type='button'
            variant='outline'
            className='h-[47px] flex-1 rounded-[8px] border border-border bg-input-bg font-medium leading-normal text-text-heading hover:bg-muted sm:text-[16px]'
            disabled={isBusy}
            onClick={closeAndReset}
          >
            {revealPayload ? t('doneButton') : t('cancelButton')}
          </Button>

          {!revealPayload ? (
            <Button
              type='submit'
              form='create-webhook-dialog-form'
              variant='default'
              isLoading={isBusy}
              className='h-[45px] flex-1 rounded-[8px] bg-gradient-to-b font-medium leading-normal sm:text-[16px]'
            >
              {t('submitButton')}
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
