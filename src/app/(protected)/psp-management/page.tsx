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

import CreatePspButton from './(components)/create-psp-button/create-psp-button';
import PspFilter from './(components)/psp-filter/psp-filter';
import { PspTable } from './(components)/psp-listing/psp-table';
import { PspTableSkeleton } from './(components)/psp-listing/psp-table.loading';
import StatSection from './(components)/stat-section/stat-section';
import { PspManagementProvider } from './context/PspManagementContext';

/* ── Page Metadata (WCAG 2.4.2 Page Titled) ── */
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('pspManagement.page');
  return {
    title: `${t('title')} — Pop Logic`,
  };
}

/* ── Main Page ── */
export default async function PspManagementPage() {
  const t = await getTranslations('pspManagement.page');
  const tErrors = await getTranslations('pspManagement');

  return (
    <PageRoot>
      <PspManagementProvider>
        {/* Page Header with Create PSP Button */}
        <div className='flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <PageHeader>
            <PageTitle className='font-semibold text-text-heading'>{t('title')}</PageTitle>
            <PageDescription>{t('description')}</PageDescription>
          </PageHeader>
          <CreatePspButton />
        </div>
        {/* Stat Cards */}
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6'>
          <StatSection />
        </div>

        {/* Search + Create */}
        <PspFilter />

        {/* PSP List */}

        <SectionErrorBoundary
          title={tErrors('errors.pspListing.title')}
          description={tErrors('errors.pspListing.description')}
        >
          <Suspense fallback={<PspTableSkeleton />}>
            <PspTable />
          </Suspense>
        </SectionErrorBoundary>
      </PspManagementProvider>
    </PageRoot>
  );
}
