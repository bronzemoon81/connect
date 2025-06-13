import Model from "../../../model";

export default class CompanyBalanceBridgeModel extends Model {
  name = "CompanyBalanceBridge";

  tableName = "company_balances_bridge";

  casts = {
    time: "datetime",
  };
}
