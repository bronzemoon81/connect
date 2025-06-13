import Model from "../../../model";

export default class PricesBridgeModel extends Model {
  name = "PricesBridge";

  tableName = "prices_bridge";

  casts = {
    is_vat_included: "boolean",
  };
}
