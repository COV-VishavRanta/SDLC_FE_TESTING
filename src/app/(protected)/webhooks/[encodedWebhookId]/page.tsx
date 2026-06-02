import { SectionErrorBoundary } from '@/components';
import { decodeId } from '@/lib';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { WebhookDetailsView } from './(components)/webhook-details-view';
import WebhookDetailsLoading from './loading';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('webhooks.details');
  return {
    title: `${t('title')} — Pop Logic`,
  };
}

interface PageProps {
  params: Promise<{
    encodedWebhookId: string;
  }>;
}

export default async function WebhookDetailsPage({ params }: PageProps) {
  const { encodedWebhookId } = await params;
  const t = await getTranslations('webhooks.details');

  const credentialId = decodeId(encodedWebhookId);

  if (!credentialId) {
    notFound();
  }

  return (
    <SectionErrorBoundary title={t('error.title')} description={t('error.description')}>
      <Suspense fallback={<WebhookDetailsLoading />}>
        <WebhookDetailsView credentialId={credentialId} />
      </Suspense>
    </SectionErrorBoundary>
  );
}
