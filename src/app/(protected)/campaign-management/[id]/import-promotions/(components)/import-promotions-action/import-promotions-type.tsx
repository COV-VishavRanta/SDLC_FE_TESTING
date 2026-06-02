'use client';

import { ImportPromotionMode } from '@/constant';
import { useContext } from 'react';

import { cn } from '@/lib/utils';
import { ImportPromotionsContext } from '../../context/ImportPromotionsContext';

export default function ImportPromotionsType() {
  const { importAction, setImportAction, t } = useContext(ImportPromotionsContext);
  return (
    <>
      {/* Copy */}
      <button
        type='button'
        role='radio'
        aria-checked={importAction === ImportPromotionMode.COPY}
        tabIndex={importAction === ImportPromotionMode.COPY ? 0 : -1}
        onClick={() => setImportAction(ImportPromotionMode.COPY)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            setImportAction(ImportPromotionMode.REPLACE);
            const nextBtn = e.currentTarget.nextElementSibling as HTMLButtonElement | null;
            nextBtn?.focus();
          }
        }}
        className={`flex cursor-pointer items-start gap-3 rounded-[8px] border-2 px-5 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
          importAction === ImportPromotionMode.COPY
            ? 'border-primary bg-primary/5'
            : 'border-[#e5e7eb] bg-white hover:border-primary/60'
        }`}
      >
        <span
          className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${
            importAction === ImportPromotionMode.COPY ? 'border-primary' : 'border-[#9ca3af]'
          }`}
        >
          {importAction === ImportPromotionMode.COPY && (
            <span className='size-2.5 rounded-full bg-primary' />
          )}
        </span>
        <div className='flex flex-col gap-1'>
          <span className='text-[15px] font-semibold leading-[22.5px] text-[#1a1d21]'>
            {t('importActionCopyTitle')}
          </span>
          <span className='text-[12px] font-medium leading-[18px] text-[var(--gray-600)]'>
            {t('importActionCopyDescription')}
          </span>
        </div>
      </button>

      {/* Replace */}
      <button
        type='button'
        role='radio'
        aria-checked={importAction === ImportPromotionMode.REPLACE}
        tabIndex={importAction === ImportPromotionMode.REPLACE ? 0 : -1}
        onClick={() => setImportAction(ImportPromotionMode.REPLACE)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            setImportAction(ImportPromotionMode.COPY);
            const prevBtn = e.currentTarget.previousElementSibling as HTMLButtonElement | null;
            prevBtn?.focus();
          }
        }}
        className={`flex cursor-pointer items-start gap-3 rounded-[8px] border-2 px-5 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
          importAction === ImportPromotionMode.REPLACE
            ? 'border-primary bg-primary/5'
            : 'border-[#e5e7eb] bg-white hover:border-primary/60'
        }`}
      >
        <span
          className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${
            importAction === ImportPromotionMode.REPLACE ? 'border-primary' : 'border-[#9ca3af]'
          }`}
        >
          {importAction === ImportPromotionMode.REPLACE && (
            <span className='size-2.5 rounded-full bg-primary' />
          )}
        </span>
        <div className='flex flex-col gap-1'>
          <span className='text-[15px] font-semibold leading-[22.5px] text-[#1a1d21]'>
            {t('importActionReplaceTitle')}
          </span>
          <span
            className={cn(
              'text-[12px] font-medium leading-[18px] text-[var(--gray-600)]',
              importAction === ImportPromotionMode.REPLACE && 'font-bold',
            )}
          >
            {t('importActionReplaceDescription')}
          </span>
        </div>
      </button>
    </>
  );
}
