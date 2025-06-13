import { localDatabase } from "@/utils/properties/local-database";
import { companyFicheService } from "@/services";
import { Equalize } from "@/utils/transactions/equalize";
import { helper } from "@/utils/properties/helper";

export class EqualizeMethod extends Equalize {
  serviceName = "companyFiche";
  companies = [];

  saveMethodService = companyFicheService.massSubmit;
  deleteMethodService = companyFicheService.massArchive;

  constructor() {
    super();
    this.bridgeModel = localDatabase().companyFiches.bridge;
    this.bayilojiModel = localDatabase().companyFiches.bayiloji;
  }

  async process() {
    this.companies = await localDatabase().companies.bayiloji.get({
      select: ["id", "code"],
    });

    const companyCodes = _.map(this.companies, "code");
    this.bridgeModel.delete({
      whereNotIn: {
        company_code: companyCodes,
      },
    });

    await super.process();
  }

  eachItemFormatForSave(item) {
    const companyIndex = _.findIndex(this.companies, {
      code: item.company_code,
    });

    const amount = helper.round(_.get(item, "amount"));
    const time = helper.parseDate(_.get(item, "time"));
    return {
      uuid: _.get(item, "uuid"),
      sync_id: _.get(item, "sync_id"),
      transaction_type: amount >= 0 ? 28 : 27, // 28: Alacak Tahakkuk, 27: Borç Tahakkuku
      company_id: _.get(this.companies, `${companyIndex}.id`),
      series: "ERP",
      document_no: _.get(item, "document_no"),
      description: _.get(item, "description"),
      currency_code: _.get(item, "currency_code"),
      currency_rate: _.get(item, "currency_rate"),
      company_currency_code: _.get(item, "company_currency_code"),
      company_currency_rate: _.get(item, "company_currency_rate"),
      amount: Math.abs(amount),
      time: time ? time.toISOString() : null,
      is_paid: true,
      pay_plan: false,
    };
  }
}
