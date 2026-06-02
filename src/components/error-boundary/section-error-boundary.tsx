'use client';

import { type ReactNode } from 'react';

import { Card } from '../ui/card';
import { ErrorBoundary } from './error-boundary';
import { SectionErrorFallback } from './section-error-fallback';

interface SectionErrorBoundaryProps {
  children: ReactNode;
  /** Pre-translated section title shown in the error card */
  title: string;
  /** Pre-translated description shown in the error card */
  description: string;
}

/**
 * Wraps a Suspense boundary with an isolated error boundary.
 * Accepts pre-translated strings so it can be composed from both Server and Client Component parents.
 */
export function SectionErrorBoundary({ children, title, description }: SectionErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={() => (
        <Card className='rounded-[8px] border border-[var(--neutral-300)] bg-[var(--neutral-100)] p-[15px] sm:p-6'>
          <SectionErrorFallback title={title} description={description} />
        </Card>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}
