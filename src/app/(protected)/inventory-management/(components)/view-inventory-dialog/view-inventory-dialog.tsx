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
import { InventoryType } from '@/types';
import { useLocale, useTranslations } from 'next-intl';

/* ── Types ── */
interface ViewInventoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inventory: InventoryType;
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
export function ViewInventoryDialog({ open, onOpenChange, inventory }: ViewInventoryDialogProps) {
  const t = useTranslations('inventoryManagement.viewInventoryDialog');
  const tFields = useTranslations('inventoryManagement.viewInventoryDialog.fields');
  const locale = useLocale();

  const primaryImage =
    inventory.images?.find((img) => img.isPrimary) ?? inventory.images?.[0] ?? null;

  const createdOn = formatDateLocalized(inventory.createdAt, locale);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className='flex max-h-[90vh] w-full flex-col gap-0 overflow-hidden rounded-2xl p-0 ring-0 sm:max-w-[700px]'
      >
        {/* ── Header ── */}
        <DialogHeader className='flex flex-row items-center justify-between border-b border-[#e1e6eb] px-5 py-4 sm:px-8 sm:py-6'>
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
        <div className='flex flex-col gap-6 overflow-y-auto px-5 py-5 sm:px-8 sm:py-6'>
          {/* Basic Information card */}
          <div className='flex flex-col gap-4 rounded-[12px] border border-[#e5e7eb] bg-[#f9fafb] px-5 py-6'>
            {/* Section header */}
            <div className='flex items-start justify-between'>
              <h3 className='text-[16px] font-semibold leading-6 text-[#0a0a0a]'>{t('title')}</h3>
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
              <DetailField label={tFields('itemName')}>
                {inventory.name || <span>-</span>}
              </DetailField>

              <DetailField label={tFields('width')}>
                {inventory.width ?? <span>-</span>}
              </DetailField>

              <DetailField label={tFields('height')}>
                {inventory.height ?? <span>-</span>}
              </DetailField>

              <DetailField label={tFields('material')}>
                {inventory.material || <span>-</span>}
              </DetailField>

              <DetailField label={tFields('availableQuantity')}>
                {inventory.quantity ?? <span>-</span>}
              </DetailField>

              <DetailField label={tFields('brand')}>
                {inventory?.brandName || <span>-</span>}
              </DetailField>

              <DetailField label={tFields('photos')}>
                <ImagePreviewButton imageUrl={primaryImage?.url} />
              </DetailField>
            </div>

            {/* Finishing Specification — full width */}
            <DetailField label={tFields('finishingSpec')}>
              <p className='text-[14px] font-medium leading-5 text-[#0a0a0a]'>
                {inventory.specifications || '—'}
              </p>
            </DetailField>

            {/* Description — full width */}
            <DetailField label={tFields('description')}>
              <p className='text-[14px] font-medium leading-5 text-[#0a0a0a]'>
                {inventory.description || '—'}
              </p>
            </DetailField>
          </div>
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
