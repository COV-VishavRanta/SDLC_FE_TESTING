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

import ShipmentFilters from './(components)/shipment-filters/shipment-filters';
import ShipmentStatCards from './(components)/shipment-stat-cards/shipment-stat-cards';
import { ShipmentStatCardsSkeleton } from './(components)/shipment-stat-cards/shipment-stat-cards.loading';
import ShipmentTable from './(components)/shipment-table/shipment-table';
import { ShipmentTableSkeleton } from './(components)/shipment-table/shipment-table.loading';
import { ShipmentProvider } from './context/ShipmentContext';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('shipments');
  return {
    title: `${t('page.title')} — Pop Logic`,
    description: t('page.description'),
  };
}

export default async function ShipmentsPage() {
  const t = await getTranslations('shipments');
  return (
    <PageRoot>
      <ShipmentProvider>
        <PageHeader>
          <PageTitle className='font-semibold text-text-heading'>{t('page.title')}</PageTitle>
          <PageDescription>{t('page.description')}</PageDescription>
        </PageHeader>

        {/* Stat Cards */}
        <SectionErrorBoundary
          title={t('errors.statCards.title')}
          description={t('errors.statCards.description')}
        >
          <Suspense fallback={<ShipmentStatCardsSkeleton />}>
            <ShipmentStatCards />
          </Suspense>
        </SectionErrorBoundary>

        {/* Filters */}
        <ShipmentFilters />

        {/* Shipments Table */}
        <SectionErrorBoundary
          title={t('errors.shipmentsTable.title')}
          description={t('errors.shipmentsTable.description')}
        >
          <Suspense fallback={<ShipmentTableSkeleton />}>
            <ShipmentTable />
          </Suspense>
        </SectionErrorBoundary>
      </ShipmentProvider>
    </PageRoot>
  );
}
