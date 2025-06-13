import Model from "../../../model";

export default class ProductLotErpModel extends Model {
  name = "ProductLotErp";

  tableName = "product_lots_erp";

  columnDescriptions = {
    lot_id: "Lot Numarası",
    product_code: "Ürün Kodu",
    warehouse_code: "Depo Kodu",
    warehouse_shelf: "Raf Kodu",
    qty: "Stok Miktarı",
  };
}
