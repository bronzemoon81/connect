import Model from "../../../model";

export default class PricesBayilojiModel extends Model {
  name = "PricesBayiloji";

  tableName = "prices_bayiloji";

  casts = {
    is_vat_included: "boolean",
  };
}
