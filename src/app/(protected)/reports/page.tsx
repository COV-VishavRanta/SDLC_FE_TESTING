import { PageDescription, PageHeader, PageRoot, PageTitle } from '@/components';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { Suspense } from 'react';
import { ReportExportButtons } from './(components)/report-export-buttons/ReportExportButtons';
import { ReportSelector } from './(components)/report-selector/ReportSelector';
import { ReportTableWrapper } from './(components)/report-table-wrapper/ReportTableWrapper';
import { ReportTableSkeleton } from './(components)/report-table/ReportTable.loading';
import { ReportsProvider } from './context/ReportsContext';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('reports');
  return {
    title: `${t('page.title')} — Pop Logic`,
    description: t('page.description'),
  };
}

export default async function ReportsPage() {
  const t = await getTranslations('reports');
  return (
    <PageRoot>
      {/* Page Header */}
      <PageHeader>
        <PageTitle className='font-semibold text-text-heading'>{t('page.title')}</PageTitle>
        <PageDescription>{t('page.description')}</PageDescription>
      </PageHeader>
      <Suspense fallback={<ReportTableSkeleton />}>
        <ReportsProvider>
          {/* Report Selector + Export Buttons Row */}
          <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
            <ReportSelector />
            <ReportExportButtons />
          </div>

          {/* Report Table */}
          <ReportTableWrapper />
        </ReportsProvider>
      </Suspense>
    </PageRoot>
  );
}
