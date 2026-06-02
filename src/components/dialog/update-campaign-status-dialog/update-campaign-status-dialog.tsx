'use client';

import {
  Button,
  CloseIcon,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  InfoCircleIcon,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components';
import { PSP_UPDATABLE_CAMPAIGN_STATUS_TRANSITIONS, STATUS_DISPLAY_NAMES } from '@/constant';
import {
  CHANGE_CAMPAIGN_STATUS,
  ChangeCampaignStatusResponse,
  ChangeCampaignStatusVariables,
} from '@/graphql';
import { CampaignType } from '@/types';
import { useMutation } from '@apollo/client/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

/* ─── Types ─── */
interface UpdateCampaignStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: Pick<CampaignType, 'id' | 'name' | 'status' | 'brandName'>;
  onSuccess?: () => void;
}

/* ─── Update Campaign Status Dialog ─── */
export default function UpdateCampaignStatusDialog({
  open,
  onOpenChange,
  campaign,
  onSuccess,
}: UpdateCampaignStatusDialogProps) {
  const t = useTranslations('campaignManagement.updateStatusDialog');

  const [selectedStatus, setSelectedStatus] = useState<typeof campaign.status | null>(null);

  const [changeCampaignStatus, { loading }] = useMutation<
    ChangeCampaignStatusResponse,
    ChangeCampaignStatusVariables
  >(CHANGE_CAMPAIGN_STATUS, {
    refetchQueries: ['GetCampaignStoreOrders'],
  });

  const handleSubmit = async () => {
    await changeCampaignStatus({
      variables: {
        input: {
          campaignId: campaign.id,
          newStatus: selectedStatus!,
        },
      },
      onCompleted: ({ changeCampaignStatus: result }) => {
        if (result.success) {
          toast.success(t('successMessage'));
          onOpenChange(false);
          onSuccess?.();
        } else {
          toast.error(result.message ?? t('errorMessage'));
        }
      },
      onError: () => {
        toast.error(t('errorMessage'));
      },
    });
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!loading) {
      onOpenChange(nextOpen);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className='flex w-full flex-col gap-0 overflow-hidden rounded-xl p-0 ring-0 sm:max-w-[600px]'
        aria-labelledby='update-status-title'
        aria-describedby='update-status-description'
      >
        {/* ── Header ── */}
        <DialogHeader className='flex flex-row items-start justify-between gap-5 border-b border-[var(--neutral-300)] px-5 py-4 sm:px-8 sm:py-6'>
          <div className='flex flex-1 flex-col gap-2'>
            <DialogTitle
              id='update-status-title'
              className='text-[20px] font-semibold leading-normal text-[var(--neutral-900)]'
            >
              {t('title')}
            </DialogTitle>
            <DialogDescription
              id='update-status-description'
              render={
                <p className='text-[14px] font-normal leading-5 tracking-[-0.15px] text-[var(--neutral-500)]' />
              }
            >
              {t('subtitle')}
            </DialogDescription>
          </div>
          <DialogClose
            render={
              <button
                type='button'
                className='flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md text-[var(--neutral-900)] transition-colors hover:opacity-70'
                aria-label={t('closeButton')}
              >
                <CloseIcon className='size-6' aria-hidden='true' />
                <span className='sr-only'>{t('closeButton')}</span>
              </button>
            }
          />
        </DialogHeader>

        {/* ── Body ── */}
        <div className='flex flex-col gap-5 px-5 py-5 sm:px-8 sm:py-6'>
          {/* Campaign info lines with bottom border */}
          <div className='flex flex-col gap-2 border-b border-[var(--gray-300)] pb-5 pl-[3px] pr-4'>
            <p className='text-[14px] font-normal leading-5 tracking-[-0.15px] text-[var(--neutral-500)]'>
              {t('infoLabels.campaign')}: {campaign.name}
            </p>
            <p className='text-[14px] font-normal leading-5 tracking-[-0.15px] text-[var(--neutral-500)]'>
              {t('infoLabels.currentStatus')}: {STATUS_DISPLAY_NAMES[campaign.status]}
            </p>
            {campaign.brandName && (
              <p className='text-[14px] font-normal leading-5 tracking-[-0.15px] text-[var(--neutral-500)]'>
                {t('infoLabels.brand')}: {campaign.brandName}
              </p>
            )}
          </div>

          {/* New Status Select */}
          <div className='flex flex-col gap-2'>
            <label
              htmlFor='new-campaign-status'
              className='flex items-center gap-1 text-[14px] font-medium leading-normal text-[var(--neutral-900)]'
            >
              {t('fields.newStatus.label')}
              <span className='text-[16px] tracking-[0.16px] text-destructive' aria-hidden='true'>
                *
              </span>
              <span className='sr-only'> {t('fields.newStatus.required')}</span>
            </label>
            <Select
              aria-label={t('fields.newStatus.label')}
              value={selectedStatus}
              onValueChange={(val) => {
                if (val) setSelectedStatus(val as typeof selectedStatus);
              }}
            >
              <SelectTrigger
                id='new-campaign-status'
                aria-label={t('fields.newStatus.label')}
                className='h-[47px] rounded-[8px] border-[var(--neutral-300)] bg-[var(--neutral-200)] text-[14px] text-[var(--neutral-900)] sm:text-[16px]'
              >
                <SelectValue placeholder={t('fields.newStatus.placeholder')}>
                  {selectedStatus !== null ? STATUS_DISPLAY_NAMES[selectedStatus] : undefined}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className='rounded-[8px]' alignItemWithTrigger={false}>
                {(PSP_UPDATABLE_CAMPAIGN_STATUS_TRANSITIONS[campaign.status] ?? []).map(
                  (status) => (
                    <SelectItem
                      key={status}
                      value={status}
                      className='text-[14px] tracking-[-0.15px]'
                    >
                      {STATUS_DISPLAY_NAMES[status]}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Notification info banner */}
          <div
            className='flex items-start gap-3 rounded-lg border-2 border-[var(--neutral-200)] bg-[var(--neutral-200)] p-3.5'
            role='note'
            aria-label={t('notification.ariaLabel')}
          >
            <div className='flex size-9 shrink-0 items-center justify-center rounded-lg bg-[var(--primary-500)]'>
              <InfoCircleIcon className='size-[17px] text-white' aria-hidden='true' />
            </div>
            <div className='flex flex-col'>
              <p className='text-[14px] font-medium leading-5 text-[var(--primary-500)]'>
                {t('notification.title')}
              </p>
              <p className='text-[12px] leading-5 tracking-[-0.15px] text-[var(--blue-dark)]'>
                {t('notification.description')}
              </p>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <DialogFooter className='flex h-auto min-h-[70px] shrink-0 flex-col-reverse gap-3 px-5 py-2 sm:h-[88px] sm:flex-row sm:items-center sm:justify-end sm:px-8 sm:py-0'>
          <Button
            type='button'
            variant='outline'
            className='h-[43px] flex-1 rounded-[8px] border border-border bg-input-bg font-medium leading-normal text-text-heading hover:bg-muted sm:text-[16px]'
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            {t('cancelButton')}
          </Button>
          <Button
            type='button'
            className='h-[43px] flex-1 rounded-[8px] bg-gradient-to-b font-medium leading-normal sm:text-[16px]'
            onClick={handleSubmit}
            disabled={loading || !selectedStatus}
            aria-busy={loading}
          >
            {loading ? t('submitting') : t('submitButton')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
