import Model from "../../../model";

export default class CompanyFicheBridgeModel extends Model {
  name = "CompanyFicheBridge";

  tableName = "company_fiches_bridge";

  casts = {
    time: "datetime",
  };
}
