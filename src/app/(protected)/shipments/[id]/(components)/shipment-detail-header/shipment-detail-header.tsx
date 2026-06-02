'use client';

import { ArrowLeftIcon } from '@/components';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { useShipmentDetails } from '../../context/ShipmentDetailsContext';

export default function ShipmentDetailHeader() {
  const { shipment } = useShipmentDetails();
  const t = useTranslations('shipmentDetails');

  return (
    <div className='flex flex-col gap-5'>
      {/* Back link */}
      <Link
        href='/shipments'
        aria-label={t('header.backLinkAriaLabel')}
        className='inline-flex w-fit items-center gap-2 text-[15px] font-medium text-primary transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
      >
        <ArrowLeftIcon className='text-primary' aria-hidden='true' />
        {t('header.backLink')}
      </Link>

      {/* Title */}
      <div className='flex flex-col gap-1'>
        <h1 className='text-2xl font-semibold leading-[42px] text-[var(--gray-900)] sm:text-[28px]'>
          {t('header.title')}
        </h1>
        {shipment?.orderNumber && (
          <p className='text-sm leading-[21px] tracking-[-0.15px] text-muted-foreground'>
            {t('header.orderNumber')} {shipment.orderNumber}
          </p>
        )}
      </div>
    </div>
  );
}
