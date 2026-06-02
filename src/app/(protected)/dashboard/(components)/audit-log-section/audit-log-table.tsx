'use client';

import { TypeBadge } from '@/app/(protected)/audit-logs/(components)/log-listing/log-table-columns';
import {
  ActionButtonCell,
  ActionCellContainer,
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
  ChangeDetailsDialog,
  EyeIcon,
  SortableHeader,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components';
import { AuditActorTypeEnum, ProtectedRoute } from '@/constant';
import {
  formatTimestamp,
  getAuditActionLabel,
  getAuditActorType,
  getAuditEntityTypeLabel,
  getRoleLabel,
} from '@/lib/utils';
import { AuditLogType } from '@/types/graphql.types';
import { useSuspenseQuery } from '@apollo/client/react';
import { useTranslations } from 'next-intl';

import { GET_AUDIT_LOGS, GetAuditLogsResponse } from '@/graphql';
import { ActionLink } from '../../(platform-users-dashboard)/(components)/psp-overview-section/psp-overview-card';

const DASHBOARD_PAGE_SIZE = 10;

const COLUMN_COUNT = 8;

const ACTOR_TYPE_LABEL_KEYS: Record<AuditActorTypeEnum, string> = {
  [AuditActorTypeEnum.SELF]: 'SELF',
  [AuditActorTypeEnum.IMPERSONATED]: 'IMPERSONATED',
};

/* ─── Mobile Audit Log Card ─── */
function AuditLogMobileCard({ log }: { log: AuditLogType }) {
  const tRoles = useTranslations('roles');
  const tActions = useTranslations('auditLogs.actionLabels');
  const tEntityTypes = useTranslations('auditLogs.entityTypeLabels');
  const tAuditLogsTable = useTranslations('auditLogs.table');
  const primaryRoleName = log.actorRoles?.[0]?.name;

  return (
    <div className='flex w-full flex-col gap-2 rounded-[10px] border border-[var(--neutral-200)] bg-[var(--neutral-100)] p-3 shadow-[0px_1px_3px_0px_var(--neutral-300),0px_1px_2px_0px_var(--neutral-200)]'>
      {/* User info row */}
      <div className='flex items-start justify-between'>
        <div className='flex flex-col gap-1'>
          <p className='text-[14px] font-[var(--font-weight-regular)] leading-5 tracking-[-0.15px] text-[var(--neutral-700)]'>
            {log.actorDisplayName ?? '—'}
          </p>
          <div className=''>
            <p className='text-[12px] font-[var(--font-weight-regular)] leading-5 tracking-[-0.15px] text-[var(--neutral-600)]'>
              {primaryRoleName ? getRoleLabel(primaryRoleName, tRoles) : '—'}
            </p>

            <p className='text-[12px] font-[var(--font-weight-regular)] leading-5 tracking-[-0.15px] text-[var(--neutral-600)]'></p>
          </div>
        </div>
        {log?.isViewable ? (
          <ActionCellContainer className='justify-end'>
            <ChangeDetailsDialog
              entry={log}
              trigger={
                <ActionButtonCell
                  icon={<EyeIcon className='size-[18px] text-primary' aria-hidden='true' />}
                  tooltip={tAuditLogsTable('actions.viewDetails')}
                  className='hover:bg-primary/10'
                />
              }
            />
          </ActionCellContainer>
        ) : null}
      </div>

      {/* Action */}
      <p className='text-[14px] font-[var(--font-weight-medium)] leading-5 tracking-[-0.15px] text-[var(--neutral-800)]'>
        {getAuditActionLabel(log.action, tActions as (key: string) => string)}
      </p>

      {/* Timestamp + Badge row */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2 text-[12px] font-[var(--font-weight-regular)] leading-5 tracking-[-0.15px] text-[var(--neutral-700)]'>
          <span>{log.actorDisplayName?.split(' ')[0] ?? '—'}</span>
          <span className='text-[var(--neutral-500)]'>•</span>
          <span>{formatTimestamp(log.createdAt)}</span>
        </div>
        <div className=' flex gap-3 align-baseline'>
          <span className='text-[12px]'>
            {getAuditEntityTypeLabel(log.entityType, tEntityTypes as (key: string) => string)}
          </span>
          <TypeBadge label={ACTOR_TYPE_LABEL_KEYS[getAuditActorType(log)]} />
        </div>
      </div>
    </div>
  );
}

/* ─── Desktop Audit Log Row ─── */
function AuditLogRow({ log }: { log: AuditLogType }) {
  const tRoles = useTranslations('roles');
  const tActions = useTranslations('auditLogs.actionLabels');
  const tEntityTypes = useTranslations('auditLogs.entityTypeLabels');
  const tActorTypes = useTranslations('auditLogs.actorTypeLabels');
  const tAuditLogsTable = useTranslations('auditLogs.table');
  const primaryRoleName = log.actorRoles?.[0]?.name;

  return (
    <TableRow>
      <TableCell>{log.actorDisplayName ?? '—'}</TableCell>
      <TableCell>{primaryRoleName ? getRoleLabel(primaryRoleName, tRoles) : '—'}</TableCell>
      <TableCell>{getAuditActionLabel(log.action, tActions as (key: string) => string)}</TableCell>
      <TableCell>{log.entityName ?? '—'}</TableCell>
      <TableCell>{formatTimestamp(log.createdAt)}</TableCell>
      <TableCell>
        {getAuditEntityTypeLabel(log.entityType, tEntityTypes as (key: string) => string)}
      </TableCell>
      <TableCell>
        <TypeBadge
          label={(tActorTypes as unknown as (key: string) => string)(
            ACTOR_TYPE_LABEL_KEYS[getAuditActorType(log)],
          )}
        />
      </TableCell>
      <TableCell>
        {log?.isViewable ? (
          <ActionCellContainer className='justify-end'>
            <ChangeDetailsDialog
              entry={log}
              trigger={
                <ActionButtonCell
                  icon={<EyeIcon className='size-[18px] text-primary' aria-hidden='true' />}
                  tooltip={tAuditLogsTable('actions.viewDetails')}
                  className='hover:bg-primary/10'
                />
              }
            />
          </ActionCellContainer>
        ) : null}
      </TableCell>
    </TableRow>
  );
}

export default function AuditLogTable() {
  const t = useTranslations('dashboard.audit-logs');

  const { data } = useSuspenseQuery<GetAuditLogsResponse>(GET_AUDIT_LOGS, {
    variables: { page: 1, pageSize: DASHBOARD_PAGE_SIZE },
  });

  const logs = data?.auditLogs?.logs ?? [];

  return (
    <Card className='overflow-clip rounded-xl border border-border p-0'>
      <CardHeader className='flex flex-row items-start justify-between border-b border-[var(--neutral-300)] px-[15px] py-[15px] sm:px-6 sm:py-5 sm:items-center'>
        <CardTitle className='text-[16px] font-[var(--font-weight-medium)] leading-5 text-[var(--neutral-900)] sm:font-[var(--font-weight-semibold)] sm:leading-6'>
          {t('title')}
        </CardTitle>
        <CardAction>
          <ActionLink href={ProtectedRoute.AUDIT_LOGS}>{t('link-text')}</ActionLink>
        </CardAction>
      </CardHeader>

      {/* ── Desktop Table (hidden on small screens) ── */}
      <CardContent className='hidden p-0 px-6 pb-6 pt-6 sm:block'>
        <div className='overflow-hidden rounded-lg border border-border'>
          <Table>
            <TableCaption>{t('table-caption')}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <SortableHeader>{t('table.tableHeader.user')}</SortableHeader>
                </TableHead>
                <TableHead>
                  <SortableHeader>{t('table.tableHeader.role')}</SortableHeader>
                </TableHead>
                <TableHead>
                  <SortableHeader>{t('table.tableHeader.action')}</SortableHeader>
                </TableHead>
                <TableHead>
                  <SortableHeader>{t('table.tableHeader.entityName')}</SortableHeader>
                </TableHead>
                <TableHead>
                  <SortableHeader>{t('table.tableHeader.timestamp')}</SortableHeader>
                </TableHead>
                <TableHead>{t('table.tableHeader.systemArea')}</TableHead>
                <TableHead>{t('table.tableHeader.type')}</TableHead>
                <TableHead>
                  <span className='sr-only'>{t('table.tableHeader.details')}</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={COLUMN_COUNT}
                    className='py-10 text-center text-sm text-[var(--neutral-600)]'
                  >
                    {t('empty-state')}
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => <AuditLogRow key={log.id} log={log} />)
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* ── Mobile Card Layout (visible on small screens only) ── */}
      <CardContent className='flex flex-col gap-2.5 p-[15px] sm:hidden'>
        {logs.length === 0 ? (
          <p className='py-10 text-center text-sm text-[var(--neutral-600)]'>{t('empty-state')}</p>
        ) : (
          logs.map((log) => <AuditLogMobileCard key={log.id} log={log} />)
        )}
      </CardContent>
    </Card>
  );
}
