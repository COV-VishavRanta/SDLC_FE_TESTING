import {
  PageDescription,
  PageHeader,
  PageRoot,
  PageTitle,
  SectionErrorBoundary,
} from '@/components';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';

import AlertsList from './(components)/alerts-list/alerts-list';
import { AlertsListSkeleton } from './(components)/alerts-list/alerts-list.loading';
import { AlertsProvider } from './context/AlertsContext';

/* ── Page Metadata (WCAG 2.4.2 Page Titled) ── */
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('alerts.page');
  return {
    title: `${t('title')} — Pop Logic`,
  };
}

export default async function AlertsPage() {
  const t = await getTranslations('alerts');

  return (
    <PageRoot>
      {/* Page Header */}
      <PageHeader>
        <PageTitle className='font-semibold text-text-heading'>{t('page.title')}</PageTitle>
        <PageDescription>{t('page.description')}</PageDescription>
      </PageHeader>

      {/* Alerts List */}
      <SectionErrorBoundary
        title={t('errors.listing.title')}
        description={t('errors.listing.description')}
      >
        <Suspense fallback={<AlertsListSkeleton />}>
          <AlertsProvider>
            <AlertsList />
          </AlertsProvider>
        </Suspense>
      </SectionErrorBoundary>
    </PageRoot>
  );
}
