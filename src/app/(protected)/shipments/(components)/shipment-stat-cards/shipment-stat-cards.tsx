'use client';

import { InfoCircleIcon, ItemsShippedIcon, PackageIcon, StatCard, TruckIcon } from '@/components';
import { useTranslations } from 'next-intl';
import { useContext } from 'react';

import { ShipmentContext } from '../../context/ShipmentContext';

export default function ShipmentStatCards() {
  const { summary } = useContext(ShipmentContext);
  const t = useTranslations('shipments');

  const totalShipments = summary?.totalShipments ?? 0;
  const shipped = summary?.shipped ?? 0;
  const received = summary?.received ?? 0;
  const receivedWithException = summary?.receivedWithException ?? 0;

  return (
    <div className='mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
      <StatCard
        icon={<PackageIcon className='size-[18px] text-amber-500' aria-hidden='true' />}
        iconBgClass='bg-shipment-stat-amber-bg'
        value={totalShipments}
        label={t('stats.totalShipments')}
      />
      <StatCard
        icon={<TruckIcon className='size-[18px] text-[var(--warning-darker)]' aria-hidden='true' />}
        iconBgClass='bg-shipment-stat-amber-bg'
        value={shipped}
        label={t('stats.shipped')}
        valueClassName='text-[var(--warning-darker)]'
      />
      <StatCard
        icon={
          <ItemsShippedIcon
            className='size-[18px] text-[var(--badge-active-text)]'
            aria-hidden='true'
          />
        }
        iconBgClass='bg-[var(--badge-active-bg)]'
        value={received}
        label={t('stats.received')}
        valueClassName='text-[var(--badge-active-text)]'
      />
      <StatCard
        icon={
          <InfoCircleIcon className='size-[18px] text-[var(--primary-500)]' aria-hidden='true' />
        }
        iconBgClass='bg-[var(--badge-pending-bg)]'
        value={receivedWithException}
        label={t('stats.receivedWithException')}
        valueClassName='text-[var(--primary-500)]'
      />
    </div>
  );
}
