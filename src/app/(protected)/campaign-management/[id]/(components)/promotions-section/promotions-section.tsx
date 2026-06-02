'use client';

import PromotionsActions from './promotions-actions/promotions-actions';
import PromotionsTable from './promotions-table/promotions-table';
import usePromotionsSection from './usePromotionsSection';

export default function PromotionsSection() {
  const {
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
  } = usePromotionsSection();
  return (
    <>
      <PromotionsActions
        totalCount={data?.promotionsByCampaign?.pagination?.totalCount ?? 0}
        search={search}
        onSearchChange={updateSearch}
        onClearSearch={clearSearch}
      />
      <PromotionsTable
        data={data}
        loading={loading}
        pagination={pagination}
        setPagination={setPagination}
        sorting={sorting}
        setSorting={setSorting}
      />
    </>
  );
}
