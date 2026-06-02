import { PageRoot } from '@/components';

import ReorderDetailHeaderLoading from './(components)/reorder-detail-header/reorder-detail-header.loading';
import ReorderInfoSectionLoading from './(components)/reorder-info-section/reorder-info-section.loading';
import ReorderPromotionTableLoading from './(components)/reorder-promotion-table/reorder-promotion-table.loading';

export default function ReorderDetailLoading() {
  return (
    <PageRoot>
      <div className='flex flex-col gap-5'>
        {/* ── Back link + Header ── */}
        <ReorderDetailHeaderLoading />

        {/* ── Info Section ── */}
        <ReorderInfoSectionLoading />

        {/* ── Promotions Table ── */}
        <ReorderPromotionTableLoading />
      </div>
    </PageRoot>
  );
}
