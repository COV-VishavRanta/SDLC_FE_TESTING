import { SectionErrorBoundary } from '@/components';
import { decodeId } from '@/lib';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import StoreDetailsLoading from './loading';
import { StoreDetailsView } from './store-details-view';

/* ── Page Metadata (WCAG 2.4.2 Page Titled) ── */
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('storeManagement.details');
  return {
    title: `${t('title')} — Pop Logic`,
  };
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function StoreDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const t = await getTranslations('storeManagement.details');

  // Use our utility to decode the URL-safe ID back to UUID
  const storeId = decodeId(id);

  if (!storeId) {
    notFound();
  }

  return (
    <SectionErrorBoundary title={t('error.title')} description={t('error.description')}>
      <Suspense fallback={<StoreDetailsLoading />}>
        <StoreDetailsView storeId={storeId} />
      </Suspense>
    </SectionErrorBoundary>
  );
}
