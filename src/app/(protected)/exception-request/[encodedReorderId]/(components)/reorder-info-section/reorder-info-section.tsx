'use client';

import { Card, ExceptionRequestStatusCell, InfoCard } from '@/components';
import { ShipmentReorderStatusEnum } from '@/constant';
import { useTranslations } from 'next-intl';

import { useReorderDetails } from '../../context/ReorderDetailsContext';

export default function ReorderInfoSection() {
  const { exceptionRequest } = useReorderDetails();
  const t = useTranslations('reorderDetails');

  const status = exceptionRequest?.status;
  const storeDisplay = exceptionRequest?.storeInfo
    ? [exceptionRequest.storeInfo.storeName, exceptionRequest.storeInfo.address]
        .filter(Boolean)
        .join(', ')
    : '—';

  const showRejectionReason = status === ShipmentReorderStatusEnum.REJECTED;
  const showCancellationReason = status === ShipmentReorderStatusEnum.CANCELLED;

  return (
    <div className='flex flex-col gap-3 rounded-lg border border-border bg-[var(--neutral-200)] p-5'>
      {/* Row 1: Campaign + Store */}
      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
        <InfoCard label={t('info.campaign')} value={exceptionRequest?.campaignName ?? '—'} />
        <InfoCard label={t('info.store')} value={storeDisplay} />
      </div>

      {/* Row 2: Status + Reason for Exception Request */}
      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
        <InfoCard
          label={t('info.status')}
          value={status ? <ExceptionRequestStatusCell status={status} /> : '—'}
        />
        <InfoCard
          label={t('info.reasonForException')}
          /* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */
          value={exceptionRequest?.reason || '—'}
        />
      </div>

      {/* Conditional Row 3: Rejection / Cancellation reason */}
      {(showRejectionReason || showCancellationReason) && (
        <Card className='w-full rounded-xl border border-border bg-card px-8 py-6 shadow-none'>
          <div className='flex flex-col gap-2'>
            <p className='text-[10px] font-medium uppercase leading-4 tracking-[-0.15px] text-[var(--neutral-500)] sm:text-xs sm:leading-5'>
              {showRejectionReason ? t('info.reasonForRejection') : t('info.reasonForCancellation')}
            </p>
            <p className='text-sm font-medium leading-5 tracking-[-0.15px] text-text-heading sm:text-base'>
              {/* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */}
              {exceptionRequest?.actionReason || '—'}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
