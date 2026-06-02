'use client';

import { ArrowLeftIcon, PageDescription, PageHeader, PageTitle } from '@/components';
import { ProtectedRoute } from '@/constant';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useContext } from 'react';

import { VerifyInstallationProofContext } from '../../context/VerifyInstallationProofContext';

/* ─── Verify Installation Proof Header ─── */
export function VerifyInstallationProofHeader() {
  const t = useTranslations('campaignManagement.details.verifyInstallationProof');
  const { encodedCampaignId, campaignName, storeOrder } = useContext(
    VerifyInstallationProofContext,
  );

  return (
    <>
      <Link
        href={`${ProtectedRoute.CAMPAIGN_MANAGEMENT}/${encodedCampaignId}?tab=installation-proof`}
        className='inline-flex w-fit items-center gap-1.5 text-[14px] font-medium leading-[21px] text-primary hover:underline'
        aria-label={t('backLink', { campaignName })}
      >
        <ArrowLeftIcon className='size-4' aria-hidden='true' />
        {t('backLink', { campaignName })}
      </Link>

      <PageHeader>
        <PageTitle className='font-semibold text-text-heading'>{t('pageTitle')}</PageTitle>
        <PageDescription>{storeOrder?.storeName ?? ''}</PageDescription>
      </PageHeader>
    </>
  );
}
