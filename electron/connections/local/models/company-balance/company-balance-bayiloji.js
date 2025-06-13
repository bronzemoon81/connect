import Model from "../../../model";

export default class CompanyBalanceBayilojiModel extends Model {
  name = "CompanyBalanceBayiloji";

  tableName = "company_balances_bayiloji";

  casts = {
    time: "datetime",
  };
}
