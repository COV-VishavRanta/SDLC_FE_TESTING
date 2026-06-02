'use client';

import {
  CREATE_WEBHOOK_CREDENTIAL,
  CreateWebhookCredentialResponse,
  CreateWebhookCredentialVariables,
  UPDATE_WEBHOOK_CREDENTIAL,
  UpdateWebhookCredentialResponse,
  UpdateWebhookCredentialVariables,
} from '@/graphql';
import { WebhookCredentialType } from '@/types';
import { useMutation } from '@apollo/client/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useCallback, useRef, useState } from 'react';
import { type Resolver, useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import {
  WebhookFormData,
  WebhookValidationMessages,
  createWebhookDialogSchema,
} from './webhook-dialog.schema';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface UseWebhookDialogProps {
  mode: 'create' | 'edit';
  credential?: WebhookCredentialType;
  onClose: () => void;
  onSuccess?: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────────────────────────────────────

export default function useWebhookDialog({
  mode,
  credential,
  onClose,
  onSuccess,
}: UseWebhookDialogProps) {
  const t = useTranslations('webhooks.dialog');
  const isCreateMode = mode === 'create';

  /* ── Validation messages ── */
  const validationMessages: WebhookValidationMessages = {
    nameRequired: t('validation.nameRequired'),
    nameMaxLength: t('validation.nameMaxLength'),
    tokenRequired: t('validation.tokenRequired'),
    tokenMin: t('validation.tokenMin'),
    tokenInteger: t('validation.tokenInteger'),
    ipInvalid: t('validation.ipInvalid'),
  };

  /* ── Stable resolver (same pattern as useUserDialog) ── */
  const messagesRef = useRef(validationMessages);

  const stableResolver = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (values: any, context: any, options: any) =>
      zodResolver(createWebhookDialogSchema(messagesRef.current))(values, context, options),
    [],
  ) as unknown as Resolver<WebhookFormData>;

  /* ── Form ── */
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<WebhookFormData>({
    defaultValues: {
      webhookName: credential?.label ?? '',
      tokenExpirationHours: credential?.tokenExpirationHours ?? undefined,
      ipAllowlist:
        credential?.ipAllowlist && credential.ipAllowlist.length > 0
          ? credential.ipAllowlist.map((ip) => ({ ip }))
          : [{ ip: '' }],
    },
    resolver: stableResolver,
  });

  /* ── IP field array ── */
  const { fields: ipFields, append, remove } = useFieldArray({ control, name: 'ipAllowlist' });

  const appendIp = () => {
    append({ ip: '' });
  };

  const removeIp = (index: number) => {
    if (ipFields.length > 1) {
      remove(index);
    }
  };

  /* ── Created secret state (create mode only) ── */
  const [createdSecret, setCreatedSecret] = useState<string | null>(null);
  const isCreated = createdSecret !== null;

  /* ── Mutations ── */
  const [createCredential, { loading: createLoading }] = useMutation<
    CreateWebhookCredentialResponse,
    CreateWebhookCredentialVariables
  >(CREATE_WEBHOOK_CREDENTIAL);

  const [updateCredential, { loading: updateLoading }] = useMutation<
    UpdateWebhookCredentialResponse,
    UpdateWebhookCredentialVariables
  >(UPDATE_WEBHOOK_CREDENTIAL);

  /* ── Submit handler ── */
  const onFormSubmit = handleSubmit(async (data) => {
    const ips = (data.ipAllowlist ?? []).map(({ ip }) => ip.trim()).filter((ip) => ip !== '');

    if (isCreateMode) {
      await createCredential({
        variables: {
          input: {
            label: data.webhookName,
            tokenExpirationHours: data.tokenExpirationHours,
            ipAllowlist: ips.length > 0 ? ips : undefined,
          },
        },
        onCompleted(response) {
          const secret = response.createWebhookCredential?.clientSecret;
          if (secret) {
            setCreatedSecret(secret);
            toast.success(t('success.created'));
          } else {
            toast.error(t('errors.createFailed'));
          }
        },
        onError() {
          toast.error(t('errors.createFailed'));
        },
      });
    } else {
      if (!credential?.id) return;
      await updateCredential({
        variables: {
          input: {
            credentialId: credential.id,
            label: data.webhookName,
            tokenExpirationHours: data.tokenExpirationHours,
            ipAllowlist: ips.length > 0 ? ips : [],
          },
        },
        onCompleted(response) {
          if (response.updateWebhookCredential?.success) {
            toast.success(t('success.updated'));
            onSuccess?.();
            onClose();
          } else {
            toast.error(t('errors.updateFailed'));
          }
        },
        onError() {
          toast.error(t('errors.updateFailed'));
        },
      });
    }
  });

  /* ── Dialog open/close ── */
  const handleOpenChange = () => {
    // If credential was just created, trigger a table refetch before closing
    if (isCreated) {
      onSuccess?.();
    }
    onClose();
  };

  /* ── Dialog config ── */
  const config = isCreateMode
    ? { title: t('create.title'), description: t('create.description') }
    : { title: t('edit.title'), description: t('edit.description') };

  return {
    /* dialog */
    config,
    handleOpenChange,

    /* form */
    control,
    errors,
    isSubmitting: isSubmitting || createLoading || updateLoading,
    register,
    onFormSubmit,

    /* IP field array */
    ipFields,
    appendIp,
    removeIp,

    /* create-mode credential reveal */
    createdSecret,
    isCreated,
    isCreateMode,
  } as const;
}
