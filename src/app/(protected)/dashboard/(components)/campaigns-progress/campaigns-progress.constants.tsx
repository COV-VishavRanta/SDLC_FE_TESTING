import {
  CampaignAcknowledgedIcon,
  CampaignInProductionIcon,
  CampaignInReviewIcon,
  CampaignNewIcon,
  CampaignOnHoldIcon,
  CampaignPartiallyReceivedIcon,
  CampaignPartiallyShippedIcon,
  CampaignReceivedIcon,
  CampaignShippedIcon,
  CheckCircleIcon,
  FileTextIcon,
} from '@/components';
import { CampaignStatusEnum } from '@/constant';
import type { ReactNode } from 'react';

/* ─── Icon & background per status ─── */
export const STATUS_ICON_MAP: Record<CampaignStatusEnum, { icon: ReactNode; bg: string }> = {
  [CampaignStatusEnum.DRAFT]: {
    icon: <FileTextIcon className='size-4 text-[var(--neutral-500)]' />,
    bg: 'bg-[var(--badge-inactive-bg)]',
  },

  [CampaignStatusEnum.NEW]: {
    icon: <CampaignNewIcon className='size-4 text-[#005C8A]' />,
    bg: 'bg-[var(--badge-pending-bg)]',
  },

  [CampaignStatusEnum.ACCEPTED]: {
    icon: <CampaignAcknowledgedIcon className='size-4 text-[#FAB95B]' />,
    bg: 'bg-[#fff9e5]',
  },

  [CampaignStatusEnum.IN_REVIEW]: {
    icon: <CampaignInReviewIcon className='size-4 text-[#8B5CF6]' />,
    bg: 'bg-[var(--badge-purple-bg)]',
  },

  [CampaignStatusEnum.ON_HOLD]: {
    icon: <CampaignOnHoldIcon className='size-4 text-[#005C8A]' />,
    bg: 'bg-[var(--badge-pending-bg)]',
  },

  [CampaignStatusEnum.IN_PRODUCTION]: {
    icon: <CampaignInProductionIcon className='size-4 text-[#FAB95B]' />,
    bg: 'bg-[#fff9e5]',
  },

  [CampaignStatusEnum.PARTIALLY_SHIPPED]: {
    icon: <CampaignPartiallyShippedIcon className='size-4 text-[var(--badge-info-text)]' />,
    bg: 'bg-[var(--badge-info-bg)]',
  },

  [CampaignStatusEnum.SHIPPED]: {
    icon: <CampaignShippedIcon className='size-4 text-[var(--badge-active-text)]' />,
    bg: 'bg-[var(--badge-active-bg)]',
  },

  [CampaignStatusEnum.PARTIALLY_RECEIVED]: {
    icon: <CampaignPartiallyReceivedIcon className='size-4 text-[#5a6570]' />,
    bg: 'bg-[#eef2f5]',
  },

  [CampaignStatusEnum.RECEIVED]: {
    icon: <CampaignReceivedIcon className='size-4 text-[#10b981]' />,
    bg: 'bg-[#f0fdf4]',
  },

  [CampaignStatusEnum.COMPLETED]: {
    icon: <CheckCircleIcon className='size-4 text-[var(--badge-active-text)]' />,
    bg: 'bg-[var(--badge-active-bg)]',
  },
};
