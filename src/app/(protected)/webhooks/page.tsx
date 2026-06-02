import { PageDescription, PageHeader, PageRoot, PageTitle } from '@/components';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import CreateWebhookButton from './(components)/create-webhook-button/create-webhook-button';
import StatSection from './(components)/stat-section/stat-section';
import WebhookFilter from './(components)/webhook-filter/webhook-filter';
import { WebhookTable } from './(components)/webhook-listing/webhook-table';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('webhooks.page');
  return {
    title: `${t('title')} - Pop Logic`,
  };
}

export default async function WebhooksPage() {
  const t = await getTranslations('webhooks.page');

  return (
    <PageRoot>
      <div className='flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <PageHeader>
          <PageTitle className='font-semibold text-text-heading'>{t('title')}</PageTitle>
          <PageDescription>{t('description')}</PageDescription>
        </PageHeader>
        <CreateWebhookButton />
      </div>

      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6'>
        <StatSection />
      </div>

      <WebhookFilter />
      <WebhookTable />
    </PageRoot>
  );
}
