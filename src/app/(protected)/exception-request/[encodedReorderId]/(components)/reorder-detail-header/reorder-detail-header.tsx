'use client';

import { ArrowLeftIcon, Button } from '@/components';
import { ProtectedRoute, ShipmentReorderStatusEnum } from '@/constant';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { useReorderDetails } from '../../context/ReorderDetailsContext';
import ActionReasonDialog from '../action-reason-dialog/action-reason-dialog';

export default function ReorderDetailHeader() {
  const {
    exceptionRequest,
    caps,
    isWorking,
    isRejectDialogOpen,
    isCancelDialogOpen,
    setIsExceptionDialogOpen,
    setIsRejectDialogOpen,
    setIsCancelDialogOpen,
    handleApprove,
    handleReject,
    handleCancel,
  } = useReorderDetails();
  const t = useTranslations('reorderDetails');

  const status = exceptionRequest?.status;

  const canCancelRequest = !!(
    caps.canCancelRequest &&
    exceptionRequest?.canCancel &&
    status === ShipmentReorderStatusEnum.PENDING_APPROVAL
  );
  const canRejectRequest = !!(
    caps.canRejectRequest &&
    exceptionRequest?.canReject &&
    status === ShipmentReorderStatusEnum.PENDING_APPROVAL
  );
  const canApproveRequest = !!(
    caps.canApproveRequest &&
    exceptionRequest?.canApprove &&
    status === ShipmentReorderStatusEnum.PENDING_APPROVAL
  );
  const canReUpload = !!(
    caps.canReUploadPhotos &&
    exceptionRequest?.canUpdate &&
    status === ShipmentReorderStatusEnum.REJECTED
  );

  return (
    <div className='flex flex-col gap-5'>
      {/* Back link */}
      <Link
        href={ProtectedRoute.EXCEPTION_REQUEST}
        aria-label={t('header.backLinkAriaLabel')}
        className='inline-flex w-fit items-center gap-2 text-[15px] font-medium text-primary transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
      >
        <ArrowLeftIcon className='text-primary' aria-hidden='true' />
        {t('header.backLink')}
      </Link>

      {/* Title row */}
      <div className='flex flex-wrap items-start justify-between gap-3'>
        <div className='flex flex-col gap-1'>
          <h1 className='text-2xl font-semibold leading-[42px] text-[var(--gray-900)] sm:text-[28px]'>
            {t('header.title')}
          </h1>
          {exceptionRequest?.shipmentNumber && (
            <p className='text-sm leading-[21px] tracking-[-0.15px] text-muted-foreground'>
              {t('header.shipmentNumber')} {exceptionRequest.shipmentNumber}
            </p>
          )}
        </div>

        {/* Store Admin: Re Upload Photos (only when REJECTED) */}
        {canReUpload && (
          <Button
            type='button'
            disabled={isWorking}
            onClick={() => setIsExceptionDialogOpen(true)}
            className='h-[44px] rounded-[8px] px-6 text-[16px] font-medium text-white transition-all enabled:bg-gradient-to-b enabled:from-[var(--btn-primary-from)] enabled:to-[var(--btn-primary-to)] enabled:hover:from-[var(--primary-700)] enabled:hover:to-[var(--blue-dark)] disabled:cursor-not-allowed disabled:bg-[var(--neutral-400)] disabled:opacity-100'
          >
            {t('header.reUploadPhotos')}
          </Button>
        )}

        {/* Brand Admin: Cancel, Reject, Approve */}
        {(canCancelRequest || canRejectRequest || canApproveRequest) && (
          <div className='flex items-center gap-2'>
            {canCancelRequest && (
              <Button
                type='button'
                disabled={isWorking}
                onClick={() => setIsCancelDialogOpen(true)}
                className='enabled:bg-gradient-to-b enabled:from-[var(--exception-btn-cancel-from)] enabled:to-[var(--exception-btn-cancel-to)] enabled:hover:opacity-90 text-white disabled:cursor-not-allowed disabled:opacity-50'
              >
                {t('header.cancel')}
              </Button>
            )}
            {canRejectRequest && (
              <Button
                type='button'
                disabled={isWorking}
                onClick={() => setIsRejectDialogOpen(true)}
                className='enabled:bg-gradient-to-b enabled:from-[var(--exception-btn-reject-from)] enabled:to-[var(--exception-btn-reject-to)] enabled:hover:opacity-90 text-white disabled:cursor-not-allowed disabled:opacity-50'
              >
                {t('header.reject')}
              </Button>
            )}
            {canApproveRequest && (
              <Button
                type='button'
                disabled={isWorking}
                onClick={handleApprove}
                className='enabled:bg-gradient-to-b enabled:from-[var(--exception-btn-approve-from)] enabled:to-[var(--exception-btn-approve-to)] enabled:hover:opacity-90 text-white disabled:cursor-not-allowed disabled:opacity-50'
              >
                {t('header.approve')}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Reject dialog */}
      <ActionReasonDialog
        isOpen={isRejectDialogOpen}
        variant='reject'
        onSubmit={handleReject}
        onClose={() => setIsRejectDialogOpen(false)}
      />

      {/* Cancel dialog */}
      <ActionReasonDialog
        isOpen={isCancelDialogOpen}
        variant='cancel'
        onSubmit={handleCancel}
        onClose={() => setIsCancelDialogOpen(false)}
      />
    </div>
  );
}
