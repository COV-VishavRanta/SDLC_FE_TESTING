'use client';

import { AlertTriangleIcon } from '@/components';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export function PageErrorFallback() {
  const t = useTranslations('errors.pageError');

  return (
    <div className='flex min-h-[calc(100dvh-250px)] w-full items-center justify-center bg-[var(--neutral-200)] p-4 sm:p-8'>
      <div className='flex w-full max-w-[600px] flex-col items-center gap-[30px] rounded-[var(--radius)] border border-[var(--gray-hover)] px-6 py-5 sm:px-0'>
        <AlertTriangleIcon className='size-16 text-[var(--error)]' />

        <div className='flex w-full flex-col items-center gap-[15px] px-2 sm:px-12'>
          <h1 className='text-center text-[length:var(--font-size-h1-sm)] font-bold leading-8 tracking-[-0.15px] text-[var(--neutral-600)]'>
            {t('title')}
          </h1>
          <p className='text-center text-[length:var(--font-size-body)] font-[var(--font-weight-regular)] leading-5 tracking-[-0.15px] text-[var(--neutral-600)]'>
            {t('description')}
          </p>
        </div>

        <Button
          onClick={() => window.location.reload()}
          className='h-auto rounded-[8px] px-6 py-3 font-[var(--font-weight-medium)] sm:text-[16px]'
        >
          {t('refreshButton')}
        </Button>
      </div>
    </div>
  );
}
