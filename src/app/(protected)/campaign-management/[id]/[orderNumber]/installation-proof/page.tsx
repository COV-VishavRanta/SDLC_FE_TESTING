import { PageRoot } from '@/components';
import { CAMPAIGN_SUB_PAGE_NAME } from '@/constant';
import { decodeId } from '@/lib';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { CampaignSubPageGuard } from '../../(guards)/CampaignSubPageGuard';
import { VerifyInstallationProofHeader } from './(components)/verify-installation-proof-header/verify-installation-proof-header';
import { VerifyInstallationProofTable } from './(components)/verify-installation-proof-table/verify-installation-proof-table';
import { VerifyInstallationProofProvider } from './context/VerifyInstallationProofContext';
import InstallationProofSkeleton from './loading';

interface InstallationProofPageProps {
  params: Promise<{ id: string; orderNumber: string }>;
}

/* ── Page Metadata (WCAG 2.4.2 Page Titled) ── */
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('campaignManagement.details.verifyInstallationProof');
  return {
    title: `${t('pageTitle')} — Pop Logic`,
    description: t('pageTitle'),
  };
}

export default async function InstallationProofPage({ params }: InstallationProofPageProps) {
  const { id, orderNumber } = await params;

  const campaignId = decodeId(id);

  const orderNum = Number(orderNumber);

  if (!campaignId || !orderNumber || isNaN(orderNum) || orderNum <= 0) {
    notFound();
  }

  return (
    <CampaignSubPageGuard
      loader={<InstallationProofSkeleton />}
      campaignSubPageName={CAMPAIGN_SUB_PAGE_NAME.VERIFY_INSTALLATION_PROOF}
    >
      <VerifyInstallationProofProvider
        campaignId={campaignId}
        orderNumber={orderNum}
        encodedCampaignId={id}
      >
        <PageRoot>
          <VerifyInstallationProofHeader />
          <div className='flex flex-col gap-4'>
            <VerifyInstallationProofTable />
          </div>
        </PageRoot>
      </VerifyInstallationProofProvider>
    </CampaignSubPageGuard>
  );
}
