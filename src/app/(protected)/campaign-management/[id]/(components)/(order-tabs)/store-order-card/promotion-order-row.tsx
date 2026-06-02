import {
  ActionButtonCell,
  EyeIcon,
  InfoCircleIcon,
  InstallationStatusBadge,
  RejectionReasonDialog,
  UploadIcon,
  ViewInstallationProof,
} from '@/components';
import ViewImagesDialog from '@/components/dialog/view-images-dialog/view-images-dialog';
import {
  CAN_PERFORM_INSTALLATION_ACTION,
  INSTALLATION_PROOF_TAB_ORDER_STATUSES,
  InstallationStatusEnum,
  OrderStatusEnum,
  SHOW_INSTALLATION_PROOF_BUTTON,
  SHOW_UPLOAD_INSTALLATION_BUTTON,
} from '@/constant';
import { useCapabilities } from '@/hooks';
import { CAMPAIGN_CAPABILITIES_MAP, DEFAULT_CAMPAIGN_CAPABILITIES } from '@/lib';
import { StoreOrderItemType } from '@/types';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import UploadInstallationProofDialog from '../upload-installation-proof-dialog/upload-installation-proof-dialog';

interface PromotionOrderRowProps {
  item: StoreOrderItemType;
  onView: (item: StoreOrderItemType) => void;
  isInvalid: boolean;
  initialFiles: File[];
  onSave: (files: File[]) => void;
  initialNote: string;
  onNoteSave: (note: string) => void;
  orderStatus: OrderStatusEnum;

  t: ReturnType<typeof useTranslations<'campaignManagement.details.ordersTab'>>;
}

export default function PromotionOrderRow({
  item,
  onView,
  isInvalid,
  initialFiles,
  onSave,
  initialNote,
  onNoteSave,
  orderStatus,
  t,
}: PromotionOrderRowProps) {
  const {
    canViewInstallationProof,
    canUploadInstallationProof,
    canViewInstallationRejectionReason,
  } = useCapabilities(CAMPAIGN_CAPABILITIES_MAP, DEFAULT_CAMPAIGN_CAPABILITIES);
  const hasSize = item.width ?? item.height;
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [viewProofDialogOpen, setViewProofDialogOpen] = useState(false);
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);

  const showStatusBadge = INSTALLATION_PROOF_TAB_ORDER_STATUSES.has(orderStatus);

  const canPerformInstallationAction = CAN_PERFORM_INSTALLATION_ACTION.has(orderStatus);

  const allowedUploadAction =
    item.remainingQuantity === 0 &&
    item.receivedQuantity > 0 &&
    SHOW_UPLOAD_INSTALLATION_BUTTON.has(item.installationStatus as InstallationStatusEnum) &&
    SHOW_INSTALLATION_PROOF_BUTTON.has(orderStatus) &&
    canUploadInstallationProof;
  const allowRejectionStatus =
    item.installationStatus === InstallationStatusEnum.REJECTED &&
    canPerformInstallationAction &&
    canViewInstallationRejectionReason;

  return (
    <>
      <div
        role='listitem'
        aria-label={item.promotionName}
        className={`flex flex-col gap-1 rounded-lg border bg-white px-3 py-1.5 sm:gap-2 sm:px-5 sm:py-3 ${
          isInvalid
            ? 'border-destructive'
            : initialFiles.length > 0
              ? 'border-green-500'
              : 'border-[#e5e7eb]'
        }`}
      >
        {/* Promotion Name + Action Buttons (mobile: top-right) */}
        <div className='flex items-center justify-between gap-2'>
          <div className='flex flex-col gap-0.5'>
            <p className='text-xs font-semibold text-text-heading sm:text-sm'>
              {item.promotionName}
            </p>
            {initialFiles.length > 0 && (
              <span className='shrink-0 text-xs font-semibold text-[#536069] sm:text-sm'>
                {t('imageUploaded', { count: initialFiles.length })}
              </span>
            )}
          </div>

          {/* Action Buttons — visible on mobile at top-right, hidden on sm+ (shown inline below) */}
          <div className='flex shrink-0 items-center gap-1 sm:hidden'>
            {allowRejectionStatus && (
              <ActionButtonCell
                icon={<InfoCircleIcon className='size-4 text-destructive' aria-hidden='true' />}
                tooltip={t('viewRejectionReasonAriaLabel', { name: item.promotionName })}
                onClick={() => setRejectionDialogOpen(true)}
                className='hover:bg-muted'
              />
            )}
            {allowedUploadAction && (
              <ActionButtonCell
                icon={<UploadIcon className='size-4 text-primary' aria-hidden='true' />}
                tooltip={t('uploadProofAriaLabel', { name: item.promotionName })}
                onClick={() => setUploadDialogOpen(true)}
                className='hover:bg-muted'
              />
            )}
            <ActionButtonCell
              icon={<EyeIcon className='size-4 text-primary' aria-hidden='true' />}
              tooltip={t('viewDetailsAriaLabel', { name: item.promotionName })}
              onClick={() => onView(item)}
              className='hover:bg-muted'
            />
            {canViewInstallationProof && item.installationImageUrls?.length > 0 && (
              <ActionButtonCell
                icon={<ViewInstallationProof className='size-4 text-primary' aria-hidden='true' />}
                tooltip={t('viewInstallationProof')}
                onClick={() => setViewProofDialogOpen(true)}
                className='hover:bg-muted'
              />
            )}
          </div>
        </div>

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

          {/* Quantity Stats */}
          <div className='grid grid-cols-2 gap-2 lg:max-w-[900px] lg:mx-auto leading-4 tracking-[-0.15px] sm:flex sm:flex-1 sm:flex-wrap sm:items-center sm:justify-between sm:leading-5'>
            {/* Shipped */}
            <div className='flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-2'>
              <span className='whitespace-nowrap text-[10px] font-medium text-muted-foreground sm:text-xs'>
                {t('promotionShipped')}:
              </span>
              <span className='text-xs font-semibold uppercase text-[var(--badge-active-text)] sm:text-sm'>
                {item.shippedQuantity}
              </span>
            </div>

            {/* Unshipped Qty */}
            <div className='flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-2'>
              <span className='whitespace-nowrap text-[10px] font-medium text-muted-foreground sm:text-xs'>
                {t('unshippedQuantity')}:
              </span>
              <span className='text-xs font-semibold uppercase text-warning sm:text-sm'>
                {item.remainingQuantity}
              </span>
            </div>

            {/* Received Qty */}
            <div className='flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-2'>
              <span className='whitespace-nowrap text-[10px] font-medium text-muted-foreground sm:text-xs'>
                Received Qty:
              </span>
              <span className='text-xs font-semibold uppercase text-[var(--badge-active-text)] sm:text-sm'>
                {item.receivedQuantity}
              </span>
            </div>

            {/* Discrepancy Qty */}
            <div className='flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-2'>
              <span className='whitespace-nowrap text-[10px] font-medium text-muted-foreground sm:text-xs'>
                {t('discrepancyQuantity')}:
              </span>
              <span className='text-xs font-semibold uppercase text-[#8F6F00] sm:text-sm'>
                {item.discrepancyQuantity}
              </span>
            </div>

            {showStatusBadge && (
              <div className='flex flex-col gap-0.5 sm:gap-1'>
                <span className='text-[8px] font-medium uppercase leading-3 tracking-[-0.1px] text-muted-foreground sm:text-xs sm:leading-5 sm:tracking-[-0.15px]'>
                  {t('status')}
                </span>
                <InstallationStatusBadge
                  status={item.installationStatus as InstallationStatusEnum}
                  className='whitespace-nowrap px-1.5 py-0.5 text-[8px] leading-3 sm:px-2.5 sm:py-1 sm:text-[11px] sm:leading-[16.5px]'
                />
              </div>
            )}
          </div>

          {/* Action Buttons — hidden on mobile (shown at top-right), visible on sm+ */}
          <div className='hidden shrink-0 items-center justify-end gap-1 sm:flex sm:w-[200px]'>
            {allowRejectionStatus && (
              <ActionButtonCell
                icon={<InfoCircleIcon className='size-4 text-destructive' aria-hidden='true' />}
                tooltip={t('viewRejectionReasonAriaLabel', { name: item.promotionName })}
                onClick={() => setRejectionDialogOpen(true)}
                className='hover:bg-muted'
              />
            )}
            {allowedUploadAction && (
              <ActionButtonCell
                icon={<UploadIcon className='size-4 text-primary' aria-hidden='true' />}
                tooltip={t('uploadProofAriaLabel', { name: item.promotionName })}
                onClick={() => setUploadDialogOpen(true)}
                className='hover:bg-muted'
              />
            )}
            <ActionButtonCell
              icon={<EyeIcon className='size-4 text-primary' aria-hidden='true' />}
              tooltip={t('viewDetailsAriaLabel', { name: item.promotionName })}
              onClick={() => onView(item)}
              className='hover:bg-muted'
            />

            {/* View Installation Proof */}
            {canViewInstallationProof && item.installationImageUrls?.length > 0 && (
              <ActionButtonCell
                icon={<ViewInstallationProof className='size-4 text-primary' aria-hidden='true' />}
                tooltip={t('viewInstallationProof')}
                onClick={() => setViewProofDialogOpen(true)}
                className='hover:bg-muted'
              />
            )}
          </div>
        </div>
      </div>

      <UploadInstallationProofDialog
        open={uploadDialogOpen}
        promotionName={item.promotionName}
        initialFiles={initialFiles}
        initialNote={initialNote}
        onSave={onSave}
        onNoteSave={onNoteSave}
        onClose={() => setUploadDialogOpen(false)}
      />

      {/* View Installation Proof Dialog */}
      <ViewImagesDialog
        open={viewProofDialogOpen}
        onClose={() => setViewProofDialogOpen(false)}
        title={t('viewInstallationProof')}
        imageUrls={item.installationImageUrls ?? []}
        notes={item?.installationNotes?.[item?.installationNotes?.length - 1] ?? ''}
      />

      {/* Rejection Reason Dialog */}
      <RejectionReasonDialog
        open={rejectionDialogOpen}
        onClose={() => setRejectionDialogOpen(false)}
        title={item.promotionName}
        reason={item.installationRejectionReason ?? ''}
        reasonLabel={t('rejectionReasonLabel')}
        closeLabel={t('rejectionReasonClose')}
      />
    </>
  );
}
