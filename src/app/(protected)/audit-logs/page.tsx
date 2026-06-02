import {
  PageDescription,
  PageFilters,
  PageHeader,
  PageRoot,
  PageTitle,
  SectionErrorBoundary,
} from '@/components';
import { USER_ROLE_COOKIE_NAME } from '@/constant';
import { getRoleLabel } from '@/lib/utils';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { cookies } from 'next/headers';
import { Suspense } from 'react';

import LogFilters from './(components)/log-filters/log-filters';
import LogListing from './(components)/log-listing/log-listing';
import LogTableLoading from './(components)/log-listing/log-table.loading';
import AuditLogProvider from './context/AuditLogContext';

/* ── Page Metadata (WCAG 2.4.2 Page Titled) ── */
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('auditLogs.page');
  return {
    title: `${t('title')} — Pop Logic`,
  };
}

export default async function AuditLogsPage() {
  const t = await getTranslations('auditLogs');
  const tRoles = await getTranslations('roles');
  const cookieStore = await cookies();
  const cookieRole = cookieStore.get(USER_ROLE_COOKIE_NAME)?.value ?? '';
  const roleLabel = getRoleLabel(cookieRole, tRoles);

  return (
    <PageRoot>
      <AuditLogProvider>
        {/* Page Header */}
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8'>
          <PageHeader>
            <PageTitle className='font-semibold text-text-heading'>{t('page.title')}</PageTitle>
            <PageDescription>{t('page.description')}</PageDescription>
          </PageHeader>

          {/* Viewing As Badge */}
          <div className='bg-white border border-border rounded-lg px-[17px] pt-[11px] pb-px h-[63px] w-fit'>
            <p className='text-xs leading-[18px] text-text-secondary mb-0.5'>
              {t('page.viewingAs')}
            </p>
            <p className='text-sm font-semibold leading-[21px] text-text-heading'>{roleLabel}</p>
          </div>
        </div>

        {/* Filters Section (Collapsible) */}
        <PageFilters className='mb-3'>
          {/* Search and Filter Toggle */}
          <div className='flex flex-wrap gap-3 items-center wide:flex-nowrap'>
            {/* Filter Fields (Collapsible Content) */}
            <LogFilters />
          </div>
        </PageFilters>

        {/* Audit Logs List */}
        <SectionErrorBoundary
          title={t('errors.logListing.title')}
          description={t('errors.logListing.description')}
        >
          <Suspense fallback={<LogTableLoading />}>
            <LogListing />
          </Suspense>
        </SectionErrorBoundary>
      </AuditLogProvider>
    </PageRoot>
  );
}
