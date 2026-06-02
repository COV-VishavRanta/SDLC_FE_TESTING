'use client';

import {
  PageResetButton,
  PageSearch,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components';
import { DateRangeEnum, UserRole } from '@/constant';
import { useGlobalProtected } from '@/contexts';
import { getRoleLabel } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { useContext } from 'react';
import { AuditLogContext } from '../../context/AuditLogContext';

const ALL_TIME = '__ALL__';

function useDateRangeOptions(
  t: ReturnType<typeof useTranslations<'auditLogs.filters'>>,
): { label: string; value: DateRangeEnum | typeof ALL_TIME }[] {
  return [
    { label: t('allTime'), value: ALL_TIME },
    { label: t('today'), value: DateRangeEnum.TODAY },
    { label: t('last7Days'), value: DateRangeEnum.LAST_7_DAYS },
    { label: t('last30Days'), value: DateRangeEnum.LAST_30_DAYS },
    { label: t('last90Days'), value: DateRangeEnum.LAST_90_DAYS },
  ];
}

const ALL_ROLES = '__ALL__';

const PARENT_ROLE_MAP: Partial<Record<UserRole, UserRole>> = {
  [UserRole.PSP_ADMIN]: UserRole.PLATFORM_ADMIN,
  [UserRole.BRAND_ADMIN]: UserRole.PSP_ADMIN,
  [UserRole.STORE_ADMIN]: UserRole.BRAND_ADMIN,
};

export default function LogFilters() {
  const t = useTranslations('auditLogs.filters');
  const tRoles = useTranslations('roles');
  const { allRoles, currentUserRole } = useGlobalProtected();

  const allowedRoles = allRoles.filter(
    (role) => role.assignable && role.name !== UserRole.REGIONAL_MANAGER,
  );

  const parentRoleName = PARENT_ROLE_MAP[currentUserRole as UserRole];
  const parentRole = parentRoleName ? allRoles.find((r) => r.name === parentRoleName) : undefined;
  const rolesWithParent =
    parentRole !== undefined && !allowedRoles.some((r) => r.id === parentRole.id)
      ? [...allowedRoles, parentRole]
      : allowedRoles;

  const sortedAllowedRoles = [...rolesWithParent].sort((a, b) => a.name.localeCompare(b.name));
  const {
    selectedRoleId,
    handleRoleChange,
    selectedDateRange,
    handleDateRangeChange,
    search,
    updateSearch,
    clearSearch,
    resetFilters,
  } = useContext(AuditLogContext);

  const dateRangeOptions = useDateRangeOptions(t);

  return (
    <>
      <PageSearch
        placeholder={t('searchPlaceholder')}
        inputClassName='bg-input-bg border-input-border'
        value={search}
        onChange={(e) => updateSearch(e.target.value)}
        onClear={clearSearch}
      />

      <div className='w-full wide:min-w-[150px] wide:w-auto'>
        <Select
          aria-label='Role Filter'
          value={selectedRoleId ?? ALL_ROLES}
          itemToStringLabel={(selectedItem: string) =>
            selectedItem === ALL_ROLES
              ? t('allRoles')
              : getRoleLabel(
                  sortedAllowedRoles.find((item) => item.id === selectedItem)?.name ?? '',
                  tRoles,
                )
          }
          onValueChange={(value) => handleRoleChange(value === ALL_ROLES ? null : value)}
        >
          <SelectTrigger
            aria-label='Role Filter'
            className='h-[40.5px] bg-input-bg text-[13px] font-medium focus-visible:border-[var(--focus-border)] focus-visible:ring-[var(--focus-ring)] focus-visible:ring-3'
          >
            <SelectValue placeholder={t('allRoles')} />
          </SelectTrigger>
          <SelectContent className='rounded-[8px]'>
            <SelectItem value={ALL_ROLES} className='text-[14px] tracking-[-0.1504px]'>
              {t('allRoles')}
            </SelectItem>
            {sortedAllowedRoles.map((role) => (
              <SelectItem
                key={role.id}
                value={role.id}
                className='text-[14px] tracking-[-0.1504px]'
              >
                {getRoleLabel(role.name, tRoles)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Date Range Filter */}
      <div className='w-full wide:min-w-[150px] wide:w-auto'>
        <Select
          aria-label='Date Range Filter'
          value={selectedDateRange ?? ALL_TIME}
          itemToStringLabel={(selectedItem: string) =>
            dateRangeOptions.find((item) => item.value === selectedItem)?.label ?? ''
          }
          onValueChange={(value) =>
            handleDateRangeChange(value === ALL_TIME ? null : (value as DateRangeEnum))
          }
        >
          <SelectTrigger
            aria-label='Date Range Filter'
            className='h-[40.5px] bg-input-bg text-[13px] font-medium focus-visible:border-[var(--focus-border)] focus-visible:ring-[var(--focus-ring)] focus-visible:ring-3'
          >
            <SelectValue placeholder={t('allTime')} />
          </SelectTrigger>
          <SelectContent className='rounded-[8px]'>
            {dateRangeOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className='text-[14px] tracking-[-0.1504px]'
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Reset Filters */}
      <PageResetButton onClick={resetFilters} />
    </>
  );
}
