'use client';

import { useTranslations } from 'next-intl';
import { useContext } from 'react';

import { OrderShipmentContext } from '../../context/OrderShipmentContext';
import OrderShipmentSkeleton from '../order-shipment.loading';
import { OrderShipmentTable } from './order-shipment-table/order-shipment-table';
import { ShipmentDetailsCard } from './shipment-details/shipment-details-card';

// ─── Main Component ───────────────────────────────────────────────────────────

export default function OrderShipmentForm() {
  const t = useTranslations('campaignManagement.createShipment');

  const {
    loading,
    onSubmit,
    // form control
    handleSubmit,
  } = useContext(OrderShipmentContext);

  if (loading) {
    return <OrderShipmentSkeleton />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label={t('pageTitle')}>
      <div className='flex flex-col gap-5'>
        <ShipmentDetailsCard />
        <OrderShipmentTable />
      </div>
    </form>
  );
}
