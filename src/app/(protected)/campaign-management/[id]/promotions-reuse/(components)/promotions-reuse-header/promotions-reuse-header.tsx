import { ArrowLeftIcon } from '@/components';
import { ProtectedRoute } from '@/constant';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

/* ── Props ── */
export interface PromotionsReuseHeaderProps {
  encodedCampaignId: string;
}

export default async function PromotionsReuseHeader({
  encodedCampaignId,
}: PromotionsReuseHeaderProps) {
  const t = await getTranslations('campaignManagement.promotionsReuse');
  return (
    <>
      {/* Back link */}
      <Link
        href={`${ProtectedRoute.CAMPAIGN_MANAGEMENT}/${encodedCampaignId}`}
        className='inline-flex w-fit items-center gap-1.5 text-[14px] font-medium leading-[21px] text-primary hover:underline'
      >
        <ArrowLeftIcon className='size-4' aria-hidden='true' />
        {t('backLink')}
      </Link>

      {/* Page header */}
      <h1 className='text-[24px] sm:text-[28px] font-semibold leading-normal sm:leading-[42px] text-text-heading'>
        {t('title')}
      </h1>
    </>
  );
}
