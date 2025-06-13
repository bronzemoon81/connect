import { localDatabase } from "@/utils/properties/local-database";
import { Server } from "@/utils/transactions/server";
import { helper } from "@/utils/properties/helper";
import { dateFns } from "@/utils/properties/date-fns";

export class ServerMethod extends Server {
  service = "companyBalance";
  primaryKey = "sync_id";

  constructor(serverDate) {
    super();
    this.serverDate = serverDate;
    this.model = localDatabase().companyBalances.erp;
  }

  async truncate() {
    await this.model.truncate();
    await localDatabase().companyFiches.erp.truncate();
  }

  async fetchFromServerDate() {
    this.date = _.cloneDeep(this.serverDate);
  }

  eachItemFormatForSave(item) {
    const time = dateFns.startOfDay(helper.parseDate(this.date));
    return {
      ...item,
      sync_id: "ERP-DEVIR-" + item.company_code,
      company_currency_code: item.currency_code,
      time: time.toISOString(),
      amount: helper.round(item.amount, 2),
      currency_rate: 1,
      company_currency_rate: 1,
    };
  }
}
