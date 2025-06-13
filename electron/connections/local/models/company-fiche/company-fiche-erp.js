import Model from "../../../model";

export default class CompanyFicheErpModel extends Model {
  name = "CompanyFicheErp";

  tableName = "company_fiches_erp";

  columnDescriptions = {
    company_code: "Cari Kodu",
    time: "Belgenin Düzenleme Tarihi",
    amount:
      "Toplam Tutar (Cariye Borç İşleniyorsa +, Cariye Alacak İşleniyorsa -)",
    currency_code: "Belge Para Birimi (TRY, USD, EUR, vb.)",
    currency_rate: "Belgenin Döviz Kuru Değeri",
    company_currency_code: "Cari Para Birimi (TRY, USD, EUR, vb.)",
    company_currency_rate: "Carinin Döviz Kuru Değeri",
    description: "Belge Açıklaması",
    sync_id: "Belgenin ID Bilgisi",
  };

  casts = {
    time: "datetime",
  };
}
