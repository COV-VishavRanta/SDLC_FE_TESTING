import { DEFAULT_PAGE_SIZE, INITIAL_PAGE_INDEX, SEARCH_DEBOUNCE_MS, SortOrder } from '@/constant';
import {
  GET_PROMOTIONS_BY_CAMPAIGN,
  GetPromotionsByCampaignResponse,
  GetPromotionsByCampaignVariables,
} from '@/graphql';
import { useQuery } from '@apollo/client/react';
import { PaginationState, SortingState } from '@tanstack/react-table';
import { useDebounce } from '@uidotdev/usehooks';
import { useContext, useEffect, useRef, useState, useTransition } from 'react';

import { useGlobalProtected } from '@/contexts';
import { CampaignDetailsContext } from '../../context/CampaignDetailsContext';

export default function usePromotionsSection() {
  const { selectedStoreId } = useGlobalProtected();
  const { campaignData, setPromotionsLength } = useContext(CampaignDetailsContext);
  const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: false }]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: INITIAL_PAGE_INDEX,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [search, setSearch] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const skipDebounceRef = useRef(false);
  const [, startTransition] = useTransition();

  const debouncedSearch = useDebounce(search, SEARCH_DEBOUNCE_MS);

  useEffect(() => {
    if (skipDebounceRef.current) {
      skipDebounceRef.current = false;
      return;
    }
    startTransition(() => {
      setActiveSearch(debouncedSearch);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    });
  }, [debouncedSearch]);

  const updateSearch = (value: string) => {
    setSearch(value);
  };

  const clearSearch = () => {
    skipDebounceRef.current = true;
    startTransition(() => {
      setSearch('');
      setActiveSearch('');
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    });
  };

  const campaignId = campaignData?.id ?? '';

  const sortOrder =
    sorting.length > 0 ? (sorting[0].desc ? SortOrder.DESC : SortOrder.ASC) : SortOrder.ASC;

  const { data, loading } = useQuery<
    GetPromotionsByCampaignResponse,
    GetPromotionsByCampaignVariables
  >(GET_PROMOTIONS_BY_CAMPAIGN, {
    variables: {
      ...(selectedStoreId ? { storeId: selectedStoreId } : {}),
      campaignId,
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      sortOrder,
      search: activeSearch || undefined,
    },
    skip: !campaignId,
  });

  useEffect(() => {
    if (data?.promotionsByCampaign?.pagination?.totalCount !== undefined) {
      setPromotionsLength(data.promotionsByCampaign.pagination.totalCount);
    }
  }, [data, setPromotionsLength]);
  return {
    //data
    data,
    loading,

    // filter and sorts and pagination
    sorting,
    setSorting,
    pagination,
    setPagination,
    search,
    updateSearch,
    clearSearch,
  };
}
