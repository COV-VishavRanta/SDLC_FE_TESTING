'use client';

import {
  ActionButtonCell,
  ActionCellContainer,
  CopyIcon,
  EditIcon,
  EyeIcon,
  InfoCircleIcon,
  PromotionDialog,
  StoreIcon,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  TrashIcon,
} from '@/components';
import { CampaignStatusEnum, EDITABLE_PROMOTION_STATUSES, ProtectedRoute } from '@/constant';
import { encodeId } from '@/lib';
import { PromotionType } from '@/types';
import { useTranslations } from 'next-intl';
import { useContext, useState } from 'react';

import { CampaignDetailsContext } from '../../../context/CampaignDetailsContext';
import { DeletePromotionDialog } from '../../delete-promotion-dialog/delete-promotion-dialog';
import { ViewPromotionDialog } from '../../view-promotion-dialog/view-promotion-dialog';

/* Statuses that allow edit/delete/distribute actions */

interface PromotionActionsProps {
  promotion: PromotionType;
  campaignStatus?: CampaignStatusEnum;
}

export function PromotionActions({ promotion, campaignStatus }: PromotionActionsProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [duplicateOpen, setDuplicateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);

  const { campaignData, encodedCampaignId, capabilities } = useContext(CampaignDetailsContext);
  const t = useTranslations('campaignManagement.promotionActions');

  const isEditable = campaignStatus ? EDITABLE_PROMOTION_STATUSES.has(campaignStatus) : false;

  return (
    <>
      <ActionCellContainer className='justify-end'>
        {capabilities.canViewPromotions && (
          <ActionButtonCell
            icon={<EyeIcon className='size-4 text-primary' aria-hidden='true' />}
            tooltip={t('view')}
            onClick={() => setViewOpen(true)}
            className='hover:bg-muted'
          />
        )}

        {isEditable && (
          <>
            {/* edit icon will not come from promotions created from inventory */}
            {capabilities.canEditPromotions &&
              (promotion?.isCreatedFromInventory ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <button
                          type='button'
                          aria-label={t('inventoryReadOnly')}
                          className='flex size-[38px] cursor-default items-center justify-center rounded-lg hover:bg-muted'
                        >
                          <InfoCircleIcon className='size-4 text-primary' aria-hidden='true' />
                        </button>
                      }
                    />
                    <TooltipContent side='top'>
                      <p>{t('inventoryReadOnly')}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <ActionButtonCell
                  icon={<EditIcon className='size-4 text-primary' aria-hidden='true' />}
                  tooltip={t('edit')}
                  onClick={() => setEditOpen(true)}
                  className='hover:bg-stat-icon-blue'
                />
              ))}
            {capabilities.canDistributeToStores && (
              <ActionButtonCell
                icon={<StoreIcon className='size-4 text-[#005C8A]' aria-hidden='true' />}
                tooltip={t('storeDistribution')}
                href={`${ProtectedRoute.CAMPAIGN_MANAGEMENT}/${encodedCampaignId}/store-distribution?pId=${encodeId(promotion.id)}`}
                className='hover:bg-muted'
              />
            )}

            {capabilities.canDuplicatePromotions && (
              <ActionButtonCell
                icon={<CopyIcon className='size-4 text-[#5C4800]' aria-hidden='true' />}
                tooltip={t('duplicate')}
                onClick={() => setDuplicateOpen(true)}
                className='hover:bg-stat-icon-blue'
              />
            )}

            {capabilities.canDeletePromotions && isEditable && (
              <ActionButtonCell
                icon={<TrashIcon className='size-4 text-error' aria-hidden='true' />}
                tooltip={t('delete')}
                onClick={() => setDeleteOpen(true)}
                className='hover:bg-red-50'
              />
            )}
          </>
        )}
      </ActionCellContainer>

      {/* Delete Promotion Dialog */}
      <DeletePromotionDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        promotionId={promotion.id}
        promotionName={promotion.name}
      />

      {/* Edit Promotion Dialog */}
      {editOpen && (
        <PromotionDialog
          mode='edit'
          campaignData={campaignData}
          initialData={promotion}
          onClose={() => setEditOpen(false)}
        />
      )}

      {/* Duplicate Promotion Dialog */}
      {duplicateOpen && (
        <PromotionDialog
          mode='create'
          campaignData={campaignData}
          initialData={{
            ...promotion,
            images: [],
          }}
          onClose={() => setDuplicateOpen(false)}
        />
      )}

      <ViewPromotionDialog
        open={viewOpen}
        onOpenChange={setViewOpen}
        promotion={promotion}
        showStores={capabilities.canAccessStoreDistributionPage}
      />
    </>
  );
}
