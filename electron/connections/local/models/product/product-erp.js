import Model from "../../../model";

export default class ProductErpModel extends Model {
  name = "ProductErp";

  tableName = "products_erp";

  casts = {
    use_serial_lot: "boolean",
    is_divisible: "boolean",
  };

  columnDescriptions = {
    category_code: "Kategori Kodu",
    product_group_code: "Ürün Grup Kodu",
    code: "Ürün Kodu",
    title: "Ürün Adı",
    description_1: "Açıklama",
    model: "Model",
    brand: "Marka",
    // color: "Renk",
    color_code: "Renk HEX Kodu (#FFFFFF)",
    item_group_1: "Koleksiyon Grubu",
    item_group_2: "Koleksiyon Ara Grubu",
    item_group_3: "Koleksiyon Alt Grubu",
    vat_rate: "Vergi Oranı",
    use_serial_lot: "Top Takibi Bilgisi (Evet: 1, Hayır: 0)",
    is_divisible:
      "Top Satırlarında Bölme / Kesim Yapılabilir mi? (Evet: 1, Hayır: 0)",
    warehouse_code: "Depo Kodu",
    warehouse_shelf: "Raf Kodu",
    unit: "Birim Kodu",
    qty: "Stok Miktarı",
  };

  beforeSave(props) {
    return {
      ...super.beforeSave(props),
      code_sync: props.code,
    };
  }
}
