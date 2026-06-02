import { SectionErrorBoundary } from '@/components';
import { decodeId } from '@/lib';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import PSPDetailsLoading from './loading';
import { PspDetailsView } from './psp-details-view';

/* ── Page Metadata (WCAG 2.4.2 Page Titled) ── */
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('pspManagement.details');
  return {
    title: `${t('title')} — Pop Logic`,
  };
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PspDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const t = await getTranslations('pspManagement.details');

  // Use our utility to decode the URL-safe ID back to UUID
  const pspId = decodeId(id);

  if (!pspId) {
    notFound();
  }

  return (
    <SectionErrorBoundary title={t('error.title')} description={t('error.description')}>
      <Suspense fallback={<PSPDetailsLoading />}>
        <PspDetailsView pspId={pspId} />
      </Suspense>
    </SectionErrorBoundary>
  );
}
