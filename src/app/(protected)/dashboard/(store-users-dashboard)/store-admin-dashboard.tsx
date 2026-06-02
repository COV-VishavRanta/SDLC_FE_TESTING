import {
  PageDescription,
  PageHeader,
  PageRoot,
  PageTitle,
  SectionErrorBoundary,
} from '@/components';
import { STORE_DASHBOARD_CAMPAIGN_DISPLAY_ORDER } from '@/constant';
import { useTranslations } from 'next-intl';
import { Suspense } from 'react';

import AlertsSection, { AlertsSkeleton } from '../(components)/alerts-section/alerts-section';
import AuditLogTable from '../(components)/audit-log-section/audit-log-table';
import { AuditLogTableSkeleton } from '../(components)/audit-log-section/audit-log-table-skeleton';
import CampaignsProgress from '../(components)/campaigns-progress/campaigns-progress';
import { CampaignsProgressSkeleton } from '../(components)/campaigns-progress/campaigns-progress-skeleton';
import StoreAdminQuickActionCard from './(components)/quick-action-card';
import StoreAdminOverviewCard from './(components)/store-admin-overview-card/store-admin-overview-card';
import { StoreAdminOverviewCardSkeleton } from './(components)/store-admin-overview-card/store-admin-overview-card-skeleton';

export default function StoreAdminDashboard() {
  const t = useTranslations('dashboard');
  return (
    <PageRoot>
      <PageHeader>
        <PageTitle>{t('store-title')}</PageTitle>
        <PageDescription>{t('store-description')}</PageDescription>
      </PageHeader>

      {/* ── Overview Metrics Row ── */}
      <SectionErrorBoundary
        title={t('errors.overviewCards.title')}
        description={t('errors.overviewCards.description')}
      >
        <Suspense fallback={<StoreAdminOverviewCardSkeleton />}>
          <StoreAdminOverviewCard />
        </Suspense>
      </SectionErrorBoundary>

      {/* ──Quick Actions & Alerts Row ── */}
      <section
        className='grid grid-cols-1 gap-5 lg:grid-cols-2'
        aria-label={t('quick-action.title')}
      >
        <StoreAdminQuickActionCard />

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
          <CampaignsProgress displayOrder={STORE_DASHBOARD_CAMPAIGN_DISPLAY_ORDER} />
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
