'use client';

import {
  DEFAULT_PAGE_SIZE,
  INITIAL_PAGE_INDEX,
  SEARCH_DEBOUNCE_MS,
  SortOrder,
  SurveySortField,
  SurveyStatusEnum,
  SurveyTemplateSortField,
} from '@/constant';
import { useGlobalProtected } from '@/contexts';
import {
  DELETE_SURVEY,
  DELETE_SURVEY_TEMPLATE,
  DeleteSurveyTemplateResponse,
  DeleteSurveyTemplateVariables,
  GET_BRANDS,
  GET_SURVEY_TEMPLATES,
  GET_SURVEYS,
  GET_SURVEYS_STAT_CARDS,
  GetBrandsResponse,
  GetBrandsVariables,
  ListSurveysData,
  ListSurveysVars,
  ListSurveyTemplatesData,
  ListSurveyTemplatesVars,
} from '@/graphql';
import { useCapabilities } from '@/hooks';
import {
  DEFAULT_SURVEY_CAPABILITIES,
  SURVEY_CAPABILITIES_MAP,
} from '@/lib/permissions/route.permissions';
import { SurveyListItemType, SurveyTemplateType } from '@/types';
import { skipToken, useMutation, useQuery } from '@apollo/client/react';
import { PaginationState, SortingState } from '@tanstack/react-table';
import { useDebounce } from '@uidotdev/usehooks';
import { useQueryState } from 'nuqs';
import { useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { toast } from 'sonner';

export const ALL_STATUSES = 'all' as const;
export const ALL_BRANDS = 'all' as const;

/* ── Column ID → GraphQL sort field mapping ── */
const TEMPLATE_COLUMN_SORT_MAP: Record<string, SurveyTemplateSortField> = {
  name: SurveyTemplateSortField.NAME,
  createdAt: SurveyTemplateSortField.CREATED_AT,
};

const SURVEY_COLUMN_SORT_MAP: Record<string, SurveySortField> = {
  name: SurveySortField.NAME,
  createdAt: SurveySortField.CREATED_AT,
  status: SurveySortField.STATUS,
};

const BRANDS_PAGE_SIZE = 200;

interface FilterState {
  search: string;
  status: SurveyStatusEnum | typeof ALL_STATUSES;
  brandId: string | undefined;
}

const INITIAL_FILTER: FilterState = {
  search: '',
  status: ALL_STATUSES,
  brandId: undefined,
};

export default function useSurveyManagementContext() {
  const { selectedPspId } = useGlobalProtected();
  const caps = useCapabilities(SURVEY_CAPABILITIES_MAP, DEFAULT_SURVEY_CAPABILITIES);

  const [activeTab, setActiveTab] = useQueryState('tab', {
    defaultValue: 'templates',
    clearOnDefault: true,
  });
  const [showCreateSurveyDialog, setShowCreateSurveyDialog] = useState(false);

  /* ── Template table state ── */
  const [templateSorting, setTemplateSorting] = useState<SortingState>([
    { id: 'name', desc: false },
  ]);
  const [templatePagination, setTemplatePagination] = useState<PaginationState>({
    pageIndex: INITIAL_PAGE_INDEX,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [templateSearch, setTemplateSearch] = useState('');
  const [templateActiveSearch, setTemplateActiveSearch] = useState('');
  const skipTemplateDebounceRef = useRef(false);

  const [isTemplatePending, startTemplateTransition] = useTransition();

  const debouncedTemplateSearch = useDebounce(templateSearch, SEARCH_DEBOUNCE_MS);

  /* ── Survey table state ── */
  const [surveySorting, setSurveySorting] = useState<SortingState>([{ id: 'name', desc: false }]);
  const [surveyPagination, setSurveyPagination] = useState<PaginationState>({
    pageIndex: INITIAL_PAGE_INDEX,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [surveySearch, setSurveySearch] = useState('');
  const [surveyActiveSearch, setSurveyActiveSearch] = useState('');
  const skipSurveyDebounceRef = useRef(false);
  const [filterState, setFilterState] = useState<FilterState>(INITIAL_FILTER);
  const [surveyToDelete, setSurveyToDelete] = useState<SurveyListItemType | null>(null);

  const [isSurveyPending, startSurveyTransition] = useTransition();

  const debouncedSurveySearch = useDebounce(surveySearch, SEARCH_DEBOUNCE_MS);

  /* ── Derive GraphQL variables for template query ── */
  const templateVariables = useMemo((): ListSurveyTemplatesVars | null => {
    if (!selectedPspId) return null;

    const sortField =
      templateSorting.length > 0
        ? (TEMPLATE_COLUMN_SORT_MAP[templateSorting[0].id] ?? SurveyTemplateSortField.NAME)
        : SurveyTemplateSortField.NAME;

    const sortOrder =
      templateSorting.length > 0
        ? templateSorting[0].desc
          ? SortOrder.DESC
          : SortOrder.ASC
        : SortOrder.ASC;

    return {
      pspId: selectedPspId,
      page: templatePagination.pageIndex + 1,
      pageSize: templatePagination.pageSize,
      search: templateActiveSearch || undefined,
      sort: { field: sortField, order: sortOrder },
    };
  }, [selectedPspId, templateSorting, templatePagination, templateActiveSearch]);

  /* ── Derive GraphQL variables for survey query ── */
  const surveyVariables = useMemo<ListSurveysVars | null>(() => {
    const sortField =
      surveySorting.length > 0
        ? (SURVEY_COLUMN_SORT_MAP[surveySorting[0].id] ?? SurveySortField.NAME)
        : SurveySortField.NAME;

    const sortOrder =
      surveySorting.length > 0
        ? surveySorting[0].desc
          ? SortOrder.DESC
          : SortOrder.ASC
        : SortOrder.ASC;

    return {
      page: surveyPagination.pageIndex + 1,
      pageSize: surveyPagination.pageSize,
      search: surveyActiveSearch || undefined,
      sort: { field: sortField as SurveySortField, order: sortOrder },
      statusFilter: filterState.status !== ALL_STATUSES ? filterState.status : undefined,
      brandId: filterState.brandId ?? undefined,
    };
  }, [
    surveySorting,
    surveyPagination,
    surveyActiveSearch,
    filterState.status,
    filterState.brandId,
  ]);

  const { data: surveyStatCardsData, loading: isSurveyCardsLoading } = useQuery<
    ListSurveysData,
    ListSurveysVars
  >(GET_SURVEYS_STAT_CARDS, {
    variables: {},
  });

  /* ── Template query ── */
  // Skip when: role has no template access OR (tabs visible and on surveys tab)
  const skipTemplateQuery = !caps.canAccessTemplates || activeTab === 'surveys';

  const {
    data: templateData,
    refetch,
    loading: templateLoading,
  } = useQuery<ListSurveyTemplatesData, ListSurveyTemplatesVars>(
    GET_SURVEY_TEMPLATES,
    templateVariables && !skipTemplateQuery
      ? {
          variables: templateVariables,
          fetchPolicy: 'network-only',
        }
      : skipToken,
  );

  /* ── Survey query ── */
  // Skip when: tabs visible (PSP Admin) AND on templates tab
  const skipSurveyQuery = caps.showTabs && activeTab === 'templates';

  const {
    data: surveyData,
    refetch: refetchSurveyQuery,
    loading: surveyLoading,
  } = useQuery<ListSurveysData, ListSurveysVars>(
    GET_SURVEYS,
    surveyVariables && !skipSurveyQuery
      ? { variables: surveyVariables, fetchPolicy: 'network-only' }
      : skipToken,
  );

  /* ── Brands query (for filter dropdown) — only for roles with brand filter ── */
  const { data: brandsData } = useQuery<GetBrandsResponse, GetBrandsVariables>(GET_BRANDS, {
    variables: selectedPspId ? { pspId: selectedPspId, pageSize: BRANDS_PAGE_SIZE } : { pspId: '' },
    skip: !selectedPspId || !caps.showBrandFilter,
    fetchPolicy: 'cache-first',
  });

  /* ────── Mutations ────── */
  const [deleteSurveyTemplateMutation, { loading: isDeletingTemplate }] = useMutation<
    DeleteSurveyTemplateResponse,
    DeleteSurveyTemplateVariables
  >(DELETE_SURVEY_TEMPLATE);

  const [deleteSurveyMutation] = useMutation<
    { deleteSurvey: { success: boolean; message: string } },
    { surveyId: string }
  >(DELETE_SURVEY);

  const refetchTemplates = () => {
    startTemplateTransition(() => {
      if (refetch && templateVariables) {
        refetch({ ...templateVariables }).catch(() => undefined);
      }
    });
  };

  const refetchSurveys = () => {
    startSurveyTransition(() => {
      if (refetchSurveyQuery && surveyVariables) {
        refetchSurveyQuery({ ...surveyVariables }).catch(() => undefined);
      }
    });
  };

  const handleDeleteSurveyTemplate = async (surveyTemplateId: string) => {
    await deleteSurveyTemplateMutation({
      variables: { surveyTemplateId },
      onCompleted: () => {
        toast.success('Template deleted successfully');
        refetchTemplates();
      },
    });
  };

  const handleDeleteSurvey = async (surveyId: string) => {
    await deleteSurveyMutation({
      variables: { surveyId },
      onCompleted: () => {
        toast.success('Survey deleted successfully');
        setSurveyToDelete(null);
        refetchSurveys();
      },
    });
  };

  /* ── Template handlers ── */
  const handleTemplateSortingChange = (
    updater: SortingState | ((prev: SortingState) => SortingState),
  ) => {
    startTemplateTransition(() => {
      setTemplateSorting(updater);
    });
  };

  const handleTemplatePaginationChange = (
    updater: PaginationState | ((prev: PaginationState) => PaginationState),
  ) => {
    startTemplateTransition(() => {
      setTemplatePagination(updater);
    });
  };

  const updateTemplateSearch = (value: string) => {
    setTemplateSearch(value);
  };

  const clearTemplateSearch = () => {
    skipTemplateDebounceRef.current = true;
    startTemplateTransition(() => {
      setTemplateSearch('');
      setTemplateActiveSearch('');
      setTemplatePagination((prev) => ({ ...prev, pageIndex: 0 }));
    });
  };

  /* ── Survey handlers ── */
  const handleSurveySortingChange = (
    updater: SortingState | ((prev: SortingState) => SortingState),
  ) => {
    startSurveyTransition(() => {
      setSurveySorting(updater);
    });
  };

  const handleSurveyPaginationChange = (
    updater: PaginationState | ((prev: PaginationState) => PaginationState),
  ) => {
    startSurveyTransition(() => {
      setSurveyPagination(updater);
    });
  };

  const updateSurveySearch = (value: string) => {
    setSurveySearch(value);
  };

  const clearSurveySearch = () => {
    skipSurveyDebounceRef.current = true;
    startSurveyTransition(() => {
      setSurveySearch('');
      setSurveyActiveSearch('');
      setSurveyPagination((prev) => ({ ...prev, pageIndex: 0 }));
    });
  };

  const updateStatus = (value: SurveyStatusEnum | typeof ALL_STATUSES) => {
    startSurveyTransition(() => {
      setFilterState((prev) => ({ ...prev, status: value }));
      setSurveyPagination((prev) => ({ ...prev, pageIndex: 0 }));
    });
  };

  const updateBrandFilter = (value: string | typeof ALL_BRANDS) => {
    startSurveyTransition(() => {
      setFilterState((prev) => ({
        ...prev,
        brandId: value === ALL_BRANDS ? undefined : value,
      }));
      setSurveyPagination((prev) => ({ ...prev, pageIndex: 0 }));
    });
  };

  const resetFilters = () => {
    skipSurveyDebounceRef.current = true;
    startSurveyTransition(() => {
      setSurveySearch('');
      setSurveyActiveSearch('');
      setFilterState(INITIAL_FILTER);
      setSurveyPagination((prev) => ({ ...prev, pageIndex: 0 }));
    });
  };

  /* ── Debounce effect for template search ── */
  useEffect(() => {
    if (skipTemplateDebounceRef.current) {
      skipTemplateDebounceRef.current = false;
      return;
    }
    startTemplateTransition(() => {
      setTemplateActiveSearch(debouncedTemplateSearch);
      setTemplatePagination((prev) => ({ ...prev, pageIndex: 0 }));
    });
  }, [debouncedTemplateSearch]);

  /* ── Debounce effect for survey search ── */
  useEffect(() => {
    if (skipSurveyDebounceRef.current) {
      skipSurveyDebounceRef.current = false;
      return;
    }
    startSurveyTransition(() => {
      setSurveyActiveSearch(debouncedSurveySearch);
      setSurveyPagination((prev) => ({ ...prev, pageIndex: 0 }));
    });
  }, [debouncedSurveySearch]);

  /* ── Survey summary counts ── */
  const summary = surveyStatCardsData?.listSurveys?.summary;
  const totalSurveys = summary?.totalCount ?? 0;
  const activeSurveys = summary?.activeCount ?? 0;
  const closedSurveys = summary?.closedCount ?? 0;

  const brandsForFilter = brandsData?.listBrands?.brands ?? [];

  return {
    /* ── template data ── */
    templateList: (templateData?.listSurveyTemplates?.surveyTemplates ??
      []) as SurveyTemplateType[],
    templatePaginationInfo: templateData?.listSurveyTemplates?.pagination,
    templateLoading: isTemplatePending || templateLoading,
    templateSorting,
    setTemplateSorting: handleTemplateSortingChange,
    templatePagination,
    setTemplatePagination: handleTemplatePaginationChange,
    templateSearch,
    updateTemplateSearch,
    clearTemplateSearch,
    handleDeleteSurveyTemplate,
    isDeletingTemplate,

    /* ── survey data ── */
    surveyList: (surveyData?.listSurveys?.surveys ?? []) as SurveyListItemType[],
    surveyPaginationInfo: surveyData?.listSurveys?.pagination,
    surveyLoading: isSurveyPending || surveyLoading,
    surveySorting,
    setSurveySorting: handleSurveySortingChange,
    surveyPagination,
    setSurveyPagination: handleSurveyPaginationChange,
    surveySearch,
    updateSurveySearch,
    clearSurveySearch,
    handleDeleteSurvey,
    surveyToDelete,
    setSurveyToDelete,

    /* ── survey filter state ── */
    filterState,
    updateStatus,
    updateBrandFilter,
    resetFilters,
    brandsForFilter,
    ALL_STATUSES,
    ALL_BRANDS,

    /* ── summary counts ── */
    isSurveyCardsLoading,
    totalSurveys,
    activeSurveys,
    closedSurveys,

    /* ── tabs ── */
    activeTab,
    setActiveTab,
    showCreateSurveyDialog,
    setShowCreateSurveyDialog,
  };
}
