import { PageRoot } from '@/components';
import { CAMPAIGN_SUB_PAGE_NAME } from '@/constant';
import { decodeId } from '@/lib';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { CampaignSubPageGuard } from '../../(guards)/CampaignSubPageGuard';
import OrderShipmentForm from './(components)/order-shipment-form/order-shipment-form';
import { OrderShipmentHeader } from './(components)/order-shipment-header/order-shipment-header';
import { OrderShipmentProvider } from './context/OrderShipmentContext';
import OrderShipmentSkeleton from './loading';

interface OrderShipmentPageProps {
  params: Promise<{ id: string; orderNumber: string }>;
  searchParams: Promise<{ from?: string }>;
}

/* ── Page Metadata (WCAG 2.4.2 Page Titled) ── */
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('campaignManagement.createShipment');
  return {
    title: `${t('pageTitle')} — Pop Logic`,
    description: t('pageDescription'),
  };
}

export default async function OrderShipmentPage({ params, searchParams }: OrderShipmentPageProps) {
  const { id, orderNumber } = await params;
  const { from } = await searchParams;

  const campaignId = decodeId(id);
  const orderNum = Number(orderNumber);
  const redirectTab = from === 'reorder' ? 'reorder' : 'order';

  if (!campaignId || !orderNumber || isNaN(orderNum) || orderNum <= 0) {
    notFound();
  }

  return (
    <CampaignSubPageGuard
      loader={<OrderShipmentSkeleton />}
      campaignSubPageName={CAMPAIGN_SUB_PAGE_NAME.SHIP_ORDERS}
    >
      <OrderShipmentProvider
        campaignId={campaignId}
        orderNumber={orderNum}
        encodedCampaignId={id}
        redirectTab={redirectTab}
      >
        <PageRoot>
          <OrderShipmentHeader />
          <OrderShipmentForm />
        </PageRoot>
      </OrderShipmentProvider>
    </CampaignSubPageGuard>
  );
}
