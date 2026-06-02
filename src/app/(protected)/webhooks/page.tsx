import { PageRoot, SectionErrorBoundary } from '@/components';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';

import WebhookFilters from './(components)/webhook-filters/webhook-filters';
import WebhookPageHeader from './(components)/webhook-page-header/webhook-page-header';
import WebhookStatCards from './(components)/webhook-stat-cards/webhook-stat-cards';
import { WebhookStatCardsSkeleton } from './(components)/webhook-stat-cards/webhook-stat-cards.loading';
import WebhookTable from './(components)/webhook-table/webhook-table';
import { WebhookTableSkeleton } from './(components)/webhook-table/webhook-table.loading';
import { WebhookProvider } from './context/WebhookContext';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('webhooks');
  return {
    title: `${t('page.title')} — Pop Logic`,
    description: t('page.description'),
  };
}

export default async function WebhookPage() {
  const t = await getTranslations('webhooks');
  return (
    <PageRoot>
      <WebhookProvider>
        <WebhookPageHeader />
        {/* Stat Cards */}
        <SectionErrorBoundary
          title={t('errors.statCards.title')}
          description={t('errors.statCards.description')}
        >
          <Suspense fallback={<WebhookStatCardsSkeleton />}>
            <WebhookStatCards />
          </Suspense>
        </SectionErrorBoundary>

        {/* Filters */}
        <WebhookFilters />

        {/* Webhooks Table */}
        <SectionErrorBoundary
          title={t('errors.webhooksTable.title')}
          description={t('errors.webhooksTable.description')}
        >
          <Suspense fallback={<WebhookTableSkeleton />}>
            <WebhookTable />
          </Suspense>
        </SectionErrorBoundary>
      </WebhookProvider>
    </PageRoot>
  );
}
