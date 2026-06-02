'use client';

import {
  ActionButtonCell,
  InfoCircleIcon,
  InstallationStatusBadge,
  RejectionReasonDialog,
  ViewInstallationProof,
} from '@/components';
import ViewImagesDialog from '@/components/dialog/view-images-dialog/view-images-dialog';
import { InstallationStatusEnum } from '@/constant';
import { StoreOrderItemType } from '@/types';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

/* ─── Types ─── */
interface InstallationProofPromotionRowProps {
  item: StoreOrderItemType;
  t: ReturnType<typeof useTranslations<'campaignManagement.details.installationProofTab'>>;
}

/* ─── Installation Proof Promotion Row (view-only) ─── */
export default function InstallationProofPromotionRow({
  item,
  t,
}: InstallationProofPromotionRowProps) {
  const hasSize = item.width ?? item.height;
  const [viewProofDialogOpen, setViewProofDialogOpen] = useState(false);
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);

  const showProofLink = (item.installationImageUrls?.length ?? 0) > 0;
  const isRejected = item.installationStatus === InstallationStatusEnum.REJECTED;

  return (
    <>
      <div
        role='listitem'
        aria-label={item.promotionName}
        className='flex flex-col gap-1.5 rounded-lg border border-[#e5e7eb] bg-white px-3 py-2.5 sm:gap-2 sm:px-5 sm:py-3'
      >
        {/* Promotion Name */}
        <p className='text-xs font-semibold text-text-heading sm:text-sm'>{item.promotionName}</p>

        {/* Details Row */}
        <div className='flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3'>
          {/* Specifications (Size) */}
          {hasSize && (
            <div className='flex shrink-0 flex-col gap-0.5 sm:w-[263px] sm:gap-1'>
              <span className='text-[10px] font-medium leading-4 tracking-[-0.15px] text-muted-foreground sm:text-xs sm:leading-5'>
                {t('specifications')}
              </span>
              <span className='text-xs font-normal text-[var(--neutral-800)] sm:text-sm'>
                {t('size', { width: item.width ?? '—', height: item.height ?? '—' })}
              </span>
            </div>
          )}

          {/* Quantity Stats + Proof Link + Status */}
          <div className='grid grid-cols-3 gap-2 lg:max-w-[900px] lg:mx-auto leading-4 tracking-[-0.15px] sm:flex sm:flex-1 sm:flex-wrap sm:items-center sm:justify-between sm:leading-5'>
            {/* Total Qty */}
            <div className='flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-2'>
              <span className='whitespace-nowrap text-[10px] font-medium text-muted-foreground sm:text-xs'>
                {t('promotionTotalQty')}:
              </span>
              <span className='text-xs font-semibold uppercase text-[var(--neutral-800)] sm:text-sm'>
                {item.totalQuantity}
              </span>
            </div>

            {/* Shipped */}
            <div className='flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-2'>
              <span className='whitespace-nowrap text-[10px] font-medium text-muted-foreground sm:text-xs'>
                {t('promotionShipped')}:
              </span>
              <span className='text-xs font-semibold uppercase text-[var(--badge-active-text)] sm:text-sm'>
                {item.shippedQuantity}
              </span>
            </div>

            {/* Remaining Qty */}
            <div className='flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-2'>
              <span className='whitespace-nowrap text-[10px] font-medium text-muted-foreground sm:text-xs'>
                {t('promotionRemaining')}:
              </span>
              <span className='text-xs font-semibold uppercase text-warning sm:text-sm'>
                {item.remainingQuantity}
              </span>
            </div>

            {/* Status */}
            <div className='flex flex-col items-center gap-0.5 sm:gap-1'>
              <span className='text-[8px] font-medium uppercase leading-3 tracking-[-0.1px] text-muted-foreground sm:text-xs sm:leading-5 sm:tracking-[-0.15px]'>
                {t('status')}
              </span>
              <div className='flex items-center gap-1'>
                <InstallationStatusBadge
                  status={item.installationStatus as InstallationStatusEnum}
                  className='whitespace-nowrap px-1.5 py-0.5 text-[8px] leading-3 sm:px-2.5 sm:py-1 sm:text-[11px] sm:leading-[16.5px]'
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex shrink-0 items-center justify-end gap-1 sm:w-[200px]'>
            {isRejected && (
              <ActionButtonCell
                icon={<InfoCircleIcon className='size-3.5 sm:size-4' aria-hidden='true' />}
                tooltip={t('viewRejectionReasonAriaLabel', { name: item.promotionName })}
                onClick={() => setRejectionDialogOpen(true)}
                className='hover:bg-muted text-destructive'
              />
            )}
            {/* View Installation Proof Images */}
            {showProofLink && (
              <ActionButtonCell
                icon={<ViewInstallationProof className='size-3.5 sm:size-4' aria-hidden='true' />}
                tooltip={t('viewInstallationProof')}
                onClick={() => setViewProofDialogOpen(true)}
                className='hover:bg-muted text-primary'
              />
            )}
          </div>
        </div>
      </div>

      {/* View Installation Proof Dialog */}
      {showProofLink && viewProofDialogOpen && (
        <ViewImagesDialog
          open={viewProofDialogOpen}
          onClose={() => setViewProofDialogOpen(false)}
          title={t('viewInstallationProof')}
          imageUrls={item.installationImageUrls}
          notes={item?.installationNotes?.[item?.installationNotes?.length - 1] ?? ''}
        />
      )}

      {/* Rejection Reason Dialog */}
      {isRejected && rejectionDialogOpen && (
        <RejectionReasonDialog
          open={rejectionDialogOpen}
          onClose={() => setRejectionDialogOpen(false)}
          title={item.promotionName}
          reason={item.installationRejectionReason ?? ''}
          reasonLabel={t('rejectionReasonLabel')}
          closeLabel={t('rejectionReasonClose')}
        />
      )}
    </>
  );
}
