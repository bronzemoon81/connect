import Model from "../../../model";

export default class PricesErpModel extends Model {
  name = "PricesErp";

  tableName = "prices_erp";

  casts = {
    is_vat_included: "boolean",
  };

  columnDescriptions = {
    price_list_code: "Fiyat Listesi Kod Numarası",
    product_code: "Ürün Kodu",
    price: "Fiyat",
  };
}
