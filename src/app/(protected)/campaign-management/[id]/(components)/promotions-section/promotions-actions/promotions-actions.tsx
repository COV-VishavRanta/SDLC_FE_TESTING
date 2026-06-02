'use client';

import { Button, PageSearch, PromotionDialog } from '@/components';
import { CampaignStatusEnum, EDITABLE_PROMOTION_STATUSES, ProtectedRoute } from '@/constant';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useContext, useState } from 'react';

import { CampaignDetailsContext } from '../../../context/CampaignDetailsContext';

interface PromotionsActionsProps {
  totalCount: number;
  search: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
}

export default function PromotionsActions({
  totalCount,
  search,
  onSearchChange,
  onClearSearch,
}: PromotionsActionsProps) {
  const [addOpen, setAddOpen] = useState(false);
  const { campaignData, encodedCampaignId, capabilities } = useContext(CampaignDetailsContext);

  const t = useTranslations('campaignManagement.details.promotionsTable');
  const tParent = useTranslations('campaignManagement');

  const isEditable = EDITABLE_PROMOTION_STATUSES.has(campaignData?.status as CampaignStatusEnum);

  return (
    <div className='flex flex-col gap-4'>
      {/* ── Section Header ── */}
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <h2 className='text-[16px] font-semibold leading-[24px] text-text-heading sm:text-[20px] sm:leading-[30px]'>
          {t('title')} ({totalCount ?? 0})
        </h2>

        <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3'>
          <PageSearch
            className='w-full'
            inputClassName='bg-white'
            placeholder={t('searchPlaceholder')}
            value={search}
            onChange={(e) => {
              onSearchChange(e.target.value);
            }}
            onClear={onClearSearch}
          />
          {isEditable && (
            <div className='flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:gap-3'>
              {capabilities.canImportPromotions && (
                <Button
                  variant='outline'
                  className='h-9 w-full cursor-pointer gap-2 rounded-lg border-primary px-3 text-[13px] font-semibold text-primary hover:bg-blue-50 sm:h-[43px] sm:w-auto sm:px-5 sm:text-[14px]'
                  nativeButton={false}
                  render={
                    <Link
                      href={`${ProtectedRoute.CAMPAIGN_MANAGEMENT}/${encodedCampaignId}/import-promotions`}
                    >
                      {t('importButton')}
                    </Link>
                  }
                />
              )}

              {capabilities.canReusePromotions && (
                <Button
                  className='h-9 w-full cursor-pointer gap-2 rounded-lg bg-gradient-to-b from-primary to-[#0077b3] px-3 text-[13px] font-semibold text-white hover:from-[#0077b3] hover:to-[#006699] sm:h-[41px] sm:w-auto sm:px-5 sm:text-[14px]'
                  nativeButton={false}
                  render={
                    <Link
                      href={`${ProtectedRoute.CAMPAIGN_MANAGEMENT}/${encodedCampaignId}/promotions-reuse`}
                    >
                      {tParent('reuseButton')}
                    </Link>
                  }
                />
              )}

              {capabilities.canAddPromotions && (
                <Button
                  className='h-9 w-full cursor-pointer gap-2 rounded-lg bg-gradient-to-b from-primary to-[#0077b3] px-3 text-[13px] font-semibold text-white hover:from-[#0077b3] hover:to-[#006699] sm:h-[41px] sm:w-auto sm:px-5 sm:text-[14px]'
                  onClick={() => setAddOpen(true)}
                >
                  {t('addButton')}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Promotion Dialog */}
      {addOpen && (
        <PromotionDialog
          mode='create'
          campaignData={campaignData}
          onClose={() => setAddOpen(false)}
        />
      )}
    </div>
  );
}
