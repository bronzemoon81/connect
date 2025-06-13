import Model from "../../../model";

export default class ProductBridgeModel extends Model {
  name = "ProductBridge";

  tableName = "products_bridge";

  casts = {
    use_serial_lot: "boolean",
    is_divisible: "boolean",
  };
}
