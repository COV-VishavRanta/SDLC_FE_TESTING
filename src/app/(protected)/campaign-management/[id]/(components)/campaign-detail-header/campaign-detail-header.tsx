'use client';

import {
  ArrowLeftIcon,
  Button,
  CampaignDialog,
  CampaignStatusCell,
  UpdateCampaignStatusDialog,
} from '@/components';
import {
  CampaignStatusEnum,
  DELETABLE_CAMPAIGN_STATUSES,
  EDITABLE_CAMPAIGN_STATUSES,
  MARK_COMPLETE_CAMPAIGN_STATUSES,
  MARK_ON_HOLD_CAMPAIGN_STATUSES,
  ProtectedRoute,
  SHOW_EDIT_STATUS_BUTTON_STATUSES,
  SUBMIT_TO_PSP_CAMPAIGN_STATUSES,
} from '@/constant';
import { useGlobalProtected } from '@/contexts';
import {
  ASSIGN_CAMPAIGN_MANAGER,
  type AssignCampaignManagerResponse,
  type AssignCampaignManagerVariables,
  CHANGE_CAMPAIGN_STATUS,
  ChangeCampaignStatusResponse,
  ChangeCampaignStatusVariables,
  DELETE_CAMPAIGN,
  DeleteCampaignResponse,
  DeleteCampaignVariables,
  LIST_CAMPAIGNS,
  SUBMIT_CAMPAIGN,
  SubmitCampaignResponse,
  SubmitCampaignVariables,
} from '@/graphql';
import { useMutation } from '@apollo/client/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';
import { toast } from 'sonner';

import { DeleteCampaignDialog } from '../../../(components)/campaign-dialogs/delete-campaign-dialog';
import { CampaignDetailsContext } from '../../context/CampaignDetailsContext';

export function CampaignDetailHeader() {
  const { campaignData, capabilities, promotionsLength } = useContext(CampaignDetailsContext);
  const { currentUserData } = useGlobalProtected();
  const currentUserId = currentUserData?.me?.id;
  const router = useRouter();
  const t = useTranslations('campaignManagement.details');
  const tActions = useTranslations('campaignManagement.actions');
  const tMessages = useTranslations('campaignManagement.messages');

  // Derive allowed actions from the campaign's current status
  const isEditable = EDITABLE_CAMPAIGN_STATUSES.has(campaignData?.status as CampaignStatusEnum);
  const isDeletable = DELETABLE_CAMPAIGN_STATUSES.has(campaignData?.status as CampaignStatusEnum);
  const isSubmitToPsp = SUBMIT_TO_PSP_CAMPAIGN_STATUSES.has(
    campaignData?.status as CampaignStatusEnum,
  );
  const isMarkOnHold = MARK_ON_HOLD_CAMPAIGN_STATUSES.has(
    campaignData?.status as CampaignStatusEnum,
  );
  const isMarkComplete = MARK_COMPLETE_CAMPAIGN_STATUSES.has(
    campaignData?.status as CampaignStatusEnum,
  );

  // Combine status eligibility with user capability permissions to determine button visibility
  const showEditButton =
    capabilities.canEditCampaign &&
    isEditable &&
    (!capabilities.canEditOwnCampaignsOnly ||
      ((campaignData?.status === CampaignStatusEnum.DRAFT ||
        campaignData?.status === CampaignStatusEnum.ON_HOLD) &&
        campaignData?.campaignManagerId === currentUserId));
  const showDeleteButton = capabilities.canDeleteCampaign && isDeletable;
  const showSubmitToPspButton = capabilities.canSubmitToPsp && isSubmitToPsp;
  const showMarkOnHoldButton = capabilities.canMarkOnHold && isMarkOnHold;
  const showMarkCompleteButton = capabilities.canMarkComplete && isMarkComplete;
  const showUpdateStatusButton =
    capabilities.canEditStatus &&
    SHOW_EDIT_STATUS_BUTTON_STATUSES.has(campaignData?.status as CampaignStatusEnum);
  const showAssignToSelfButton =
    capabilities.canAssignSelfToCampaign &&
    !campaignData?.campaignManagerId &&
    EDITABLE_CAMPAIGN_STATUSES.has(campaignData?.status as CampaignStatusEnum);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const [assignCampaignManager, { loading: isAssigning }] = useMutation<
    AssignCampaignManagerResponse,
    AssignCampaignManagerVariables
  >(ASSIGN_CAMPAIGN_MANAGER, {
    refetchQueries: [LIST_CAMPAIGNS],
  });

  // Refetch the campaign list after deletion so the listing page reflects the removal
  const [deleteCampaign] = useMutation<DeleteCampaignResponse, DeleteCampaignVariables>(
    DELETE_CAMPAIGN,
    {
      refetchQueries: [LIST_CAMPAIGNS],
    },
  );

  const [submitCampaign, { loading: isSubmitting }] = useMutation<
    SubmitCampaignResponse,
    SubmitCampaignVariables
  >(SUBMIT_CAMPAIGN);

  const [changeCampaignStatus, { loading: isChangingStatus }] = useMutation<
    ChangeCampaignStatusResponse,
    ChangeCampaignStatusVariables
  >(CHANGE_CAMPAIGN_STATUS);

  // Submits the campaign to the PSP; refreshes the page on success to reflect the new status
  const handleSubmitToPsp = async () => {
    await submitCampaign({
      variables: { input: { id: campaignData?.id ?? '' } },
      onCompleted: () => {
        toast.success(t('submitSuccess'));
        router.refresh();
      },
    });
  };

  // Transitions the campaign to ON_HOLD; the server response includes a success flag and
  // optional message so we can surface the exact failure reason via toast
  const handleMarkOnHold = async () => {
    await changeCampaignStatus({
      variables: {
        input: { campaignId: campaignData?.id ?? '', newStatus: CampaignStatusEnum.ON_HOLD },
      },
      onCompleted: ({ changeCampaignStatus: result }) => {
        if (result.success) {
          toast.success(t('markOnHoldSuccess'));
          router.refresh();
        } else {
          toast.error(result.message ?? t('markOnHoldFailed'));
        }
      },
      onError: () => {
        toast.error(t('markOnHoldFailed'));
      },
    });
  };

  // Transitions the campaign to COMPLETED; same pattern as handleMarkOnHold
  const handleMarkComplete = async () => {
    await changeCampaignStatus({
      variables: {
        input: { campaignId: campaignData?.id ?? '', newStatus: CampaignStatusEnum.COMPLETED },
      },
      onCompleted: ({ changeCampaignStatus: result }) => {
        if (result.success) {
          toast.success(t('markCompleteSuccess'));
          router.refresh();
        } else {
          toast.error(result.message ?? t('markCompleteFailed'));
        }
      },
      onError: () => {
        toast.error(t('markCompleteFailed'));
      },
    });
  };

  // After a successful delete, redirect to the listing page since the detail page no longer has a valid record
  const handleDeleteConfirm = async () => {
    try {
      await deleteCampaign({ variables: { input: { id: campaignData?.id ?? '' } } });
      toast.success(t('deletedSuccess'));
      router.push(ProtectedRoute.CAMPAIGN_MANAGEMENT);
    } catch {
      toast.error(t('deleteFailed'));
    }
  };

  return (
    <>
      <div className='flex flex-col gap-4 sm:flex-row sm:justify-between'>
        <div className='flex flex-col gap-3 sm:gap-4'>
          {/* ── Back Link ── */}
          <Link
            href={ProtectedRoute.CAMPAIGN_MANAGEMENT}
            className='inline-flex w-fit items-center gap-1.5 text-xs font-medium leading-[18px] text-primary hover:underline sm:text-[14px] sm:leading-[21px]'
          >
            <ArrowLeftIcon className='size-3.5 sm:size-4' aria-hidden='true' />
            {t('backToCampaigns')}
          </Link>

          {/* ── Title + Status ── */}
          <div className='flex flex-col gap-1.5 sm:gap-2'>
            <h1 className='text-lg font-semibold leading-7 text-text-heading sm:text-[28px] sm:leading-[42px]'>
              {campaignData?.name}
            </h1>
            <div className='flex flex-wrap items-center gap-2 sm:gap-3'>
              {/* Status Badge */}
              <CampaignStatusCell status={campaignData?.status ?? ''} />

              {/* Campaign Type */}
              <span className='text-xs font-normal leading-[18px] tracking-[-0.15px] text-text-secondary sm:text-[14px] sm:leading-[21px]'>
                {campaignData?.isPermanent === true ? t('permanentCampaign') : t('oneOffCampaign')}
              </span>
            </div>
          </div>
        </div>

        {/* ── Header actions ── */}
        <div className='flex flex-col align-end'>
          {/* Mobile: 2-column grid so buttons pair up and a 3rd wraps to next row */}
          {/* Desktop (sm+): revert to flex row */}
          <div className='grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-3'>
            {/* Assign to Self */}
            {showAssignToSelfButton && (
              <Button
                variant='outline'
                className='h-8 w-full rounded-lg border-[var(--primary-500)] px-3 text-xs font-medium leading-none text-[var(--primary-500)] hover:bg-[var(--primary-300)] sm:h-[38px] sm:w-auto sm:px-4 sm:text-[14px]'
                disabled={isAssigning}
                onClick={async () => {
                  await assignCampaignManager({
                    variables: { input: { id: campaignData?.id ?? '' } },
                    onCompleted: () => {
                      toast.success(tMessages('success.assigned'));
                      router.refresh();
                    },
                  });
                }}
              >
                {tActions('assignToSelf')}
              </Button>
            )}

            {/* Update Status */}
            {showUpdateStatusButton && (
              // PSP Admin: Update Status button opens the Update Campaign Status dialog
              <Button
                variant='outline'
                className='h-8 w-full rounded-lg border-[var(--primary-500)] px-3 text-xs font-medium leading-none text-[var(--primary-500)] hover:bg-[var(--primary-300)] sm:h-[38px] sm:w-auto sm:px-4 sm:text-[14px]'
                onClick={() => setIsStatusOpen(true)}
              >
                {t('updateStatus')}
              </Button>
            )}

            {/* Edit */}
            {showEditButton && (
              <Button
                variant='outline'
                className='h-8 w-full rounded-lg border-[var(--primary-500)] px-3 text-xs font-medium leading-none text-[var(--primary-500)] hover:bg-[var(--primary-300)] sm:h-[38px] sm:w-auto sm:px-4 sm:text-[14px]'
                onClick={() => setIsEditOpen(true)}
              >
                {t('editButton')}
              </Button>
            )}

            {/* Delete */}
            {showDeleteButton && (
              <Button
                variant='destructive'
                className='h-8 w-full rounded-lg border-transparent bg-gradient-to-b from-[var(--delete-btn-from)] to-[var(--delete-btn-to)] px-3 text-xs font-medium leading-none text-white hover:from-[var(--delete-btn-hover-from)] hover:to-[var(--delete-btn-hover-to)] sm:h-[38px] sm:w-auto sm:px-4 sm:text-[14px]'
                onClick={() => setIsDeleteOpen(true)}
              >
                {t('deleteButton')}
              </Button>
            )}

            {/* Submit to PSP */}
            {showSubmitToPspButton && (
              <Button
                variant='default'
                className='h-8 w-full px-3 text-xs font-medium leading-none sm:h-[38px] sm:w-auto sm:px-4 sm:text-[14px]'
                onClick={handleSubmitToPsp}
                disabled={isSubmitting || !promotionsLength}
              >
                {isSubmitting ? t('submitting') : t('submitToPsp')}
              </Button>
            )}

            {/* Mark On Hold */}
            {showMarkOnHoldButton && (
              <Button
                variant='default'
                className='h-8 w-full px-3 text-xs font-medium leading-none sm:h-[38px] sm:w-auto sm:px-4 sm:text-[14px]'
                onClick={handleMarkOnHold}
                disabled={isChangingStatus}
              >
                {isChangingStatus ? t('markingOnHold') : t('markOnHold')}
              </Button>
            )}
            {showMarkCompleteButton && (
              <Button
                variant='default'
                className='h-8 w-full px-3 text-xs font-medium leading-none sm:h-[38px] sm:w-auto sm:px-4 sm:text-[14px]'
                onClick={handleMarkComplete}
                disabled={isChangingStatus}
              >
                {isChangingStatus ? t('markingComplete') : t('markComplete')}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ── Edit Dialog ── */}
      {isEditOpen && campaignData && (
        <CampaignDialog
          mode='edit'
          isCampaignManagerRole={capabilities.hideCampaignManagerField}
          initialData={campaignData}
          onClose={() => setIsEditOpen(false)}
        />
      )}

      {/* ── Delete Dialog ── */}
      <DeleteCampaignDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        campaignName={campaignData?.name ?? '—'}
        onConfirm={() => {
          handleDeleteConfirm();
        }}
      />

      {/* ── Update Status Dialog ── */}
      {campaignData && isStatusOpen && (
        <UpdateCampaignStatusDialog
          open={isStatusOpen}
          onOpenChange={setIsStatusOpen}
          campaign={campaignData}
          onSuccess={() => router.refresh()}
        />
      )}
    </>
  );
}
