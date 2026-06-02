import { SectionErrorBoundary } from '@/components';
import { decodeId } from '@/lib';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { BrandDetailsView } from './brand-details-view';
import BrandDetailsLoading from './loading';

/* ── Page Metadata (WCAG 2.4.2 Page Titled) ── */
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('brandManagement.details');
  return {
    title: `${t('title')} — Pop Logic`,
  };
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function BrandDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const t = await getTranslations('brandManagement.details');

  // Use our utility to decode the URL-safe ID back to UUID
  const brandId = decodeId(id);

  if (!brandId) {
    notFound();
  }

  return (
    <SectionErrorBoundary title={t('error.title')} description={t('error.description')}>
      <Suspense fallback={<BrandDetailsLoading />}>
        <BrandDetailsView brandId={brandId} />
      </Suspense>
    </SectionErrorBoundary>
  );
}
