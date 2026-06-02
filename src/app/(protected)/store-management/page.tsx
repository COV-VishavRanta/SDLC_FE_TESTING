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

import CreateStoreButton from './(components)/create-store-button/create-store-button';
import { StoreFilters } from './(components)/store-filters/store-filters';
import { StoreStats } from './(components)/store-stats/store-stats';
import { StoreTable } from './(components)/store-table/store-table';
import { StoreTableSkeleton } from './(components)/store-table/store-table.loading';
import { StoreManagementProvider } from './context/StoreManagementContext';

/* ── Page Metadata (WCAG 2.4.2 Page Titled) ── */
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('storeManagement.page');
  return {
    title: `${t('title')} — Pop Logic`,
  };
}

/* ── Main Page ── */
export default async function StoreManagementPage() {
  const t = await getTranslations('storeManagement.page');
  const tErrors = await getTranslations('storeManagement');

  return (
    <PageRoot>
      <StoreManagementProvider>
        {/* Page Header with Create Store Button */}
        <div className='flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <PageHeader>
            <PageTitle className='font-semibold text-text-heading'>{t('title')}</PageTitle>
            <PageDescription>{t('description')}</PageDescription>
          </PageHeader>
          <CreateStoreButton />
        </div>

        {/* Stat Cards */}
        <div className='grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6'>
          <StoreStats />
        </div>

        {/* Filters */}
        <StoreFilters />

        {/* Store List */}
        <SectionErrorBoundary
          title={tErrors('errors.storeListing.title')}
          description={tErrors('errors.storeListing.description')}
        >
          <Suspense fallback={<StoreTableSkeleton />}>
            <StoreTable />
          </Suspense>
        </SectionErrorBoundary>
      </StoreManagementProvider>
    </PageRoot>
  );
}
