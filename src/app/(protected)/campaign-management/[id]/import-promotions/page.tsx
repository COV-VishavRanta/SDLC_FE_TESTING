import { Card, PageRoot } from '@/components';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { CAMPAIGN_SUB_PAGE_NAME } from '@/constant';
import { CampaignSubPageGuard } from '../(guards)/CampaignSubPageGuard';
import ImportPromotionsActions from './(components)/import-promotions-action/import-promotions-actions';
import ImportPromotionsType from './(components)/import-promotions-action/import-promotions-type';
import SourceCampaignDropdown from './(components)/import-promotions-action/source-campaign-dropdown';
import DestinationCampaignName from './(components)/import-promotions-header/destination-camaign-name';
import ImportPromotionsHeader from './(components)/import-promotions-header/import-promotions-header';
import ImportPromotionsTable from './(components)/import-promotions-table/import-promtions-table';
import { ImportPromotionsProvider } from './context/ImportPromotionsContext';
import ImportPromotionsLoading from './loading';

interface ImportPromotionsPageProps {
  params: Promise<{ id: string }>;
}

/* ── Page Metadata (WCAG 2.4.2 Page Titled) ── */
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('campaignManagement.importPromotions');
  return {
    title: `${t('title')} — Pop Logic`,
  };
}

export default async function ImportPromotionsPage({ params }: ImportPromotionsPageProps) {
  const { id } = await params;
  const t = await getTranslations('campaignManagement.importPromotions');
  return (
    <CampaignSubPageGuard
      loader={<ImportPromotionsLoading />}
      campaignSubPageName={CAMPAIGN_SUB_PAGE_NAME.IMPORT_PROMOTIONS}
    >
      <PageRoot>
        <ImportPromotionsHeader encodedCampaignId={id} />

        <ImportPromotionsProvider encodedCampaignId={id}>
          <Card className='flex flex-col gap-5 rounded-xl border border-[var(--neutral-300)] bg-white px-8 py-6'>
            {/* ── Destination Campaign ── */}
            <div className='rounded-lg border border-[rgba(0,136,204,0.2)] bg-[#e0f2fe] px-6 py-5'>
              <p className='text-[13px] font-medium leading-[19.5px] text-[#1a1d21]'>
                {t('destinationCampaignLabel')}
              </p>
              <p className='mt-1 text-[15px] font-semibold leading-[22.5px] text-primary'>
                <DestinationCampaignName />
              </p>
            </div>

            {/* ── Import Action ── */}
            <div className='flex flex-col gap-3'>
              <span
                id='import-action-label'
                className='text-[14px] font-medium leading-[21px] text-[#1a1d21]'
              >
                {t('importActionLabel')}
                <span className='ml-1 text-destructive' aria-hidden='true'>
                  *
                </span>
              </span>
              <div
                className='grid grid-cols-1 sm:grid-cols-2 gap-5'
                role='radiogroup'
                aria-labelledby='import-action-label'
              >
                <ImportPromotionsType />
              </div>
            </div>

            {/* ── Source Campaign ── */}
            <SourceCampaignDropdown />

            {/* ── Promotions List ── */}
            <ImportPromotionsTable />

            {/* ── Action Buttons ── */}
            <ImportPromotionsActions />
          </Card>
        </ImportPromotionsProvider>
      </PageRoot>
    </CampaignSubPageGuard>
  );
}
