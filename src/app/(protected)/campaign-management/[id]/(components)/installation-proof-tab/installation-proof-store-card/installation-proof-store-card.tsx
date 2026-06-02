'use client';

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  OrderStatusCell,
  StoreIcon,
} from '@/components';
import { StoreOrderType } from '@/types';
import { useTranslations } from 'next-intl';

import { ProtectedRoute, SHOW_VERIFY_BUTTON } from '@/constant';
import { useCapabilities } from '@/hooks';
import { CAMPAIGN_CAPABILITIES_MAP, DEFAULT_CAMPAIGN_CAPABILITIES } from '@/lib';
import Link from 'next/link';
import InstallationProofPromotionRow from './installation-proof-promotion-row';

/* ─── Types ─── */
interface InstallationProofStoreCardProps {
  store: StoreOrderType;
  decodedCampaignId: string;
  t: ReturnType<typeof useTranslations<'campaignManagement.details.installationProofTab'>>;
}

/* ─── Installation Proof Store Card (view-only) ─── */
export function InstallationProofStoreCard({
  store,
  decodedCampaignId,
  t,
}: InstallationProofStoreCardProps) {
  const { canReviewInstallationProof } = useCapabilities(
    CAMPAIGN_CAPABILITIES_MAP,
    DEFAULT_CAMPAIGN_CAPABILITIES,
  );
  const showVerifyButton = SHOW_VERIFY_BUTTON.has(store.orderStatus) && canReviewInstallationProof;
  return (
    <AccordionItem value={store.storeId} className='border-b border-border last:border-b-0'>
      <AccordionTrigger className='items-center rounded-none border-0 bg-white px-3 pb-3 pt-2.5 hover:no-underline sm:px-5 sm:pb-5 sm:pt-3'>
        <div className='flex w-full flex-1 flex-col gap-2 lg:flex-row lg:items-center lg:gap-[42px]'>
          {/* Store name */}
          <div className='flex flex-col leading-4 tracking-[-0.15px] sm:gap-2 justify-start align-baseline'>
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

          {/* Stats — 3-col grid on mobile, flex siblings on desktop */}
          <div className='grid w-full grid-cols-3 gap-x-1 gap-y-2 lg:contents'>
            {/* Total Promotions */}
            <div className='flex flex-col items-center gap-0.5 sm:gap-1 lg:flex-1'>
              <span className='text-[8px] font-medium uppercase leading-3 tracking-[-0.1px] text-muted-foreground sm:text-xs sm:leading-5 sm:tracking-[-0.15px]'>
                {t('promotions')}
              </span>
              <span className='flex h-5 w-6 items-center justify-center rounded-md bg-[var(--primary-300)] text-[10px] font-medium leading-4 text-primary sm:h-7 sm:w-8 sm:rounded-lg sm:text-base sm:leading-5'>
                {store.totalPromotions}
              </span>
            </div>

            {/* Total Quantity */}
            <div className='flex flex-col items-center gap-0.5 sm:gap-1 lg:flex-1'>
              <span className='text-[8px] font-medium uppercase leading-3 tracking-[-0.1px] text-muted-foreground sm:text-xs sm:leading-5 sm:tracking-[-0.15px]'>
                {t('totalQty')}
              </span>
              <span className='text-xs font-semibold text-foreground sm:text-xl'>
                {store.totalQuantity}
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

          {/* Verify Button — slot always reserved to keep columns aligned */}
          {showVerifyButton && (
            <div className='mr-2 shrink-0 sm:mr-[35.5px]'>
              <Link
                href={`${ProtectedRoute.CAMPAIGN_MANAGEMENT}/${decodedCampaignId}/${store.orderNumber}/installation-proof`}
                onClick={(e) => e.stopPropagation()}
                aria-label={t('verifyAriaLabel', { storeName: store.storeName })}
                className='inline-flex justify-center h-7 items-center gap-1.5 rounded-md bg-gradient-to-b from-[var(--btn-primary-from)] to-[var(--btn-primary-to)] px-3 text-[11px] font-semibold text-white shadow-sm transition-opacity hover:opacity-90 sm:h-[35.5px] sm:gap-2 sm:rounded-lg sm:px-4 sm:text-[13px] w-[110px]'
              >
                {t('verify')}
              </Link>
            </div>
          )}
        </div>
      </AccordionTrigger>

      <AccordionContent className='border-t border-border bg-[var(--neutral-200)] p-3 sm:p-5'>
        <p className='mb-2 text-[10px] font-semibold text-text-heading sm:mb-3 sm:text-xs'>
          {t('promotionsFor', { storeName: store.storeName })}
        </p>
        <div role='list' className='flex flex-col gap-3'>
          {store.orderItems.map((item) => (
            <InstallationProofPromotionRow key={item.orderItemId} item={item} t={t} />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
