'use client';

import { PagePrimaryAction } from '@/components';
import { UserRole } from '@/constant';
import { useGlobalProtected } from '@/contexts';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import CreateWebhookDialog from '../create-webhook-dialog/create-webhook-dialog';

export default function CreateWebhookButton() {
  const t = useTranslations('webhooks');
  const { currentUserRole } = useGlobalProtected();
  const [open, setOpen] = useState(false);

  const canCreate = currentUserRole === UserRole.PSP_ADMIN;

  if (!canCreate) {
    return null;
  }

  return (
    <>
      <PagePrimaryAction className='px-6' onClick={() => setOpen(true)}>
        {t('createButton')}
      </PagePrimaryAction>

      <CreateWebhookDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
