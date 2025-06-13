import { localDatabase } from "@/utils/properties/local-database";
import { Server } from "@/utils/transactions/server";
import { helper } from "@/utils/properties/helper";
import { dateFns } from "@/utils/properties/date-fns";

export class ServerMethod extends Server {
  service = "companyFiche";
  primaryKey = "sync_id";

  constructor() {
    super();
    this.model = localDatabase().companyFiches.erp;
  }

  async truncate() {
    const time = dateFns.startOfDay(helper.parseDate(this.date));
    await this.model.deleteGTE("time", time.toISOString());
  }

  async fetchFromServerDate() {
    await super.fetchFromServerDate();

    const lastRecord = await this.model.first({ orderBy: { time: "desc" } });
    let lastTime = helper.parseDate(_.get(lastRecord, "time"));
    if (lastTime) {
      lastTime = dateFns.startOfDay(
        dateFns.subDays(helper.parseDate(lastTime), 30)
      );

      const serverDate = dateFns.startOfDay(helper.parseDate(this.serverDate));
      if (dateFns.differenceInDays(lastTime, serverDate) > 0) {
        this.date = helper.formatDate(lastTime, "yyyy-MM-dd");
      }
    }
  }

  eachItemFormatForSave(item) {
    const companyCode = (item.company_code || "").toString().trim();
    if (companyCode === "120.000.004") {
      console.log(helper.round(item.amount, 2));
    }
    return {
      ...item,
      company_code: companyCode,
      amount: helper.round(item.amount, 2),
      currency_rate: helper.round(item.currency_rate, 4),
      company_currency_rate: helper.round(item.currency_rate, 4),
    };
  }
}
