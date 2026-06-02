'use client';

import { Button, PageDescription, PageHeader, PageTitle, WebhookDialog } from '@/components';
import { useCapabilities } from '@/hooks';
import {
  DEFAULT_WEBHOOK_CAPABILITIES,
  WEBHOOK_CAPABILITIES_MAP,
} from '@/lib/permissions/capabilities/webhook.capabilities';
import { useTranslations } from 'next-intl';
import { useContext, useState } from 'react';

import { WebhookContext } from '../../context/WebhookContext';

export default function WebhookPageHeader() {
  const t = useTranslations('webhooks');
  const { refetchWebhooks } = useContext(WebhookContext);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const caps = useCapabilities(WEBHOOK_CAPABILITIES_MAP, DEFAULT_WEBHOOK_CAPABILITIES);

  return (
    <>
      <div className='flex w-full flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <PageHeader>
          <PageTitle className='font-semibold text-text-heading'>{t('page.title')}</PageTitle>
          <PageDescription>{t('page.description')}</PageDescription>
        </PageHeader>

        {caps.canCreate && (
          <Button
            className='h-[45px] gap-2 self-start whitespace-nowrap px-6 sm:self-center'
            onClick={() => {
              setIsDialogOpen(true);
            }}
          >
            {t('dialog.create.title')}
          </Button>
        )}
      </div>

      {isDialogOpen && (
        <WebhookDialog
          mode='create'
          onClose={() => {
            setIsDialogOpen(false);
          }}
          onSuccess={refetchWebhooks}
        />
      )}
    </>
  );
}
