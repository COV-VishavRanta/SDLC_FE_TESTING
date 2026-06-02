import { PageRoot } from '@/components';
import ShipmentDetailHeaderLoading from './(components)/shipment-detail-header/shipment-detail-header.loading';
import ShipmentDetailPromotionTableLoading from './(components)/shipment-detail-promotion-table/shipment-detail-promotion-table.loading';
import ShipmentInfoSectionLoading from './(components)/shipment-info-section/shipment-info-section.loading';

export default function ShipmentDetailLoading() {
  return (
    <PageRoot>
      <div className='flex flex-col gap-5'>
        {/* ── Back link + Header ── */}
        <ShipmentDetailHeaderLoading />

        {/* ── Info Section ── */}
        <ShipmentInfoSectionLoading />

        {/* ── Promotions Table ── */}
        <ShipmentDetailPromotionTableLoading />
      </div>
    </PageRoot>
  );
}
