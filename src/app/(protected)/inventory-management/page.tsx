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

import CreateInventoryButton from './(components)/create-inventory-button/create-inventory-button';
import { InventoryFilters } from './(components)/inventory-filters/inventory-filters';
import { InventoryTable } from './(components)/inventory-table/inventory-table';
import { InventoryTableSkeleton } from './(components)/inventory-table/inventory-table.loading';
import { InventoryManagementProvider } from './context/InventoryManagementContext';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('inventoryManagement');
  return {
    title: `${t('page.title')} — Pop Logic`,
    description: t('page.description'),
  };
}

/* ── Main Page ── */
export default async function InventoryManagementPage() {
  const t = await getTranslations('inventoryManagement');
  return (
    <PageRoot>
      <InventoryManagementProvider>
        {/* Page Header with Create Inventory Button */}
        <div className='flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <PageHeader>
            <PageTitle className='font-semibold text-text-heading'>{t('page.title')}</PageTitle>
            <PageDescription>{t('page.description')}</PageDescription>
          </PageHeader>

          <CreateInventoryButton />
        </div>

        {/* Filters Section */}
        <InventoryFilters />

        {/* Inventory Table */}
        <SectionErrorBoundary
          title={t('errors.inventoryTable.title')}
          description={t('errors.inventoryTable.description')}
        >
          <Suspense fallback={<InventoryTableSkeleton />}>
            <InventoryTable />
          </Suspense>
        </SectionErrorBoundary>
      </InventoryManagementProvider>
    </PageRoot>
  );
}
