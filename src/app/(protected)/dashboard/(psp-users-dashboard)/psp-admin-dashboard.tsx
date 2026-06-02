import {
  PageDescription,
  PageHeader,
  PageRoot,
  PageTitle,
  SectionErrorBoundary,
} from '@/components';
import { PSP_DASHBOARD_CAMPAIGN_DISPLAY_ORDER } from '@/constant';
import { useTranslations } from 'next-intl';
import { Suspense } from 'react';

import AlertsSection, { AlertsSkeleton } from '../(components)/alerts-section/alerts-section';
import AuditLogTable from '../(components)/audit-log-section/audit-log-table';
import { AuditLogTableSkeleton } from '../(components)/audit-log-section/audit-log-table-skeleton';
import CampaignsProgress from '../(components)/campaigns-progress/campaigns-progress';
import { CampaignsProgressSkeleton } from '../(components)/campaigns-progress/campaigns-progress-skeleton';
import PspAdminOverviewCard from './(components)/psp-admin-overview-card';
import { PspAdminOverviewCardSkeleton } from './(components)/psp-admin-overview-card-skeleton';
import PspAdminQuickActionCard from './(components)/quick-action-card';

export default function PspAdminDashboard() {
  const t = useTranslations('dashboard');
  return (
    <PageRoot>
      <PageHeader>
        <PageTitle>{t('psp-title')}</PageTitle>
        <PageDescription>{t('description')}</PageDescription>
      </PageHeader>

      {/* ── Quick Actions + Campaigns Overview Row ── */}
      <section
        className='grid grid-cols-1 gap-6 lg:grid-cols-2'
        aria-label={t('sections.psp-admin-core-overview')}
      >
        {/* Quick Actions Card */}
        <PspAdminQuickActionCard />

        {/* Campaigns Summary Card */}
        <SectionErrorBoundary
          title={t('errors.pspAdminOverview.title')}
          description={t('errors.pspAdminOverview.description')}
        >
          <Suspense fallback={<PspAdminOverviewCardSkeleton />}>
            <PspAdminOverviewCard />
          </Suspense>
        </SectionErrorBoundary>
      </section>

      {/* ── Campaigns Progress (horizontal scrollable Kanban) ── */}
      <SectionErrorBoundary
        title='Campaigns progress failed to load'
        description='Unable to load campaign status.'
      >
        <Suspense fallback={<CampaignsProgressSkeleton />}>
          <CampaignsProgress displayOrder={PSP_DASHBOARD_CAMPAIGN_DISPLAY_ORDER} />
        </Suspense>
      </SectionErrorBoundary>

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
