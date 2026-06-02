'use client';

import {
  CREATE_WEBHOOK_CREDENTIAL,
  CreateWebhookCredentialArguments,
  CreateWebhookCredentialResponse,
} from '@/graphql';
import { useMutation } from '@apollo/client/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import {
  CreateWebhookDialogFormData,
  createWebhookDialogSchema,
} from './create-webhook-dialog.schema';

interface UseCreateWebhookDialogProps {
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
}

type RevealPayload = CreateWebhookCredentialResponse['createWebhookCredential'];

const DEFAULT_VALUES: CreateWebhookDialogFormData = {
  label: '',
  tokenExpirationHours: 1,
  ipAllowlist: [{ value: '' }],
};

export default function useCreateWebhookDialog({
  onOpenChange,
  onCreated,
}: UseCreateWebhookDialogProps) {
  const tMessages = useTranslations('webhooks.messages');

  const [revealPayload, setRevealPayload] = useState<RevealPayload | null>(null);

  const [createWebhookCredential, { loading: isMutating }] = useMutation<
    CreateWebhookCredentialResponse,
    CreateWebhookCredentialArguments
  >(CREATE_WEBHOOK_CREDENTIAL, {
    fetchPolicy: 'no-cache',
  });

  const {
    control,
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateWebhookDialogFormData>({
    defaultValues: DEFAULT_VALUES,
    resolver: zodResolver(createWebhookDialogSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ipAllowlist',
  });

  const isBusy = isSubmitting || isMutating;

  const tokenExpiryOptions = useMemo(
    () => [
      { value: 1, label: '1 hour' },
      { value: 4, label: '4 hours' },
      { value: 12, label: '12 hours' },
      { value: 24, label: '24 hours' },
    ],
    [],
  );

  const clearSecret = () => {
    setRevealPayload(null);
  };

  const closeAndReset = () => {
    clearSecret();
    reset(DEFAULT_VALUES);
    onOpenChange(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && !isBusy) {
      closeAndReset();
      return;
    }

    onOpenChange(open);
  };

  const onFormSubmit = handleSubmit(async (values) => {
    const ipAllowlist = values.ipAllowlist
      .map((entry) => entry.value.trim())
      .filter((entry) => entry.length > 0);

    const { data } = await createWebhookCredential({
      variables: {
        input: {
          label: values.label.trim(),
          tokenExpirationHours: values.tokenExpirationHours,
          ipAllowlist,
        },
      },
    });

    const payload = data?.createWebhookCredential;

    if (!payload?.success) {
      toast.error(payload?.message ?? tMessages('createError'));
      return;
    }

    setRevealPayload(payload);
    onCreated?.();
    toast.success(tMessages('createSuccess'));
  });

  const addIpAllowlistEntry = () => append({ value: '' });

  const removeIpAllowlistEntry = (index: number) => {
    if (fields.length === 1) {
      return;
    }
    remove(index);
  };

  const copyToClipboard = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(tMessages('copied'));
    } catch {
      toast.error(tMessages('copyError'));
    }
  };

  return {
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
  } as const;
}
