'use client';

import { Card, NoRecordFound } from '@/components';
import { useTranslations } from 'next-intl';

export function WebhookTable() {
  const t = useTranslations('webhooks.table');

  return (
    <Card className='overflow-clip rounded-xl border border-border p-4 sm:p-6'>
      <NoRecordFound message={t('emptyState')} />
    </Card>
  );
}
