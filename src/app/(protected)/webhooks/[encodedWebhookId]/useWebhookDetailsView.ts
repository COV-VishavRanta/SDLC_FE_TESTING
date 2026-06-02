'use client';

import {
  GET_WEBHOOK_CREDENTIAL,
  GetWebhookCredentialResponse,
  GetWebhookCredentialVariables,
  ROTATE_WEBHOOK_SECRET,
  RotateWebhookSecretResponse,
  RotateWebhookSecretVariables,
} from '@/graphql';
import { useMutation, useSuspenseQuery } from '@apollo/client/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

export default function useWebhookDetailsView({ credentialId }: { credentialId: string }) {
  const tDetails = useTranslations('webhooks.details');

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isRotateOpen, setIsRotateOpen] = useState(false);
  const [rotatedSecret, setRotatedSecret] = useState<string | null>(null);

  const { data, refetch } = useSuspenseQuery<
    GetWebhookCredentialResponse,
    GetWebhookCredentialVariables
  >(GET_WEBHOOK_CREDENTIAL, { variables: { credentialId } });

  const credential = data?.webhookCredential?.credential;

  const [rotateSecret, { loading: isRotating }] = useMutation<
    RotateWebhookSecretResponse,
    RotateWebhookSecretVariables
  >(ROTATE_WEBHOOK_SECRET);

  const handleRotateSecret = async () => {
    if (!credential?.id) return;
    await rotateSecret({
      variables: { input: { credentialId: credential.id } },
      onCompleted(response) {
        const secret = response.rotateWebhookSecret?.clientSecret;
        if (secret) {
          setRotatedSecret(secret);
          // Keep the dialog open — the secret is revealed inside it
          toast.success(tDetails('rotateDialog.success'));
          refetch().catch(() => undefined);
        } else {
          toast.error(tDetails('rotateDialog.error'));
        }
      },
      onError() {
        toast.error(tDetails('rotateDialog.error'));
      },
    });
  };

  const handleRotateDialogClose = () => {
    setIsRotateOpen(false);
    setRotatedSecret(null);
  };

  const refetchCredential = () => {
    refetch().catch(() => undefined);
  };

  return {
    credential,
    isEditOpen,
    setIsEditOpen,
    isRotateOpen,
    setIsRotateOpen,
    handleRotateSecret,
    handleRotateDialogClose,
    isRotating,
    rotatedSecret,
    refetchCredential,
    tDetails,
  } as const;
}
