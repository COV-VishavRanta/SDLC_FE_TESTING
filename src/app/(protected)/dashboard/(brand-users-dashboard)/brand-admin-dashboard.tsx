import {
  PageDescription,
  PageHeader,
  PageRoot,
  PageTitle,
  SectionErrorBoundary,
} from '@/components';
import { useTranslations } from 'next-intl';
import { Suspense } from 'react';

import { BRAND_DASHBOARD_CAMPAIGN_DISPLAY_ORDER } from '@/constant';
import AlertsSection, { AlertsSkeleton } from '../(components)/alerts-section/alerts-section';
import AuditLogTable from '../(components)/audit-log-section/audit-log-table';
import { AuditLogTableSkeleton } from '../(components)/audit-log-section/audit-log-table-skeleton';
import CampaignsProgress from '../(components)/campaigns-progress/campaigns-progress';
import { CampaignsProgressSkeleton } from '../(components)/campaigns-progress/campaigns-progress-skeleton';
import ExceptionRequests, {
  ExceptionRequestsSkeleton,
} from './(components)/exception-requests/exception-requests';
import OverviewCards from './(components)/overview-card/overview-card';
import OverviewCardsSkeleton from './(components)/overview-card/overview-card-skeleton';
import BrandAdminQuickActionCard from './(components)/quick-action-card';

export default function BrandAdminDashboard() {
  const t = useTranslations('dashboard');

  return (
    <PageRoot>
      {/* ── Page Header ── */}
      <PageHeader>
        <PageTitle>{t('brand-title')}</PageTitle>
        <PageDescription>{t('brand-description')}</PageDescription>
      </PageHeader>

      {/* ── Overview Cards (Active Stores + Ongoing Campaigns) ── */}
      <SectionErrorBoundary
        title={t('errors.overviewCards.title')}
        description={t('errors.overviewCards.description')}
      >
        <Suspense fallback={<OverviewCardsSkeleton />}>
          <OverviewCards />
        </Suspense>
      </SectionErrorBoundary>

      {/* ── Quick Actions ── */}
      <section className='grid grid-cols-1 gap-5 lg:grid-cols-2'>
        <BrandAdminQuickActionCard />
        <SectionErrorBoundary
          title={t('errors.alerts.title')}
          description={t('errors.alerts.description')}
        >
          <Suspense fallback={<AlertsSkeleton />}>
            <AlertsSection />
          </Suspense>
        </SectionErrorBoundary>
      </section>

      {/* ── Campaigns Progress (horizontal scrollable Kanban) ── */}
      <SectionErrorBoundary
        title={t('errors.campaignsProgress.title')}
        description={t('errors.campaignsProgress.description')}
      >
        <Suspense fallback={<CampaignsProgressSkeleton />}>
          <CampaignsProgress displayOrder={BRAND_DASHBOARD_CAMPAIGN_DISPLAY_ORDER} />
        </Suspense>
      </SectionErrorBoundary>

      {/* ── Exception Requests Table ── */}
      <SectionErrorBoundary
        title={t('errors.exceptionRequests.title')}
        description={t('errors.exceptionRequests.description')}
      >
        <Suspense fallback={<ExceptionRequestsSkeleton />}>
          <ExceptionRequests />
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
