'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components';
import { ReportKey } from '@/constant';
import { useTranslations } from 'next-intl';
import { useContext } from 'react';

import { ReportsContext } from '../../context/ReportsContext';

export function ReportSelector() {
  const t = useTranslations('reports');
  const { availableReports, selectedReportKey, setSelectedReportKey } = useContext(ReportsContext);

  return (
    <div className='flex flex-col gap-1'>
      <label className='text-sm font-medium text-text-primary'>
        {t('selector.label')}{' '}
        <span className='text-red-500' aria-hidden='true'>
          *
        </span>
      </label>
      <Select
        value={selectedReportKey ?? ''}
        onValueChange={(value) => {
          if (value) setSelectedReportKey(value as ReportKey);
        }}
        itemToStringLabel={(selected: string) =>
          availableReports.find((r) => r.key === selected)
            ? t(
                availableReports.find((r) => r.key === selected)!.labelKey as Parameters<
                  typeof t
                >[0],
              )
            : t('selector.placeholder')
        }
        aria-label={t('selector.label')}
      >
        <SelectTrigger
          className='h-[40.5px] min-w-[280px] bg-input-bg'
          aria-required='true'
          aria-label={t('selector.label')}
        >
          <SelectValue placeholder={t('selector.placeholder')} />
        </SelectTrigger>
        <SelectContent>
          {availableReports.map((report) => (
            <SelectItem key={report.key} value={report.key}>
              {t(report.labelKey as Parameters<typeof t>[0])}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
