import { PageRoot, SectionErrorBoundary } from '@/components';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import ShipmentDetailHeader from './(components)/shipment-detail-header/shipment-detail-header';
import ShipmentDetailHeaderLoading from './(components)/shipment-detail-header/shipment-detail-header.loading';
import ShipmentDetailPromotionTable from './(components)/shipment-detail-promotion-table/shipment-detail-promotion-table';
import ShipmentDetailPromotionTableLoading from './(components)/shipment-detail-promotion-table/shipment-detail-promotion-table.loading';
import ShipmentInfoSection from './(components)/shipment-info-section/shipment-info-section';
import ShipmentInfoSectionLoading from './(components)/shipment-info-section/shipment-info-section.loading';
import { ShipmentDetailsProvider } from './context/ShipmentDetailsContext';

interface ShipmentDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('shipmentDetails');
  return {
    title: `${t('page.title')} — Pop Logic`,
    description: t('page.description'),
  };
}

export default async function ShipmentDetailPage({ params }: ShipmentDetailPageProps) {
  const { id } = await params;
  const t = await getTranslations('shipmentDetails');
  const shipmentNumber = Number(id);

  if (!shipmentNumber || !Number.isInteger(shipmentNumber)) {
    notFound();
  }
  return (
    <PageRoot>
      <ShipmentDetailsProvider shipmentNumber={shipmentNumber}>
        <div className='flex flex-col gap-5'>
          {/* ── Top: Back link + Header ── */}
          <SectionErrorBoundary
            title={t('errors.header.title')}
            description={t('errors.header.description')}
          >
            <Suspense fallback={<ShipmentDetailHeaderLoading />}>
              <ShipmentDetailHeader />
            </Suspense>
          </SectionErrorBoundary>

          {/* ── Info Section ── */}
          <SectionErrorBoundary
            title={t('errors.info.title')}
            description={t('errors.info.description')}
          >
            <Suspense fallback={<ShipmentInfoSectionLoading />}>
              <ShipmentInfoSection />
            </Suspense>
          </SectionErrorBoundary>

          {/* ── Promotions Table ── */}
          <SectionErrorBoundary
            title={t('errors.promotions.title')}
            description={t('errors.promotions.description')}
          >
            <Suspense fallback={<ShipmentDetailPromotionTableLoading />}>
              <ShipmentDetailPromotionTable />
            </Suspense>
          </SectionErrorBoundary>
        </div>
      </ShipmentDetailsProvider>
    </PageRoot>
  );
}
