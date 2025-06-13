import Model from "../../../model";

export default class ProductBayilojiModel extends Model {
  name = "ProductBayiloji";

  tableName = "products_bayiloji";

  casts = {
    use_serial_lot: "boolean",
    is_divisible: "boolean",
  };
}
