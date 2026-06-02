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

import ExceptionRequestFilters from './(components)/exception-request-filters/exception-request-filters';
import ExceptionRequestStatCards from './(components)/exception-request-stat-cards/exception-request-stat-cards';
import { ExceptionRequestStatCardsSkeleton } from './(components)/exception-request-stat-cards/exception-request-stat-cards.loading';
import ExceptionRequestTable from './(components)/exception-request-table/exception-request-table';
import { ExceptionRequestTableSkeleton } from './(components)/exception-request-table/exception-request-table.loading';
import { ExceptionRequestProvider } from './context/ExceptionRequestContext';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('exceptionRequest');
  return {
    title: `${t('page.title')} — Pop Logic`,
    description: t('page.description'),
  };
}

export default async function ExceptionRequestPage() {
  const t = await getTranslations('exceptionRequest');
  return (
    <PageRoot>
      <ExceptionRequestProvider>
        <PageHeader>
          <PageTitle className='font-semibold text-text-heading'>{t('page.title')}</PageTitle>
          <PageDescription>{t('page.description')}</PageDescription>
        </PageHeader>

        {/* Stat Cards */}
        <SectionErrorBoundary
          title={t('errors.statCards.title')}
          description={t('errors.statCards.description')}
        >
          <Suspense fallback={<ExceptionRequestStatCardsSkeleton />}>
            <ExceptionRequestStatCards />
          </Suspense>
        </SectionErrorBoundary>

        {/* Filters */}
        <ExceptionRequestFilters />

        {/* Exception Requests Table */}
        <SectionErrorBoundary
          title={t('errors.table.title')}
          description={t('errors.table.description')}
        >
          <Suspense fallback={<ExceptionRequestTableSkeleton />}>
            <ExceptionRequestTable />
          </Suspense>
        </SectionErrorBoundary>
      </ExceptionRequestProvider>
    </PageRoot>
  );
}
