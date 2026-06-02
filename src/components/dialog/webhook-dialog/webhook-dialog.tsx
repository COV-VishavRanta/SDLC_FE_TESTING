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
  ErrorBoundary,
  Field,
  FieldError,
  FieldLabel,
  FormInputField,
  PlusIcon,
} from '@/components';
import { Input } from '@/components/ui/input';
import { WebhookCredentialType } from '@/types';
import { useTranslations } from 'next-intl';
import { Controller } from 'react-hook-form';

import useWebhookDialog from './useWebhookDialog';
import { WebhookCredentialsSection } from './webhook-credentials-section';
import { type WebhookFormData } from './webhook-dialog.schema';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

type CreateWebhookDialogProps = {
  mode: 'create';
  onClose: () => void;
  onSuccess?: () => void;
};

type EditWebhookDialogProps = {
  mode: 'edit';
  credential: WebhookCredentialType;
  onClose: () => void;
  onSuccess?: () => void;
};

export type WebhookDialogProps = CreateWebhookDialogProps | EditWebhookDialogProps;

// ─────────────────────────────────────────────────────────────────────────────
// BLOCKED KEYS FOR NUMBER INPUT
// ─────────────────────────────────────────────────────────────────────────────

const BLOCKED_NUMBER_KEYS = ['.', '-', 'e', 'E', '+'];

// ─────────────────────────────────────────────────────────────────────────────
// FORM LABEL HELPER
// ─────────────────────────────────────────────────────────────────────────────

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
      className='flex items-center text-[var(--label-size)] font-[var(--font-weight-medium)] leading-[19.5px]'
      required={required}
    >
      {children}
    </FieldLabel>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN DIALOG
// ─────────────────────────────────────────────────────────────────────────────

export default function WebhookDialog(props: WebhookDialogProps) {
  const t = useTranslations('webhooks.dialog');
  const {
    config,
    handleOpenChange,
    control,
    errors,
    isSubmitting,
    register,
    onFormSubmit,
    ipFields,
    appendIp,
    removeIp,
    createdSecret,
    isCreated,
    isCreateMode,
  } = useWebhookDialog({
    mode: props.mode,
    credential: props.mode === 'edit' ? props.credential : undefined,
    onClose: props.onClose,
    onSuccess: props.onSuccess,
  });

  return (
    <ErrorBoundary>
      <Dialog open onOpenChange={handleOpenChange}>
        <DialogContent
          showCloseButton={false}
          className='flex max-h-[calc(100dvh-2rem)] w-full flex-col gap-0 overflow-hidden rounded-xl p-0 ring-0 sm:max-h-[90vh] sm:max-w-[560px]'
        >
          {/* ── Header ── */}
          <DialogHeader className='flex h-auto flex-row items-center justify-between px-5 py-5 sm:px-8 sm:py-6'>
            <div className='flex flex-col gap-1'>
              <DialogTitle>{config.title}</DialogTitle>
              <DialogDescription>{config.description}</DialogDescription>
            </div>
            <DialogClose />
          </DialogHeader>

          {/* ── Form body (scrollable) ── */}
          <form
            id='webhook-dialog-form'
            aria-label={config.title}
            onSubmit={onFormSubmit}
            className='flex-1 overflow-y-auto px-5 py-5 sm:px-8 sm:py-6'
          >
            <div className='flex flex-col gap-5'>
              {/* 1. Webhook Name */}
              <FormInputField<WebhookFormData>
                id='webhookName'
                label={t('fields.name.label')}
                placeholder={t('fields.name.placeholder')}
                error={errors.webhookName?.message}
                register={register}
                required
                disabled={isCreated}
              />

              {/* 2. Token Expiration */}
              <Field className='flex min-h-[74.5px] flex-col gap-2' aria-disabled={isCreated}>
                <FormLabel htmlFor='tokenExpirationHours' required>
                  {t('fields.tokenExpiration.label')}
                </FormLabel>
                <div className='flex items-center gap-3'>
                  <Controller
                    control={control}
                    name='tokenExpirationHours'
                    render={({ field }) => (
                      <Input
                        id='tokenExpirationHours'
                        type='number'
                        min={1}
                        step={1}
                        placeholder={t('fields.tokenExpiration.placeholder')}
                        aria-invalid={!!errors.tokenExpirationHours}
                        disabled={isCreated}
                        value={field.value ?? ''}
                        onChange={(e) => {
                          const raw = e.target.value;
                          if (raw === '') {
                            field.onChange(null);
                          } else {
                            const parsed = parseInt(raw, 10);
                            field.onChange(Number.isNaN(parsed) ? null : parsed);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (BLOCKED_NUMBER_KEYS.includes(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        className='h-[var(--input-height)] flex-1 rounded-[var(--input-radius)] border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-3 text-[14px] tracking-[-0.15px] shadow-none placeholder:text-[var(--input-placeholder)]'
                      />
                    )}
                  />
                  <span className='shrink-0 text-sm text-text-secondary'>
                    {t('fields.tokenExpiration.suffix')}
                  </span>
                </div>
                <FieldError
                  className='mt-1 text-[13px] sm:text-[14px]'
                  errors={
                    errors.tokenExpirationHours
                      ? [{ message: errors.tokenExpirationHours.message as string }]
                      : []
                  }
                />
              </Field>

              {/* 3. Allowed IPs */}
              <Field className='flex flex-col gap-2'>
                <FormLabel htmlFor='ipAllowlist-0'>{t('fields.allowedIps.label')}</FormLabel>
                <div className='flex flex-col gap-2'>
                  {ipFields.map((field, index) => (
                    <Controller
                      key={field.id}
                      control={control}
                      name={`ipAllowlist.${index}.ip`}
                      render={({ field: inputField, fieldState }) => {
                        const hasError =
                          !!fieldState.error?.message && inputField?.value?.trim() !== '';
                        return (
                          <div className='flex flex-col gap-1'>
                            <div className='flex items-center gap-2'>
                              <Input
                                {...inputField}
                                id={index === 0 ? 'ipAllowlist-0' : undefined}
                                placeholder={t('fields.allowedIps.placeholder')}
                                disabled={isCreated}
                                aria-invalid={hasError}
                                className='h-[var(--input-height)] flex-1 rounded-[var(--input-radius)] border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-3 text-[14px] tracking-[-0.15px] shadow-none placeholder:text-[var(--input-placeholder)]'
                              />
                              {/* + button on last row */}
                              {index === ipFields.length - 1 && !isCreated && (
                                <button
                                  type='button'
                                  onClick={appendIp}
                                  aria-label={t('fields.allowedIps.addButton')}
                                  className='flex size-8 shrink-0 items-center justify-center rounded-full border border-border text-primary transition-colors hover:bg-primary/10'
                                >
                                  <PlusIcon className='size-4' />
                                </button>
                              )}
                              {/* Remove button for subsequent rows */}
                              {index > 0 && !isCreated && (
                                <button
                                  type='button'
                                  onClick={() => removeIp(index)}
                                  aria-label={t('fields.allowedIps.removeButton')}
                                  className='flex size-8 shrink-0 items-center justify-center rounded-full border border-border text-destructive transition-colors hover:bg-destructive/10'
                                >
                                  <span className='text-sm font-bold leading-none'>×</span>
                                </button>
                              )}
                            </div>
                            {hasError && (
                              <FieldError
                                className='mt-0.5 text-[13px]'
                                errors={[{ message: fieldState.error?.message }]}
                              />
                            )}
                          </div>
                        );
                      }}
                    />
                  ))}
                </div>
              </Field>

              {/* 4. Client Credentials (create mode only, shown after success) */}
              {isCreateMode && isCreated && createdSecret && (
                <WebhookCredentialsSection clientSecret={createdSecret} />
              )}
            </div>
          </form>

          {/* ── Footer ── */}
          <DialogFooter className='flex flex-row gap-3 border-t border-border px-5 py-4 sm:px-8 sm:py-6'>
            <Button
              variant='outline'
              type='button'
              onClick={handleOpenChange}
              className='flex-1 h-[47px] sm:text-[16px]'
            >
              {t('buttons.cancel')}
            </Button>
            <Button
              form='webhook-dialog-form'
              type='submit'
              disabled={isSubmitting || isCreated}
              className='flex-1 h-[47px] sm:text-[16px]'
            >
              {isSubmitting
                ? isCreateMode
                  ? t('buttons.creating')
                  : t('buttons.saving')
                : isCreateMode
                  ? t('buttons.create')
                  : t('buttons.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ErrorBoundary>
  );
}
