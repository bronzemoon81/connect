import Model from "../../../model";

export default class CompanyErpModel extends Model {
  name = "CompanyErp";

  tableName = "companies_erp";

  columnDescriptions = {
    type: "Cari Türü (Müşteri: 0, Tedarikçi: 1)",
    title: "Cari Adı",
    code: "Cari Kodu",
    address: "Adres",
    district: "İlçe",
    city: "Şehir",
    country: "Ülke",
    phone: "Telefon",
    email: "E-posta",
    gsm: "Yetkilinin Cep Telefonu",
    description_1: "Açıklama #1",
    description_2: "Açıklama #2",
    currency_code: "Para Birimi (TRY, USD, EUR, vb.)",
    tax_number: "Vergi Numarası",
    tax_office: "Vergi Dairesi",
    tc_number: "T.C. Kimlik Numarası",
    name_surname: "Yetkilinin Adı Soyadı",
    due_days: "Vade Günü",
    group_code: "Cari Grup Kodu",
  };

  beforeSave(props) {
    return {
      ...super.beforeSave(props),
      code_sync: props.code,
    };
  }
}
