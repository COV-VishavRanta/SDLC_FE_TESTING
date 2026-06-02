'use client';

import {
  ArrowRightIcon,
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
  PSPManagementIcon,
} from '@/components';
import {
  GET_PSP_OVERVIEW_FOR_PLATFORM_ADMIN,
  PspOverviewForPlatformAdminResponse,
} from '@/graphql';
import { cn } from '@/lib/utils';
import { useSuspenseQuery } from '@apollo/client/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

/* ─── Link with arrow ─── */
export function ActionLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center gap-2 text-[16px] font-[var(--font-weight-medium)] text-[var(--primary-700)] hover:underline',
        className,
      )}
    >
      {children}
      <ArrowRightIcon className='size-[18px]' aria-hidden='true' />
    </Link>
  );
}

export default function PspOverviewCard() {
  const t = useTranslations('dashboard.psp-overview');
  /* ─── Fetch PSP overview data from GraphQL ─── */
  const { data } = useSuspenseQuery<PspOverviewForPlatformAdminResponse>(
    GET_PSP_OVERVIEW_FOR_PLATFORM_ADMIN,
  );

  return (
    <Card className='border border-[var(--neutral-300)] bg-[var(--neutral-100)] p-0'>
      <CardHeader className='flex flex-row items-center justify-between border-b border-[var(--neutral-300)] px-[15px] py-[15px] sm:px-6 sm:py-6'>
        <CardTitle className='text-[16px] font-[var(--font-weight-medium)] leading-5 tracking-[-0.15px] text-[var(--neutral-900)]'>
          {t('title')}
        </CardTitle>
        <CardAction>
          <ActionLink href='/psp-management'>{t('link-text')}</ActionLink>
        </CardAction>
      </CardHeader>
      <CardContent className='flex flex-col gap-5 px-[15px] py-[15px] sm:px-6 sm:py-6'>
        {/* Total PSPs row */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <div
              className='flex size-10 items-center justify-center rounded-lg bg-[var(--primary-300)]'
              aria-hidden='true'
            >
              <PSPManagementIcon className='size-5 text-[var(--primary-500)]' />
            </div>
            <div className='flex flex-col leading-5 tracking-[-0.15px]'>
              <span className='text-[14px] font-[var(--font-weight-medium)] text-[var(--neutral-900)]'>
                {t('psp-card.total-psps')}
              </span>
              <span className='text-[12px] font-[var(--font-weight-regular)] text-[var(--neutral-500)]'>
                {t('psp-card.onboarded-text')}
              </span>
            </div>
          </div>
          <span className='text-[24px] sm:text-[32px] font-[var(--font-weight-semibold)] leading-normal text-[var(--neutral-900)]'>
            {data?.pspOverviewForPlatformAdmin?.totalPsps ?? '—'}
          </span>
        </div>

        {/* Active row */}
        <div className='flex items-center justify-between'>
          <span className='text-[14px] font-[var(--font-weight-regular)] leading-5 tracking-[-0.15px] text-[var(--neutral-700)]'>
            {t('psp-card.active-psps')}
          </span>
          <span className='text-[16px] font-[var(--font-weight-semibold)] leading-normal text-[var(--neutral-700)]'>
            {data?.pspOverviewForPlatformAdmin?.activePsps ?? '—'}
          </span>
        </div>

        {/* Inactive row */}
        <div className='flex items-center justify-between'>
          <span className='text-[14px] font-[var(--font-weight-regular)] leading-5 tracking-[-0.15px] text-[var(--neutral-700)]'>
            {t('psp-card.inactive-psps')}
          </span>
          <span className='text-[16px] font-[var(--font-weight-semibold)] leading-normal text-[var(--neutral-700)]'>
            {data?.pspOverviewForPlatformAdmin?.inactivePsps ?? '—'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
