import Model from "../../../model";

export default class ProductPhotosErpModel extends Model {
  name = "ProductPhotosErp";

  tableName = "product_photos_erp";

  columnDescriptions = {
    name: "Dosya Adı",
    path: "Dosya Yolu",
    size: "Dosya Boyutu",
    lastModified: "Son güncellenme tarihi ",
  };
}
