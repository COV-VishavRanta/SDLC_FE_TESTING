import {
  PageDescription,
  PageHeader,
  PageRoot,
  PageTitle,
  SectionErrorBoundary,
} from '@/components';
import { useTranslations } from 'next-intl';
import { Suspense } from 'react';

import AlertsSection, { AlertsSkeleton } from '../(components)/alerts-section/alerts-section';
import AuditLogTable from '../(components)/audit-log-section/audit-log-table';
import { AuditLogTableSkeleton } from '../(components)/audit-log-section/audit-log-table-skeleton';
import PspOverviewCard from './(components)/psp-overview-section/psp-overview-card';
import { PspOverviewCardSkeleton } from './(components)/psp-overview-section/psp-overview-card-skeleton';
import QuickActionCard from './(components)/quick-action-card';
import UserOverview from './(components)/user-overview/user-overview';
import { UserOverviewSkeleton } from './(components)/user-overview/user-overview-skeleton';

export default function PlatformAdminDashboard() {
  const t = useTranslations('dashboard');
  return (
    <PageRoot>
      {/* ── Page Header ── */}
      <PageHeader>
        <PageTitle>{t('platform-title')}</PageTitle>
        <PageDescription>{t('description')}</PageDescription>
      </PageHeader>

      <SectionErrorBoundary
        title={t('errors.userOverview.title')}
        description={t('errors.userOverview.description')}
      >
        <Suspense fallback={<UserOverviewSkeleton />}>
          <UserOverview />
        </Suspense>
      </SectionErrorBoundary>

      {/* ── Quick Actions + PSP Overview Row ── */}
      <section
        className='grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-2'
        aria-label={t('sections.core-overview')}
      >
        {/* Quick Actions Card */}
        <QuickActionCard />

        {/* PSP Overview Card */}
        <SectionErrorBoundary
          title={t('errors.pspOverview.title')}
          description={t('errors.pspOverview.description')}
        >
          <Suspense fallback={<PspOverviewCardSkeleton />}>
            <PspOverviewCard />
          </Suspense>
        </SectionErrorBoundary>
      </section>

      {/* ── Alerts Row ── */}
      <SectionErrorBoundary title='Alerts failed to load' description='Unable to load alerts.'>
        <Suspense fallback={<AlertsSkeleton />}>
          <AlertsSection />
        </Suspense>
      </SectionErrorBoundary>

      {/* ── System Activity & Audit Log ── */}
      <section className='min-w-0' aria-label={t('audit-logs.title')}>
        <SectionErrorBoundary
          title={t('errors.auditLog.title')}
          description={t('errors.auditLog.description')}
        >
          <Suspense fallback={<AuditLogTableSkeleton />}>
            <AuditLogTable />
          </Suspense>
        </SectionErrorBoundary>
      </section>
    </PageRoot>
  );
}
