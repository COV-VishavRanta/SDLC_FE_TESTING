import { PageDescription, PageHeader, PageRoot, PageTitle } from '@/components';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';

import { USER_ROLE_COOKIE_NAME } from '@/constant/cookie.constants';
import { cookies } from 'next/headers';
import UserCreationButton from './(components)/create-user-button/create-user-button';
import { UserFilters } from './(components)/user-filters/user-filters';
import { UserTable } from './(components)/user-table/user-table';
import UserTableLoading from './(components)/user-table/user-table.loading';
import { UserManagementProvider } from './context/UserManagementContext';

/* ── Page Metadata (WCAG 2.4.2 Page Titled) ── */
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('userManagement.page');
  return {
    title: `${t('title')} — Pop Logic`,
  };
}

/* ── Main Page ── */
export default async function UserManagementPage() {
  const t = await getTranslations('userManagement');
  const cookieStore = await cookies();
  const currentUserRole = cookieStore.get(USER_ROLE_COOKIE_NAME)?.value ?? '';

  return (
    <PageRoot>
      <UserManagementProvider currentUserRole={currentUserRole}>
        {/* Page Header with Create User Button */}
        <div className='flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <PageHeader>
            <PageTitle className='font-semibold text-text-heading'>{t('page.title')}</PageTitle>
            <PageDescription>{t('page.description')}</PageDescription>
          </PageHeader>

          <UserCreationButton />
        </div>

        {/* Filters Section */}
        <UserFilters />

        {/* Users Table */}
        <Suspense fallback={<UserTableLoading />}>
          <UserTable />
        </Suspense>
      </UserManagementProvider>
    </PageRoot>
  );
}
