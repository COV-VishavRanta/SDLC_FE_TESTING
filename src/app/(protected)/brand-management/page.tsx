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

import { BrandFilters } from './(components)/brand-filters/brand-filters';
import { BrandStatCards } from './(components)/brand-stat-cards/brand-stat-cards';
import { BrandStatCardsSkeleton } from './(components)/brand-stat-cards/brand-stat-cards.loading';
import { BrandTable } from './(components)/brand-table/brand-table';
import { BrandTableSkeleton } from './(components)/brand-table/brand-table.loading';
import BrandCreationButton from './(components)/create-brand-button/create-brand-button';
import { BrandManagementProvider } from './context/BrandManagementContext';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('brandManagement');
  return {
    title: `${t('page.title')} — Pop Logic`,
    description: t('page.description'),
  };
}

/* ── Main Page ── */
export default async function BrandManagementPage() {
  const t = await getTranslations('brandManagement');
  return (
    <PageRoot>
      <BrandManagementProvider>
        {/* Page Header with Create Brand Button */}
        <div className='flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <PageHeader>
            <PageTitle className='font-semibold text-text-heading'>{t('page.title')}</PageTitle>
            <PageDescription>{t('page.description')}</PageDescription>
          </PageHeader>

          <BrandCreationButton />
        </div>

        {/* Stat Cards */}
        <SectionErrorBoundary
          title={t('errors.statCards.title')}
          description={t('errors.statCards.description')}
        >
          <Suspense fallback={<BrandStatCardsSkeleton />}>
            <BrandStatCards />
          </Suspense>
        </SectionErrorBoundary>

        {/* Filters Section */}
        <BrandFilters />

        {/* Brands Table */}
        <SectionErrorBoundary
          title={t('errors.brandTable.title')}
          description={t('errors.brandTable.description')}
        >
          <Suspense fallback={<BrandTableSkeleton />}>
            <BrandTable />
          </Suspense>
        </SectionErrorBoundary>
      </BrandManagementProvider>
    </PageRoot>
  );
}
