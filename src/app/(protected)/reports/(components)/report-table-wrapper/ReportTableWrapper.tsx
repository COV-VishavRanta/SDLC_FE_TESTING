'use client';

import { NoRecordFound, SectionErrorBoundary } from '@/components';
import { Card } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import { Suspense, useContext } from 'react';

import { ReportsContext } from '../../context/ReportsContext';
import { ReportTable } from '../report-table/ReportTable';
import { ReportTableSkeleton } from '../report-table/ReportTable.loading';

export function ReportTableWrapper() {
  const t = useTranslations('reports');
  const { activeConfig, selectedReportKey } = useContext(ReportsContext);

  if (!selectedReportKey || !activeConfig) {
    return (
      <Card className='flex items-center justify-center rounded-xl border border-border p-6'>
        <NoRecordFound message={t('table.noReportSelected')} />
      </Card>
    );
  }

  return (
    // key resets the error boundary whenever the report changes
    <SectionErrorBoundary
      key={selectedReportKey}
      title={t('errors.loadFailed.title')}
      description={t('errors.loadFailed.description')}
    >
      <Suspense fallback={<ReportTableSkeleton columnCount={activeConfig.columnCount} />}>
        {/* key forces remount (fresh query) when report switches */}
        <ReportTable key={selectedReportKey} config={activeConfig} />
      </Suspense>
    </SectionErrorBoundary>
  );
}
