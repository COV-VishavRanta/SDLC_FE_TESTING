'use client';
'use no memo';

import { Badge, type BadgeVariant } from '@/components/ui/badge';
import { CreatedDateCell, SortableHeader } from '@/components';
import { UserStatusEnum } from '@/constant';
import { getInitials, getRoleLabel } from '@/lib/utils';
import { UserType } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

import ActionCell from './action-cell';

const STATUS_VARIANT_MAP: Record<UserStatusEnum, BadgeVariant> = {
  [UserStatusEnum.ACTIVE]: 'active',
  [UserStatusEnum.INACTIVE]: 'inactive',
  [UserStatusEnum.PENDING]: 'pending',
};

const STATUS_TRANSLATION_KEY_MAP: Record<UserStatusEnum, 'active' | 'inactive' | 'pending'> = {
  [UserStatusEnum.ACTIVE]: 'active',
  [UserStatusEnum.INACTIVE]: 'inactive',
  [UserStatusEnum.PENDING]: 'pending',
};

function StatusBadge({ status }: { status: UserStatusEnum }) {
  const t = useTranslations('userManagement.table.statusBadge');
  return (
    <Badge variant={STATUS_VARIANT_MAP[status]}>{t(STATUS_TRANSLATION_KEY_MAP[status])}</Badge>
  );
}

function UserAvatar({ initials, name }: { initials: string; name?: string }) {
  return (
    // role="img" + aria-label exposes the avatar as a labelled graphic (WCAG 1.1.1)
    <div
      role='img'
      aria-label={name ? `${name} avatar` : 'User avatar'}
      className='flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#005C8A] to-[#0077B3]'
    >
      <span className='text-sm font-medium text-white' aria-hidden='true'>
        {initials}
      </span>
    </div>
  );
}

export function useUserTableColumns(): ColumnDef<UserType>[] {
  const t = useTranslations('userManagement.table.columns');
  const tRoles = useTranslations('roles');

  return [
    {
      accessorKey: 'name',
      header: ({ column }) => <SortableHeader column={column}>{t('user')}</SortableHeader>,
      cell: ({ row }) => {
        const user = row.original;
        const initials = getInitials(user?.name ?? '');
        return (
          <div className='flex items-center gap-3'>
            <UserAvatar initials={initials} name={user?.name} />
            <span className='text-sm text-text-secondary'>{user.name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'email',
      header: ({ column }) => <SortableHeader column={column}>{t('email')}</SortableHeader>,
      cell: ({ row }) => (
        <span className='text-sm text-text-secondary'>{row.getValue('email')}</span>
      ),
    },
    {
      id: 'roles',
      accessorFn: (row) => row?.roles?.map((r) => r.name).join(', '),
      header: ({ column }) => <SortableHeader column={column}>{t('userRole')}</SortableHeader>,
      cell: ({ row }) => {
        const roleNames: string = row?.getValue('roles') ?? '';
        const translated = roleNames
          .split(', ')
          .filter(Boolean)
          .map((name) => getRoleLabel(name, tRoles))
          .join(', ');
        return <span className='text-sm text-text-secondary'>{translated || '—'}</span>;
      },
    },
    {
      id: 'status',
      accessorFn: (row) => row.status,
      header: () => <span className='uppercase'>{t('status')}</span>,
      cell: ({ row }) => <StatusBadge status={row.getValue('status')} />,
      enableSorting: false,
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => <SortableHeader column={column}>{t('created')}</SortableHeader>,
      cell: ({ row }) => <CreatedDateCell value={row.getValue<string | Date>('createdAt')} />,
    },
    {
      id: 'actions',
      header: () => <span className='flex w-full justify-end uppercase'>{t('actions')}</span>,
      cell: ActionCell,
    },
  ];
}

/**
 * Static column definitions (used by UserTableLoading for skeleton column count).
 * Column headers here are intentionally untranslated placeholders.
 */
export const columns: ColumnDef<UserType>[] = [
  { accessorKey: 'name', header: 'User' },
  { accessorKey: 'email', header: 'Email' },
  { id: 'roles', header: 'User Roles' },
  { id: 'status', header: 'Status' },
  { accessorKey: 'createdAt', header: 'Created' },
  { id: 'actions', header: 'Actions' },
];
