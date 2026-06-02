'use client';

import {
  ActionButtonCell,
  ActionCellContainer,
  EditIcon,
  PauseCircleIcon,
  PowerIcon,
  WebhookDialog,
} from '@/components';
import {
  SET_WEBHOOK_CREDENTIAL_STATUS,
  SetWebhookCredentialStatusResponse,
  SetWebhookCredentialStatusVariables,
} from '@/graphql';
import { useCapabilities } from '@/hooks';
import {
  DEFAULT_WEBHOOK_CAPABILITIES,
  WEBHOOK_CAPABILITIES_MAP,
} from '@/lib/permissions/capabilities/webhook.capabilities';
import { WebhookCredentialType } from '@/types';
import { useMutation } from '@apollo/client/react';
import { useTranslations } from 'next-intl';
import { useContext, useState } from 'react';

import { toast } from 'sonner';
import { WebhookContext } from '../../context/WebhookContext';
import { ActivateWebhookDialog } from '../activate-deactivate-dialog/activate-webhook-dialog';
import { DeactivateWebhookDialog } from '../activate-deactivate-dialog/deactivate-webhook-dialog';

interface WebhookActionCellProps {
  credential: WebhookCredentialType;
}

export default function WebhookActionCell({ credential }: WebhookActionCellProps) {
  const t = useTranslations('webhooks.actions');
  const tDialog = useTranslations('webhooks.dialog');
  const { refetchWebhooks } = useContext(WebhookContext);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isActivateOpen, setIsActivateOpen] = useState(false);
  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);
  const caps = useCapabilities(WEBHOOK_CAPABILITIES_MAP, DEFAULT_WEBHOOK_CAPABILITIES);

  const [changeWebhookStatus, { loading: isChangingStatus }] = useMutation<
    SetWebhookCredentialStatusResponse,
    SetWebhookCredentialStatusVariables
  >(SET_WEBHOOK_CREDENTIAL_STATUS);

  const handleInactivateWebhook = () => {
    changeWebhookStatus({
      variables: { input: { credentialId: credential.id, isActive: false } },
      onCompleted() {
        toast.success(tDialog('success.deactivated'));
        refetchWebhooks();
        setIsDeactivateOpen(false);
      },
    });
  };

  const handleActivate = () => {
    changeWebhookStatus({
      variables: { input: { credentialId: credential.id, isActive: true } },
      onCompleted() {
        toast.success(tDialog('success.activated'));
        refetchWebhooks();
        setIsActivateOpen(false);
      },
    });
  };

  return (
    <>
      <ActionCellContainer className='justify-end'>
        {credential.isActive && caps.canEdit && (
          <ActionButtonCell
            icon={<EditIcon className='size-[18px] text-primary' />}
            tooltip={t('editCredential')}
            className='hover:bg-stat-icon-blue'
            onClick={() => {
              setIsEditOpen(true);
            }}
          />
        )}
        {credential.isActive && caps.canDeactivate && (
          <ActionButtonCell
            icon={<PauseCircleIcon className='size-[18px] text-text-secondary' />}
            tooltip={t('deactivateCredential')}
            className='hover:bg-stat-icon-gray'
            onClick={() => {
              setIsDeactivateOpen(true);
            }}
          />
        )}

        {!credential.isActive && caps.canActivate && (
          <ActionButtonCell
            icon={<PowerIcon className='size-[18px] text-badge-active-text' />}
            tooltip={t('activateCredential')}
            className='hover:bg-stat-icon-green'
            onClick={() => {
              setIsActivateOpen(true);
            }}
          />
        )}
      </ActionCellContainer>

      {isEditOpen && (
        <WebhookDialog
          mode='edit'
          credential={credential}
          onClose={() => {
            setIsEditOpen(false);
          }}
          onSuccess={refetchWebhooks}
        />
      )}

      {isActivateOpen && (
        <ActivateWebhookDialog
          credential={credential}
          onClose={() => {
            setIsActivateOpen(false);
          }}
          onConfirm={handleActivate}
          isLoading={isChangingStatus}
        />
      )}

      {isDeactivateOpen && (
        <DeactivateWebhookDialog
          credential={credential}
          onClose={() => {
            setIsDeactivateOpen(false);
          }}
          onConfirm={handleInactivateWebhook}
          isLoading={isChangingStatus}
        />
      )}
    </>
  );
}
