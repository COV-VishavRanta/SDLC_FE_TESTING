/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
'use client';

import {
  Button,
  CalendarIcon,
  CloseIcon,
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  ImagePreviewButton,
} from '@/components';
import { formatDateLocalized } from '@/lib/utils';
import { PromotionType } from '@/types';
import { useLocale, useTranslations } from 'next-intl';
import { Suspense } from 'react';

import { StoreTable } from './store-table/store-table';
import { StoreTableSkeleton } from './store-table/store-table.loading';

/* ── Types ── */
interface ViewPromotionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  promotion: Omit<PromotionType, 'storeCount' | 'totalDistributedQty'>;
  /** When false, hides the Participating Stores section and skips the distribution query (e.g. when viewing inventory items). Defaults to true. */
  showStores?: boolean;
  /** When false, hides the Need Design section. Defaults to true. */
  showNeedDesign?: boolean;
}

/* ── Detail field ── */
interface DetailFieldProps {
  label: string;
  children: React.ReactNode;
}

function DetailField({ label, children }: DetailFieldProps) {
  return (
    <div className='flex flex-col gap-[6px]'>
      <p className='text-[12px] font-normal uppercase leading-5 tracking-[-0.15px] text-[var(--neutral-500)]'>
        {label}
      </p>
      <div className='text-[14px] font-medium leading-5 text-[#0a0a0a]'>{children}</div>
    </div>
  );
}

/* ── Main dialog ── */
export function ViewPromotionDialog({
  open,
  onOpenChange,
  promotion,
  showStores = false,
  showNeedDesign = true,
}: ViewPromotionDialogProps) {
  const t = useTranslations('campaignManagement.details.viewPromotion');
  const tFields = useTranslations('campaignManagement.details.viewPromotion.fields');
  const locale = useLocale();

  const primaryImage =
    promotion.images?.find((img) => img.isPrimary) ?? promotion.images?.[0] ?? null;

  const createdOn = formatDateLocalized(promotion.createdAt, locale);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className='flex max-h-[90vh] w-full flex-col gap-0 overflow-hidden rounded-2xl p-0 ring-0 sm:max-w-[700px]'
      >
        {/* ── Header ── */}
        <DialogHeader className='flex flex-row items-center justify-between border-b border-[#e1e6eb] px-8 py-6'>
          <DialogTitle className='text-[20px] font-semibold leading-[30px] text-[#0a0a0a]'>
            {t('dialogTitle')}
          </DialogTitle>
          <DialogClose
            render={
              <button
                type='button'
                className='flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-input-bg hover:text-text-heading'
              >
                <CloseIcon className='size-5' aria-hidden='true' />
                <span className='sr-only'>{t('closeButton')}</span>
              </button>
            }
          />
        </DialogHeader>

        {/* ── Scrollable body ── */}
        <div className='flex flex-col gap-6 overflow-y-auto px-8 py-6'>
          {/* Basic Information card */}
          <div className='flex flex-col gap-4 rounded-[12px] border border-[#e5e7eb] bg-[#f9fafb] px-5 py-6'>
            {/* Section header */}
            <div className='flex items-start justify-between'>
              <p className='text-[16px] font-semibold leading-6 text-[#0a0a0a]'>{t('title')}</p>
              {createdOn && (
                <p className='flex items-center gap-1.5 text-[13px] leading-5 text-[var(--gray-600)]'>
                  <CalendarIcon className='size-3.5' aria-hidden='true' />
                  {t('createdOn', { date: createdOn })}
                </p>
              )}
            </div>

            {/* Short divider */}
            <div className='h-px w-10 bg-[#e1e6eb]' />

            {/* 2-column info grid */}
            <div className='grid grid-cols-2 gap-x-4 gap-y-5'>
              <DetailField label={tFields('promotionName')}>
                {promotion.name ?? (
                  <p className='text-[14px] font-medium leading-5 text-[#0a0a0a]'>-</p>
                )}
              </DetailField>

              <DetailField label={tFields('width')}>
                {promotion.width ?? (
                  <p className='text-[14px] font-medium leading-5 text-[#0a0a0a]'>-</p>
                )}
              </DetailField>

              <DetailField label={tFields('height')}>
                {promotion.height ?? (
                  <p className='text-[14px] font-medium leading-5 text-[#0a0a0a]'>-</p>
                )}
              </DetailField>

              <DetailField label={tFields('material')}>
                {promotion.material || (
                  <p className='text-[14px] font-medium leading-5 text-[#0a0a0a]'>-</p>
                )}
              </DetailField>

              {showNeedDesign && (
                <DetailField label={tFields('needDesign')}>
                  {promotion.needDesign ? tFields('needDesignYes') : tFields('needDesignNo')}
                </DetailField>
              )}

              <DetailField label={tFields('isReusable')}>
                {promotion?.isReusable ? tFields('isReusableYes') : tFields('isReusableNo')}
              </DetailField>

              <DetailField label={tFields('photos')}>
                <ImagePreviewButton imageUrl={primaryImage?.url} />
              </DetailField>
            </div>

            {/* Finishing Specification — full width */}

            <DetailField label={tFields('finishingSpec')}>
              <p className='text-[14px] font-medium leading-5 text-[#0a0a0a]'>
                {promotion?.specifications || '—'}
              </p>
            </DetailField>

            {/* Description — full width */}
            <DetailField label={tFields('description')}>
              <p className='text-[14px] font-medium leading-5 text-[#0a0a0a]'>
                {promotion?.description || '—'}
              </p>
            </DetailField>
          </div>

          {/* Participating Stores */}
          {showStores && (
            <Suspense fallback={<StoreTableSkeleton />}>
              <StoreTable promotionId={promotion.id} />
            </Suspense>
          )}
        </div>

        {/* ── Footer ── */}
        <div className='flex justify-end border-t border-[#e5e7eb] px-6 py-5'>
          <Button
            className='h-[44px] rounded-[8px] bg-gradient-to-b from-primary to-[var(--blue-medium)] px-6 font-medium text-white sm:text-[16px]'
            onClick={() => onOpenChange(false)}
          >
            {t('closeButton')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
