'use client';

import { DEFAULT_PAGE_SIZE, INITIAL_PAGE_INDEX, ReportKey, UserRole } from '@/constant';
import { useGlobalProtected } from '@/contexts';
import { PaginationState, SortingState } from '@tanstack/react-table';
import { useMemo, useState, useTransition } from 'react';

import { getAvailableReports } from '../config/report-registry';

export default function useReportsContext() {
  const { selectedPspId, selectedBrandId, currentUserRole: rawRole } = useGlobalProtected();

  const currentUserRole = rawRole as UserRole;

  const availableReports = useMemo(() => getAvailableReports(currentUserRole), [currentUserRole]);

  /* ── Start with no selection so the placeholder is shown first ── */
  const [selectedReportKey, setSelectedReportKeyState] = useState<ReportKey | null>(null);
  const [isPending, startTransition] = useTransition();

  const activeConfig = useMemo(
    () => availableReports.find((r) => r.key === selectedReportKey) ?? null,
    [availableReports, selectedReportKey],
  );

  /* ── Sorting & pagination reset to config defaults on report change ── */
  const [sorting, setSortingState] = useState<SortingState>(() =>
    activeConfig ? [activeConfig.defaultSort] : [],
  );
  const [pagination, setPaginationState] = useState<PaginationState>({
    pageIndex: INITIAL_PAGE_INDEX,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [totalCount, setTotalCount] = useState(0);

  const setSelectedReportKey = (key: ReportKey) => {
    const config = availableReports.find((r) => r.key === key);
    setSelectedReportKeyState(key);
    if (config) {
      setSortingState([config.defaultSort]);
    }
    setPaginationState({ pageIndex: INITIAL_PAGE_INDEX, pageSize: DEFAULT_PAGE_SIZE });
    setTotalCount(0);
  };

  const setSorting = (updater: SortingState | ((prev: SortingState) => SortingState)) => {
    startTransition(() => {
      setSortingState(updater);
      setPaginationState((prev) => ({ ...prev, pageIndex: INITIAL_PAGE_INDEX }));
    });
  };

  const setPagination = (
    updater: PaginationState | ((prev: PaginationState) => PaginationState),
  ) => {
    startTransition(() => {
      setPaginationState(updater);
    });
  };

  /* ── Derive entity ID from active activeConfig's entity type ── */
  const entityId = useMemo(() => {
    if (!activeConfig) return undefined;
    if (activeConfig.entityType === 'psp') return selectedPspId ?? undefined;
    if (activeConfig.entityType === 'brand') return selectedBrandId ?? undefined;
    return undefined;
  }, [activeConfig, selectedPspId, selectedBrandId]);

  return {
    availableReports,
    selectedReportKey,
    setSelectedReportKey,
    activeConfig,
    sorting,
    setSorting,
    pagination,
    setPagination,
    entityId,
    isPending,
    totalCount,
    setTotalCount,
  };
}
