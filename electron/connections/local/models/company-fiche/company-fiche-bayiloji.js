import Model from "../../../model";

export default class CompanyFicheBayilojiModel extends Model {
  name = "CompanyFicheBayiloji";

  tableName = "company_fiches_bayiloji";

  casts = {
    time: "datetime",
  };
}
