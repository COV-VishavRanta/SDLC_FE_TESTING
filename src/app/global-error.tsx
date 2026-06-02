'use client';

import './globals.css';

import { Button } from '@/components/ui/button';
import { AlertTriangleIcon } from '@/components/icons/AlertTriangleIcon';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang='en'>
      <body className={`${inter.variable} font-sans antialiased`}>
        <main className='flex min-h-[calc(100dvh-250px)] items-center justify-center bg-[var(--neutral-200)] p-4 sm:p-8'>
          <div className='flex w-full max-w-[600px] flex-col items-center gap-[30px] rounded-[10px] border border-[var(--gray-hover)] py-5'>
            <AlertTriangleIcon className='size-16 text-[var(--error)]' />

            <div className='flex w-full flex-col items-center gap-[15px] px-4 sm:px-12'>
              <h1 className='text-center text-[length:var(--font-size-h1-sm)] font-bold leading-5 tracking-[-0.15px] text-[var(--neutral-600)]'>
                Something went wrong
              </h1>
              <p className='text-center text-[length:var(--font-size-body)] font-[var(--font-weight-regular)] leading-5 tracking-[-0.15px] text-[var(--neutral-600)]'>
                We couldn&apos;t load this page properly. Please try again.
              </p>
            </div>

            <Button
              className='h-auto rounded-[8px] px-6 py-3 text-[length:var(--font-size-body-small)] font-[var(--font-weight-medium)]'
              onClick={() => reset()}
            >
              Refresh Page
            </Button>
          </div>
        </main>
      </body>
    </html>
  );
}
