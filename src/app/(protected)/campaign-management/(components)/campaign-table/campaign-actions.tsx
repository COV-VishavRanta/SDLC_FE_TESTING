'use client';

import {
  ActionButtonCell,
  ActionCellContainer,
  ArchiveIcon,
  Button,
  CampaignDialog,
  EditIcon,
  TrashIcon,
  UnarchiveIcon,
  UpdateCampaignStatusDialog,
  UserIcon,
} from '@/components';
import {
  ARCHIVABLE_CAMPAIGN_STATUSES,
  CampaignStatusEnum,
  DELETABLE_CAMPAIGN_STATUSES,
  EDITABLE_CAMPAIGN_STATUSES,
  SHOW_EDIT_STATUS_BUTTON_STATUSES,
} from '@/constant';
import { useGlobalProtected } from '@/contexts';
import {
  ASSIGN_CAMPAIGN_MANAGER,
  type AssignCampaignManagerResponse,
  type AssignCampaignManagerVariables,
  LIST_CAMPAIGNS,
} from '@/graphql';
import { CampaignType } from '@/types';
import { useMutation } from '@apollo/client/react';
import { useTranslations } from 'next-intl';
import { useContext, useState } from 'react';
import { toast } from 'sonner';

import { CampaignManagementContext } from '../../context/CampaignManagementContext';
import { ArchiveCampaignDialog } from '../campaign-dialogs/archive-campaign-dialog';
import { DeleteCampaignDialog } from '../campaign-dialogs/delete-campaign-dialog';
import { UnarchiveCampaignDialog } from '../campaign-dialogs/unarchive-campaign-dialog';

interface CampaignActionsProps {
  campaign: CampaignType;
}

export function CampaignActions({ campaign }: CampaignActionsProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [unarchiveDialogOpen, setUnarchiveDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const { handleDeleteCampaign, handleArchiveCampaign, refetchCampaigns, capabilities } =
    useContext(CampaignManagementContext);
  const { currentUserData } = useGlobalProtected();
  const t = useTranslations('campaignManagement.actions');
  const tMessages = useTranslations('campaignManagement.messages');

  const [assignCampaignManager, { loading: isAssigning }] = useMutation<
    AssignCampaignManagerResponse,
    AssignCampaignManagerVariables
  >(ASSIGN_CAMPAIGN_MANAGER, {
    refetchQueries: [LIST_CAMPAIGNS],
  });

  const currentUserId = currentUserData?.me?.id;

  const canUpdateStatus =
    capabilities.canEditStatus && SHOW_EDIT_STATUS_BUTTON_STATUSES.has(campaign.status);

  const canEdit =
    capabilities.canEditCampaign &&
    EDITABLE_CAMPAIGN_STATUSES.has(campaign.status) &&
    (!capabilities.canEditOwnCampaignsOnly ||
      ((campaign.status === CampaignStatusEnum.DRAFT ||
        campaign.status === CampaignStatusEnum.ON_HOLD) &&
        campaign.campaignManagerId === currentUserId));

  const canAssignToSelf =
    capabilities.canAssignSelfToCampaign &&
    !campaign.campaignManagerId &&
    EDITABLE_CAMPAIGN_STATUSES.has(campaign.status);

  const canDelete =
    capabilities.canDeleteCampaign &&
    DELETABLE_CAMPAIGN_STATUSES.has(campaign.status) &&
    (!capabilities.canEditOwnCampaignsOnly || campaign.campaignManagerId === currentUserId);

  const canArchive =
    capabilities.canArchiveCampaign &&
    ARCHIVABLE_CAMPAIGN_STATUSES.has(campaign.status) &&
    !campaign.isArchived;

  const canUnarchive = capabilities.canArchiveCampaign && campaign.isArchived;

  return (
    <ActionCellContainer className='justify-end'>
      {/* Change Status  */}
      {canUpdateStatus && (
        <>
          <Button
            variant='ghost'
            size='sm'
            className='self-center border border-solid border-[#005C8A] rounded-[6px] px-3 py-2 sm:py-2 h-auto bg-gradient-to-b from-[#005C8A] to-[#0077B3] bg-clip-text text-transparent text-xs font-medium leading-normal'
            onClick={() => setStatusDialogOpen(true)}
          >
            {t('updateStatus')}
          </Button>

          {statusDialogOpen && (
            <UpdateCampaignStatusDialog
              open={statusDialogOpen}
              onOpenChange={setStatusDialogOpen}
              campaign={campaign}
              onSuccess={refetchCampaigns}
            />
          )}
        </>
      )}

      {/* Edit  */}
      {canEdit && (
        <>
          <ActionButtonCell
            icon={<EditIcon className='size-[18px] text-primary' aria-hidden='true' />}
            tooltip={t('editCampaign')}
            onClick={() => setEditDialogOpen(true)}
            className='hover:bg-stat-icon-blue'
          />

          {editDialogOpen && (
            <CampaignDialog
              mode='edit'
              initialData={campaign}
              isCampaignManagerRole={capabilities.hideCampaignManagerField}
              onClose={() => setEditDialogOpen(false)}
              onSubmit={refetchCampaigns}
            />
          )}
        </>
      )}

      {/* Assign to Self */}
      {canAssignToSelf && (
        <ActionButtonCell
          icon={<UserIcon className='size-[18px] text-primary' aria-hidden='true' />}
          tooltip={t('assignToSelf')}
          onClick={async () => {
            await assignCampaignManager({
              variables: { input: { id: campaign.id } },
              onCompleted: () => {
                refetchCampaigns();
                toast.success(tMessages('success.assigned'));
              },
            });
          }}
          disabled={isAssigning}
          className='hover:bg-stat-icon-blue'
        />
      )}

      {/* Delete  */}
      {canDelete && (
        <>
          <ActionButtonCell
            icon={<TrashIcon className='size-[18px] text-error' aria-hidden='true' />}
            tooltip={t('deleteCampaign')}
            onClick={() => setDeleteDialogOpen(true)}
            className='hover:bg-red-50'
          />

          <DeleteCampaignDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            campaignName={campaign.name}
            onConfirm={() => handleDeleteCampaign(campaign.id)}
          />
        </>
      )}

      {/* Archive  */}
      {canArchive && (
        <>
          <ActionButtonCell
            icon={<ArchiveIcon className='size-[18px] text-icon-red' aria-hidden='true' />}
            tooltip={t('archiveCampaign')}
            onClick={() => setArchiveDialogOpen(true)}
            className='hover:bg-red-50'
          />

          <ArchiveCampaignDialog
            open={archiveDialogOpen}
            onOpenChange={setArchiveDialogOpen}
            campaignName={campaign.name}
            onConfirm={() => handleArchiveCampaign(campaign.id, true)}
          />
        </>
      )}

      {/* Unarchive  */}
      {canUnarchive && (
        <>
          <ActionButtonCell
            icon={<UnarchiveIcon className='size-[28px] text-primary' aria-hidden='true' />}
            tooltip={t('unarchiveCampaign')}
            onClick={() => setUnarchiveDialogOpen(true)}
            className='hover:bg-stat-icon-blue'
          />

          <UnarchiveCampaignDialog
            open={unarchiveDialogOpen}
            onOpenChange={setUnarchiveDialogOpen}
            campaignName={campaign.name}
            onConfirm={() => handleArchiveCampaign(campaign.id, false)}
          />
        </>
      )}
    </ActionCellContainer>
  );
}
