'use client';

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  OrderStatusCell,
  StoreIcon,
} from '@/components';
import {
  InstallationStatusEnum,
  ProtectedRoute,
  SHOW_INSTALLATION_PROOF_BUTTON,
  SHOW_SHIP_ORDER_BUTTON,
  SHOW_UPLOAD_INSTALLATION_BUTTON,
} from '@/constant';
import { useGlobalProtected } from '@/contexts';
import {
  GET_CAMPAIGN,
  GET_CAMPAIGN_STORE_ORDERS,
  OrderItemProofInput,
  SUBMIT_INSTALLATION_PROOF,
  SubmitInstallationProofResponse,
  SubmitInstallationProofVariables,
} from '@/graphql';
import { useCapabilities, useInstallationUpload } from '@/hooks';
import {
  CAMPAIGN_CAPABILITIES_MAP,
  DEFAULT_CAMPAIGN_CAPABILITIES,
} from '@/lib/permissions/route.permissions';
import { StoreOrderItemType, StoreOrderType } from '@/types';
import { useMutation } from '@apollo/client/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useQueryState } from 'nuqs';
import { useContext, useState } from 'react';
import { toast } from 'sonner';

import { CampaignDetailsContext } from '../../../context/CampaignDetailsContext';
import { useOrdersTab } from '../context/OrdersTabContext';
import PromotionOrderRow from './promotion-order-row';

interface StoreOrderCardProps {
  store: StoreOrderType;
  onViewPromotion: (item: StoreOrderItemType) => void;
  encodedCampaignId: string;
  showParentOrderId?: boolean;
  isReorder?: boolean;
  t: ReturnType<typeof useTranslations<'campaignManagement.details.ordersTab'>>;
}

export function StoreOrderCard({
  store,
  onViewPromotion,
  encodedCampaignId,
  showParentOrderId,
  isReorder = false,
  t,
}: StoreOrderCardProps) {
  const { canShipOrders, canSubmitInstallationProof } = useCapabilities(
    CAMPAIGN_CAPABILITIES_MAP,
    DEFAULT_CAMPAIGN_CAPABILITIES,
  );

  const { campaignData } = useContext(CampaignDetailsContext);
  const campaignId = campaignData?.id ?? '';
  const { selectedStoreId } = useGlobalProtected();

  const [isUploading, setIsUploading] = useState(false);

  /* ── Parent order link navigation ── */
  const [, setActiveTab] = useQueryState('tab', { defaultValue: 'details', clearOnDefault: true });
  const [, setOrderSearch] = useQueryState('orderSearch', {
    defaultValue: '',
    clearOnDefault: true,
  });
  const [, setReorderSearch] = useQueryState('reorderSearch', {
    defaultValue: '',
    clearOnDefault: true,
  });

  const handleParentOrderClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!store.parentOrderNumber) return;
    const parentOrderStr = store.parentOrderNumber.toString();
    if (store.isReorderOfReorder) {
      setReorderSearch(parentOrderStr);
      setActiveTab('reorder');
    } else {
      setOrderSearch(parentOrderStr);
      setActiveTab('order');
    }
  };

  const { getImages, setImages, markInvalid, isInvalid, getNote, setNote } = useOrdersTab();
  const { uploadInstallationImages } = useInstallationUpload();

  const [submitInstallationProof, { loading: isSubmittingProof }] = useMutation<
    SubmitInstallationProofResponse,
    SubmitInstallationProofVariables
  >(SUBMIT_INSTALLATION_PROOF);

  const showShipButton =
    SHOW_SHIP_ORDER_BUTTON.has(store.orderStatus) &&
    canShipOrders &&
    store.shippedQuantity < store.totalQuantity;
  const showInstallationProofButton =
    SHOW_INSTALLATION_PROOF_BUTTON.has(store.orderStatus) &&
    canSubmitInstallationProof &&
    store.remainingQuantity === 0 && // Only show if all items are received
    store.orderItems.some(
      (item) =>
        item.receivedQuantity > 0 &&
        SHOW_UPLOAD_INSTALLATION_BUTTON.has(item.installationStatus as InstallationStatusEnum),
    ); // At least one item requires installation proof upload
  const handleSubmitInstallationProof = async () => {
    // All items with received quantity — superset used for the mutation payload
    const allEligibleItemsCondition = (item: StoreOrderItemType) =>
      item.receivedQuantity > 0 &&
      SHOW_UPLOAD_INSTALLATION_BUTTON.has(item.installationStatus as InstallationStatusEnum);

    // Only validate items that show the upload button (PENDING or REJECTED) and have received quantity
    const uploadableItems = store.orderItems.filter((item) => allEligibleItemsCondition(item));

    if (uploadableItems.length === 0) {
      toast.error(t('installationProofUploadFailed'));
      return;
    }

    // Items with received quantity but no upload required — sent with empty images array
    const nonUploadableItems = store.orderItems.filter((item) => !allEligibleItemsCondition(item));

    // Validate: every uploadable order item must have at least one image
    const missingIds = uploadableItems
      .filter((item) => getImages(item.orderItemId).length === 0)
      .map((item) => item.orderItemId);

    if (missingIds.length > 0) {
      markInvalid(missingIds);
      toast.error(t('installationProofMissingImages'));
      return;
    }

    let uploadedItems: OrderItemProofInput[] = [];

    try {
      setIsUploading(true);

      // Step 1: Upload images for all uploadable order items in parallel
      uploadedItems = await Promise.all(
        uploadableItems.map(async (item) => {
          const files = getImages(item.orderItemId);
          const images = await uploadInstallationImages(files, item.orderItemId);
          return { orderItemId: item.orderItemId, images, notes: getNote(item.orderItemId) ?? '' };
        }),
      );
    } catch {
      toast.error(t('installationProofUploadFailed'));
      setIsUploading(false);
    }

    try {
      // Step 2: Submit all items in a single mutation once all uploads are complete
      await submitInstallationProof({
        variables: {
          input: {
            orderId: store.orderItems[0].orderId,
            items: [
              ...uploadedItems,
              ...nonUploadableItems.map((item) => ({
                orderItemId: item.orderItemId,
                images: [],
                notes: getNote(item.orderItemId) ?? '',
              })),
            ],
          },
        },
        refetchQueries: [
          { query: GET_CAMPAIGN, variables: { campaignId } },
          {
            query: GET_CAMPAIGN_STORE_ORDERS,
            variables: { campaignId, ...(selectedStoreId ? { storeId: selectedStoreId } : {}) },
          },
        ],
        onCompleted: () => {
          // Clear saved images for this store's items after successful submission
          store.orderItems.forEach((item) => setImages(item.orderItemId, []));

          toast.success(t('installationProofSuccess'));
        },
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AccordionItem value={store.orderNumber} className='border-b border-border last:border-b-0'>
      <AccordionTrigger className='items-center rounded-none border-0 bg-white px-3 pb-3 pt-2.5 hover:no-underline sm:px-5 sm:pb-5 sm:pt-3'>
        <div className='flex w-full flex-1 flex-col gap-2 lg:flex-row lg:items-center lg:gap-[42px]'>
          {/* Store name */}
          <div className='mb-[10px] flex flex-row items-center justify-center gap-2 leading-4 tracking-[-0.15px] lg:mb-0 lg:w-[180px] lg:shrink-0 lg:flex-col lg:items-start lg:justify-start lg:gap-2'>
            <div className='flex items-center gap-1.5'>
              <StoreIcon
                className='size-3.5 shrink-0 text-muted-foreground sm:size-4'
                aria-hidden='true'
              />
              <span className='text-xs font-semibold text-text-heading sm:text-sm'>
                {store.storeName}
              </span>
            </div>
            <span>
              {t('orderNumber')}: {store.orderNumber ?? '—'}
            </span>
          </div>

          {/* Stats — compact grid on mobile, equal flex siblings on desktop */}
          <div
            className={`grid w-full gap-x-1 gap-y-2 lg:contents ${showParentOrderId ? 'grid-cols-3 sm:grid-cols-7' : 'grid-cols-3 sm:grid-cols-6'}`}
          >
            {/* Parent Order Number — only visible in reorders context */}
            {showParentOrderId && (
              <div className='flex flex-col items-center gap-0.5 text-center sm:gap-1 lg:flex-1'>
                <span className='text-[8px] font-medium uppercase leading-3 tracking-[-0.1px] text-muted-foreground sm:text-xs sm:leading-5 sm:tracking-[-0.15px]'>
                  {t('parentOrderNumber')}
                </span>
                {store.parentOrderNumber !== null && store.parentOrderNumber !== undefined ? (
                  <button
                    type='button'
                    onClick={handleParentOrderClick}
                    className='truncate text-[10px] font-semibold text-primary underline underline-offset-2 hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 sm:text-sm'
                    aria-label={t('parentOrderNumberLink', {
                      orderNumber: store.parentOrderNumber,
                    })}
                  >
                    {store.parentOrderNumber}
                  </button>
                ) : (
                  <span className='truncate text-[10px] font-semibold text-foreground sm:text-sm'>
                    —
                  </span>
                )}
              </div>
            )}

            {/* Total Promotions */}
            <div className='flex flex-col items-center text-center gap-0.5 sm:gap-1 lg:flex-1'>
              <span className='text-[8px] font-medium uppercase leading-3 tracking-[-0.1px] text-muted-foreground sm:text-xs sm:leading-5 sm:tracking-[-0.15px]'>
                {t('promotions')}
              </span>
              <span className='flex h-5 w-6 items-center justify-center rounded-md bg-[var(--primary-300)] text-[10px] font-medium leading-4 text-primary sm:h-7 sm:w-8 sm:rounded-lg sm:text-base sm:leading-5'>
                {store.totalPromotions}
              </span>
            </div>

            {/* Total Quantity */}
            <div className='flex flex-col items-center gap-0.5 text-center sm:gap-1 lg:flex-1'>
              <span className='text-[8px] font-medium uppercase leading-3 tracking-[-0.1px] text-muted-foreground sm:text-xs sm:leading-5 sm:tracking-[-0.15px]'>
                {t('totalQty')}
              </span>
              <span className='text-xs font-semibold text-foreground sm:text-xl'>
                {store.totalQuantity}
              </span>
            </div>

            {/* Ship Quantity */}
            <div className='flex flex-col items-center gap-0.5 text-center sm:gap-1 lg:flex-1'>
              <span className='text-[8px] font-medium uppercase leading-3 tracking-[-0.1px] text-muted-foreground sm:text-xs sm:leading-5 sm:tracking-[-0.15px]'>
                {t('shipped')}
              </span>
              <span className='text-xs font-semibold text-[var(--badge-active-text)] sm:text-xl'>
                {store.shippedQuantity}
              </span>
            </div>

            {/* Remaining Qty */}
            <div className='flex flex-col items-center gap-0.5 text-center sm:gap-1 lg:flex-1'>
              <span className='text-[8px] font-medium uppercase leading-3 tracking-[-0.1px] text-muted-foreground sm:text-xs sm:leading-5 sm:tracking-[-0.15px]'>
                {t('remaining')}
              </span>
              <span className='text-xs font-semibold text-warning sm:text-xl'>
                {store.remainingQuantity}
              </span>
            </div>

            {/* Status */}
            <div className='flex flex-col items-center gap-0.5 sm:gap-1 lg:flex-1'>
              <span className='text-[8px] font-medium uppercase leading-3 tracking-[-0.1px] text-muted-foreground sm:text-xs sm:leading-5 sm:tracking-[-0.15px]'>
                {t('status')}
              </span>
              <OrderStatusCell
                status={store.orderStatus}
                className='whitespace-nowrap px-1.5 py-0.5 text-[8px] leading-3 sm:px-2.5 sm:py-1 sm:text-[11px] sm:leading-[16.5px]'
              />
            </div>
          </div>

          {/* Ship Button — slot always reserved to keep columns aligned */}
          <div className='mr-2 shrink-0 sm:mr-[35.5px]'>
            {showShipButton ? (
              <Link
                href={`${ProtectedRoute.CAMPAIGN_MANAGEMENT}/${encodedCampaignId}/${store.orderNumber}/order-shipment?from=${isReorder ? 'reorder' : 'order'}`}
                onClick={(e) => e.stopPropagation()}
                aria-label={t('shipAriaLabel', { storeName: store.storeName })}
                className='inline-flex justify-center h-7 items-center gap-1.5 rounded-md bg-gradient-to-b from-[var(--btn-primary-from)] to-[var(--btn-primary-to)] px-3 text-[11px] font-semibold text-white shadow-sm transition-opacity hover:opacity-90 sm:h-[35.5px] sm:gap-2 sm:rounded-lg sm:px-4 sm:text-[13px] w-[110px]'
              >
                {t('ship')}
              </Link>
            ) : (
              <div className=' w-[110px]'></div>
            )}
          </div>
        </div>
      </AccordionTrigger>

      <AccordionContent className='border-t border-border bg-[var(--neutral-200)] p-3 sm:p-5'>
        <p className='mb-2 text-[10px] font-semibold text-text-heading sm:mb-3 sm:text-xs'>
          {t('promotionsFor', { storeName: store.storeName })}
        </p>
        <div role='list' className='flex flex-col gap-3 sm:pl-5'>
          {store.orderItems.map((item) => (
            <PromotionOrderRow
              key={item.orderItemId}
              item={item}
              orderStatus={store.orderStatus}
              onView={onViewPromotion}
              isInvalid={isInvalid(item.orderItemId)}
              initialFiles={getImages(item.orderItemId)}
              onSave={(files) => setImages(item.orderItemId, files)}
              initialNote={getNote(item.orderItemId)}
              onNoteSave={(note) => setNote(item.orderItemId, note)}
              t={t}
            />
          ))}
        </div>

        {/* Submit Installation Proof button */}
        {showInstallationProofButton && (
          <div className='mt-4 flex justify-end'>
            <Button
              type='button'
              variant='default'
              isLoading={isUploading || isSubmittingProof}
              onClick={handleSubmitInstallationProof}
              className='h-[40px] rounded-[8px] bg-gradient-to-b from-[var(--btn-primary-from)] to-[var(--btn-primary-to)] px-5 text-[13px] font-semibold text-white shadow-sm transition-opacity hover:opacity-90 sm:h-[44px] sm:px-6 sm:text-[14px]'
            >
              {t('submitInstallationProof')}
            </Button>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
