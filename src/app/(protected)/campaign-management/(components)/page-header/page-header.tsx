'use client';

import { Button, CampaignDialog, PageDescription, PageHeader, PageTitle } from '@/components';
import { UserRole } from '@/constant/enums/user.enums';
import { usePermissions } from '@/hooks';
import { useTranslations } from 'next-intl';
import { useContext, useState } from 'react';

import { CampaignManagementContext } from '../../context/CampaignManagementContext';

export default function CampaignPageHeader() {
  const [isCampaignDialogOpen, setIsCampaignDialogOpen] = useState(false);
  const { refetchCampaigns, capabilities } = useContext(CampaignManagementContext);
  const { role } = usePermissions();
  const t = useTranslations('campaignManagement');
  const isPspAdmin = role === UserRole.PSP_ADMIN;
  const toggleCampaignDialog = () => {
    setIsCampaignDialogOpen((prev) => !prev);
  };
  return (
    <div className='flex w-full flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between'>
      <PageHeader>
        <PageTitle className='font-semibold text-text-heading'>
          {isPspAdmin ? t('page.pspAdmin.title') : t('page.title')}
        </PageTitle>
        <PageDescription>
          {isPspAdmin ? t('page.pspAdmin.description') : t('page.description')}
        </PageDescription>
      </PageHeader>

      {capabilities.canCreateCampaign && (
        <Button
          className='h-[45px] gap-2 self-start whitespace-nowrap px-6 sm:self-center'
          onClick={toggleCampaignDialog}
        >
          {t('dialog.create.triggerButton')}
        </Button>
      )}
      {isCampaignDialogOpen && (
        <CampaignDialog
          mode='create'
          isCampaignManagerRole={capabilities.hideCampaignManagerField}
          onClose={toggleCampaignDialog}
          onSubmit={refetchCampaigns}
        />
      )}
    </div>
  );
}
