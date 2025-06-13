import Model from "../../../model";

export default class CompanyBalanceErpModel extends Model {
  name = "CompanyBalanceErp";

  tableName = "company_balances_erp";

  columnDescriptions = {
    company_code: "Cari Kodu",
    amount: "Gönderilen Tarihe Kadar Carinin Toplam Bakiyesi",
    currency_code: "Carinin Para Birimi",
    description: "Açıklama",
  };

  casts = {
    time: "datetime",
  };
}
