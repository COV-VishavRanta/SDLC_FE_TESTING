'use client';
'use no memo';

import { ActionButtonCell, ActionCellContainer, ChangeDetailsDialog, EyeIcon } from '@/components';
import { AuditActorTypeEnum } from '@/constant';
import {
  formatTimestamp,
  getAuditActionLabel,
  getAuditActorType,
  getAuditEntityTypeLabel,
  getRoleLabel,
} from '@/lib/utils';
import { AuditLogType, RoleType } from '@/types/graphql.types';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

function getPrimaryRole(roles?: RoleType[]): RoleType | null {
  return roles?.[0] ?? null;
}

/* ─── Actor Type Badge ─── */
const ACTOR_TYPE_BADGE_STYLES: Record<string, string> = {
  SELF: 'border border-[#528c00] bg-[#f5fae6] text-[#528c00]',
  IMPERSONATED: 'border border-[#312e81] bg-[#eef2ff] text-[#312e81]',
};

export function TypeBadge({ label }: { label: string }) {
  const styles =
    ACTOR_TYPE_BADGE_STYLES[label.toUpperCase()] ??
    'border border-border bg-muted text-muted-foreground';
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ${styles}`}
    >
      {label}
    </span>
  );
}

const ACTOR_TYPE_LABEL_KEYS: Record<AuditActorTypeEnum, string> = {
  [AuditActorTypeEnum.SELF]: 'SELF',
  [AuditActorTypeEnum.IMPERSONATED]: 'IMPERSONATED',
};

export function useAuditLogTableColumns(): ColumnDef<AuditLogType>[] {
  const t = useTranslations('auditLogs.table');
  const tRoles = useTranslations('roles');
  const tActions = useTranslations('auditLogs.actionLabels');
  const tEntityTypes = useTranslations('auditLogs.entityTypeLabels');
  const tActorTypes = useTranslations('auditLogs.actorTypeLabels');

  return [
    {
      accessorKey: 'actorDisplayName',
      header: () => <span className='uppercase'>{t('columns.user')}</span>,
      cell: ({ row }) => (
        <div className='flex flex-col'>
          <span className='text-sm text-text-secondary'>
            {row.original.actorDisplayName ?? '—'}
          </span>
          {row.original.actorEmail && (
            <span className='text-xs text-text-secondary'>({row.original.actorEmail})</span>
          )}
        </div>
      ),
    },
    {
      id: 'role',
      accessorFn: (row) => getPrimaryRole(row.actorRoles)?.name ?? '',
      header: () => <span className='uppercase'>{t('columns.role')}</span>,
      cell: ({ row }) => {
        const name = getPrimaryRole(row.original.actorRoles)?.name;
        return (
          <span className='text-sm text-text-secondary'>
            {name ? getRoleLabel(name, tRoles) : '—'}
          </span>
        );
      },
    },
    {
      accessorKey: 'action',
      header: () => <span className='uppercase'>{t('columns.action')}</span>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>
          {getAuditActionLabel(row.original.action, tActions as (key: string) => string)}
        </span>
      ),
    },
    {
      accessorKey: 'entityName',
      header: () => <span className='uppercase'>{t('columns.entityName')}</span>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>{row.original.entityName ?? '—'}</span>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: () => <span className='uppercase'>{t('columns.timestamp')}</span>,
      cell: ({ row }) => {
        const value = row.original.createdAt;
        if (!value) return <span className='text-sm text-text-secondary'>—</span>;

        return <span className='text-sm text-text-secondary'>{formatTimestamp(value)}</span>;
      },
    },
    {
      id: 'entityType',
      accessorFn: (row) => row.entityType ?? '',
      header: () => <span className='uppercase'>{t('columns.systemArea')}</span>,
      cell: ({ row }) =>
        getAuditEntityTypeLabel(row.original.entityType, tEntityTypes as (key: string) => string),
      enableSorting: false,
    },
    {
      id: 'actorType',
      header: () => <span className='uppercase'>{t('columns.type')}</span>,
      cell: ({ row }) => (
        <TypeBadge
          label={(tActorTypes as unknown as (key: string) => string)(
            ACTOR_TYPE_LABEL_KEYS[getAuditActorType(row.original)],
          )}
        />
      ),
      enableSorting: false,
    },
    {
      id: 'details',
      // Unique "Details" header — avoids duplicate "ACTION" column label (WCAG 2.4.6)
      header: () => <span className='sr-only'>{t('columns.details')}</span>,
      cell: ({ row }) => {
        const entry = row.original;

        if (entry?.isViewable) {
          return (
            <ActionCellContainer className='justify-end'>
              <ChangeDetailsDialog
                entry={entry}
                trigger={
                  <ActionButtonCell
                    icon={<EyeIcon className='size-[18px] text-primary' aria-hidden='true' />}
                    tooltip={t('actions.viewDetails')}
                    className='hover:bg-primary/10'
                  />
                }
              />
            </ActionCellContainer>
          );
        }

        return null;
      },
      enableSorting: false,
    },
  ];
}

/**
 * Static column definitions used by the loading skeleton for column count.
 */
export const auditLogColumns: ColumnDef<AuditLogType>[] = [
  { id: 'actorDisplayName', header: 'User' },
  { id: 'role', header: 'Role' },
  { accessorKey: 'action', header: 'Action' },
  { accessorKey: 'entityName', header: 'Entity Name' },
  { accessorKey: 'createdAt', header: 'Timestamp' },
  { id: 'entityType', header: 'System Area' },
  { id: 'actorType', header: 'Type' },
  { id: 'details', header: '' },
];
