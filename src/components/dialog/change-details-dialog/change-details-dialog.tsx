'use client';

import {
  Button,
  ClockIcon,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  UserIcon,
} from '@/components';
import { formatTimestamp, getAuditActionLabel } from '@/lib/utils';
import { AuditLogType, NotificationAuditLogType } from '@/types/graphql.types';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

import { ChangeValueBox } from './helper';

interface ChangeDetailsDialogProps {
  entry: AuditLogType | NotificationAuditLogType;
  trigger: React.ReactNode;
}

export default function ChangeDetailsDialog({ entry, trigger }: ChangeDetailsDialogProps) {
  const t = useTranslations('auditLogs.changeDetails');
  const [open, setOpen] = useState(false);
  const primaryRole = (entry as AuditLogType)?.actorRoles?.[0];
  const tActions = useTranslations('auditLogs.actionLabels');

  // Clone trigger with onClick so the button itself handles opening —
  // avoids wrapping in a <div onClick> which breaks keyboard activation (WCAG 2.1.1)
  const triggerWithHandler = React.isValidElement(trigger)
    ? React.cloneElement(trigger as React.ReactElement<{ onClick?: () => void }>, {
        onClick: () => setOpen(true),
      })
    : trigger;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {triggerWithHandler}
      <DialogContent className='max-w-[580px] p-0 gap-0' showCloseButton={false}>
        {/* Header */}
        <DialogHeader className='flex h-auto flex-row items-center justify-between sm:h-[104px]'>
          <div className='flex h-[55px] flex-col gap-1'>
            <DialogTitle className='text-[20px] font-semibold leading-[30px] text-text-heading'>
              {t('title')}
            </DialogTitle>
            <DialogDescription className='text-sm leading-[21px] text-text-secondary'>
              {t('description')}
            </DialogDescription>
          </div>
          <DialogClose />
        </DialogHeader>

        {/* Content */}
        <div className='max-h-[70vh] space-y-6 overflow-y-auto px-5 py-5 sm:px-8 sm:py-6'>
          {/* Entry Summary Card */}
          <div className='space-y-3 rounded-lg border border-border bg-muted p-[21px] pb-3'>
            <div className='flex flex-wrap items-center gap-3'>
              <h3 className='text-base font-semibold leading-6 text-text-heading'>
                {getAuditActionLabel(entry?.action, tActions as (key: string) => string)}
              </h3>
              {primaryRole && (
                <div className='rounded-full border border-badge-psp-admin-border bg-badge-psp-admin-bg px-2.5 py-1 text-[11px] font-medium leading-[16.5px] text-badge-psp-admin-text'>
                  {primaryRole.name}
                </div>
              )}
            </div>

            <p className='text-sm leading-[21px] text-text-secondary'>
              {t('changeDetailsFor', { entityId: entry?.entityName ?? '—' })}
            </p>

            <div className='flex flex-wrap items-center gap-4'>
              {(entry as AuditLogType)?.actorDisplayName && (
                <div className='flex items-center gap-1.5 text-text-secondary'>
                  <UserIcon />
                  <span className='text-xs leading-[18px]'>
                    {(entry as AuditLogType)?.actorDisplayName}
                  </span>
                </div>
              )}
              <div className='flex items-center gap-1.5 text-text-secondary'>
                <ClockIcon />
                <span className='text-xs leading-[18px]'>{formatTimestamp(entry.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Previous Value */}
          <ChangeValueBox
            label={t('previousValue')}
            rawValue={entry.oldValue}
            colorClass='previous'
            arrowRenderer={
              <div className='flex items-center justify-center'>
                <div className='flex size-10 items-center justify-center rounded-full bg-audit-icon-bg-blue'>
                  <span className='text-[20px] leading-[30px] tracking-[-0.45px] text-primary'>
                    ↓
                  </span>
                </div>
              </div>
            }
          />

          {/* Updated Value */}
          <ChangeValueBox
            label={t('updatedValue')}
            rawValue={entry.newValue}
            colorClass='updated'
          />

          {/* Close Button */}
          <DialogClose
            render={
              <Button className='h-[47px] w-full bg-gradient-to-b font-medium sm:text-[16px]'>
                {t('closeButton')}
              </Button>
            }
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
