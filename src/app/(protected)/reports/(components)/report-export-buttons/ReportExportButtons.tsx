'use client';

import { Button } from '@/components';
import { ExportFormat } from '@/constant';
import { EXPORT_STORE_ORDERS_REPORT, type ReportExportPayload } from '@/graphql';
import { useLazyQuery } from '@apollo/client/react';
import { useTranslations } from 'next-intl';
import { useContext, useState } from 'react';

import { ReportsContext } from '../../context/ReportsContext';
import { downloadReportFile } from '../../utils/download-report';

export function ReportExportButtons() {
  const t = useTranslations('reports');
  const { activeConfig, entityId, sorting, totalCount } = useContext(ReportsContext);

  const [exportingFormat, setExportingFormat] = useState<ExportFormat | null>(null);

  // Always pass a valid DocumentNode — the actual query is overridden per-call below
  const [runExport] = useLazyQuery(activeConfig?.exportQuery ?? EXPORT_STORE_ORDERS_REPORT, {
    fetchPolicy: 'no-cache',
  });

  const buildExportVariables = (exportFormat: ExportFormat) => {
    if (!activeConfig) return null;

    const sortFieldId = sorting[0]?.id;
    const sortField = sortFieldId ? activeConfig.sortFieldMap[sortFieldId] : undefined;

    const base: Record<string, unknown> = {
      exportFormat,
      ...(sortField
        ? {
            sort: {
              field: sortField,
              order: sorting[0]?.desc ? 'DESC' : 'ASC',
            },
          }
        : {}),
    };

    if (activeConfig.entityType === 'psp' && entityId) {
      return { ...base, pspId: entityId };
    }
    if (activeConfig.entityType === 'brand' && entityId) {
      return { ...base, brandId: entityId };
    }
    if (activeConfig.entityType === 'none') {
      return base;
    }
    return null;
  };

  const handleExport = async (exportFormat: ExportFormat) => {
    const variables = buildExportVariables(exportFormat);
    if (!variables) return;
    setExportingFormat(exportFormat);
    try {
      const result = await runExport({ variables });
      const exportDataPath = activeConfig?.exportDataPath ?? '';
      const payload = (
        result.data as Record<string, ReportExportPayload | undefined> | undefined
      )?.[exportDataPath];
      if (payload?.fileContent) {
        downloadReportFile(payload);
      }
    } finally {
      setExportingFormat(null);
    }
  };

  const isDisabled = !activeConfig || (activeConfig.entityType !== 'none' && !entityId);
  const isExcelExporting = exportingFormat === ExportFormat.EXCEL;
  const isPdfExporting = exportingFormat === ExportFormat.PDF;

  if (totalCount === 0) return null;

  return (
    <div className='flex items-center gap-2'>
      <Button
        type='button'
        disabled={isDisabled || isPdfExporting || isExcelExporting}
        onClick={() => {
          handleExport(ExportFormat.PDF).catch(() => undefined);
        }}
        aria-label={t('export.toPdf')}
        isLoading={isPdfExporting}
      >
        {isPdfExporting ? t('export.exporting') : t('export.toPdf')}
      </Button>
      <Button
        type='button'
        disabled={isDisabled || isPdfExporting || isExcelExporting}
        onClick={() => {
          handleExport(ExportFormat.EXCEL).catch(() => undefined);
        }}
        aria-label={t('export.toExcel')}
        isLoading={isExcelExporting}
      >
        {isExcelExporting ? t('export.exporting') : t('export.toExcel')}
      </Button>
    </div>
  );
}
