'use client';

import {
  PageControls,
  PageResetButton,
  PageSearch,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

const ALL_STATUS = 'all';

export default function WebhookFilter() {
  const t = useTranslations('webhooks.filter');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(ALL_STATUS);

  const statusOptions = useMemo(
    () => [
      { value: ALL_STATUS, label: t('status.all') },
      { value: 'true', label: t('status.active') },
      { value: 'false', label: t('status.inactive') },
    ],
    [t],
  );

  return (
    <PageControls>
      <PageSearch
        className='w-full'
        placeholder={t('searchPlaceholder')}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onClear={() => setSearch('')}
      />

      <div className='w-full wide:min-w-[150px] wide:w-auto'>
        <Select
          aria-label={t('statusAriaLabel')}
          value={status}
          onValueChange={(value) => setStatus(value ?? ALL_STATUS)}
          itemToStringLabel={(selectedItem: string) =>
            statusOptions.find((item) => item.value === selectedItem)?.label ?? ''
          }
        >
          <SelectTrigger aria-label={t('statusAriaLabel')}>
            <SelectValue placeholder={t('status.all')} />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false}>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <PageResetButton
        onClick={() => {
          setSearch('');
          setStatus(ALL_STATUS);
        }}
      />
    </PageControls>
  );
}
