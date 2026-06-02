/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
'use client';

import { Card, InfoCard, ShipmentStatusCell } from '@/components';
import { useTranslations } from 'next-intl';

import { useShipmentDetails } from '../../context/ShipmentDetailsContext';

export default function ShipmentInfoSection() {
  const { shipment } = useShipmentDetails();
  const t = useTranslations('shipmentDetails');

  const storeName = shipment?.store
    ? [shipment.store.name, shipment.store.stateAbbr, shipment.store.countryName]
        .filter(Boolean)
        .join(', ')
    : '—';

  const status = shipment?.status;

  return (
    <div className='flex flex-col gap-3 rounded-lg border border-border bg-[var(--neutral-200)] p-5'>
      {/* Row 1: 3 cards */}
      <div className='grid grid-cols-1 gap-3 sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-3'>
        <InfoCard label={t('info.campaign')} value={shipment?.campaignName || '—'} />
        <InfoCard label={t('info.store')} value={storeName} />
        <InfoCard label={t('info.estimatedDelivery')} value={shipment?.estimatedDelivery || '—'} />
      </div>

      {/* Row 2: 3 cards */}
      <div className='grid grid-cols-1 gap-3  sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-3'>
        <InfoCard label={t('info.carrierName')} value={shipment?.carrierName || '—'} />
        <InfoCard label={t('info.trackingNumber')} value={shipment?.trackingNumber || '—'} />
        <InfoCard
          label={t('info.status')}
          value={status ? <ShipmentStatusCell status={status} /> : '—'}
        />
      </div>

      {/* Row 3: Notes */}
      <Card className='w-full rounded-xl border border-border bg-card px-8 py-6 shadow-none'>
        <div className='flex flex-col gap-2'>
          <p className='text-[10px] font-medium uppercase leading-4 tracking-[-0.15px] text-[var(--neutral-500)] sm:text-xs sm:leading-5'>
            {t('info.notes')}
          </p>
          <p className='text-sm font-medium leading-5 tracking-[-0.15px] text-text-heading sm:text-base'>
            {shipment?.notes || '—'}
          </p>
        </div>
      </Card>
    </div>
  );
}
