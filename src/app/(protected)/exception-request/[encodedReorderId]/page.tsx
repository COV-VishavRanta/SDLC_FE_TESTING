import { PageRoot, SectionErrorBoundary } from '@/components';
import { decodeId } from '@/lib';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import ReorderDetailHeader from './(components)/reorder-detail-header/reorder-detail-header';
import ReorderDetailHeaderLoading from './(components)/reorder-detail-header/reorder-detail-header.loading';
import ReorderInfoSection from './(components)/reorder-info-section/reorder-info-section';
import ReorderInfoSectionLoading from './(components)/reorder-info-section/reorder-info-section.loading';
import ReorderPromotionTable from './(components)/reorder-promotion-table/reorder-promotion-table';
import ReorderPromotionTableLoading from './(components)/reorder-promotion-table/reorder-promotion-table.loading';
import { ReorderDetailsProvider } from './context/ReorderDetailsContext';

interface ReorderDetailPageProps {
  params: Promise<{ encodedReorderId: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('reorderDetails');
  return {
    title: `${t('page.title')} — Pop Logic`,
    description: t('page.description'),
  };
}

export default async function ReorderDetailPage({ params }: ReorderDetailPageProps) {
  const { encodedReorderId } = await params;
  const t = await getTranslations('reorderDetails');

  const reorderId = decodeId(encodedReorderId);

  if (!reorderId) {
    notFound();
  }

  return (
    <PageRoot>
      <ReorderDetailsProvider reorderId={reorderId}>
        <div className='flex flex-col gap-5'>
          {/* ── Back link + Header ── */}
          <SectionErrorBoundary
            title={t('errors.header.title')}
            description={t('errors.header.description')}
          >
            <Suspense fallback={<ReorderDetailHeaderLoading />}>
              <ReorderDetailHeader />
            </Suspense>
          </SectionErrorBoundary>

          {/* ── Info Section ── */}
          <SectionErrorBoundary
            title={t('errors.info.title')}
            description={t('errors.info.description')}
          >
            <Suspense fallback={<ReorderInfoSectionLoading />}>
              <ReorderInfoSection />
            </Suspense>
          </SectionErrorBoundary>

          {/* ── Promotions Table ── */}
          <SectionErrorBoundary
            title={t('errors.promotions.title')}
            description={t('errors.promotions.description')}
          >
            <Suspense fallback={<ReorderPromotionTableLoading />}>
              <ReorderPromotionTable />
            </Suspense>
          </SectionErrorBoundary>
        </div>
      </ReorderDetailsProvider>
    </PageRoot>
  );
}
