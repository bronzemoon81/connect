import { localDatabase } from "@/utils/properties/local-database";
import { selectionService } from "@/services";
import { helper } from "@/utils/properties/helper";
import { Bayiloji } from "@/utils/transactions/bayiloji";
import { dateFns } from "@/utils/properties/date-fns";
import { serverDatabase } from "@/utils/properties/server-database";

export class BayilojiMethod extends Bayiloji {
  serverDate = null;
  date = null;

  constructor() {
    super();
    this.model = localDatabase().companyFiches.bayiloji;
  }

  async truncate() {
    await this.model.deleteGTE("time", `${this.date}T00:00:00.000Z`);
  }

  async process() {
    this.serverDate = serverDatabase().fromDate;

    this.date = _.cloneDeep(this.serverDate);

    const lastRecord = await this.model.first({ orderBy: { time: "desc" } });
    let lastTime = _.get(lastRecord, "time");
    if (lastTime) {
      lastTime = dateFns.startOfDay(
        dateFns.subDays(helper.parseDate(lastTime), 30)
      );
      if (dateFns.differenceInDays(lastTime, this.serverDate) > 0)
        this.date = helper.formatDate(lastTime, "yyyy-MM-dd");
    }
    return super.process();
  }

  async fetch(page = 1, perpage = 250) {
    if (!this.store.processing) return;

    const result = await selectionService.fetch({
      company_fiche: {
        "@select": [
          "id",
          "transaction_type",
          "sync_id",
          "series",
          "document_no",
          "company_id",
          "amount",
          "currency_code",
          "currency_rate",
          "company_currency_code",
          "company_currency_rate",
          "description",
          "time",
        ],
        "@page": page,
        "@paginate": perpage,
        "@where": {
          series: "ERP",
          transaction_type: [27, 28],
        },
        "@whereDateTimeRange": {
          time: {
            from: `${this.date}T00:00:00.000Z`,
          },
        },
        "@order": "time:asc",
        company: {
          "@select": ["id", "code", "code_sync"],
        },
      },
    });

    if (result.kind !== "ok") throw new Error(result.message);

    const list = _.get(result.data, "company_fiche.data", []).map((item) => {
      return {
        id: _.get(item, "id"),
        sync_id: _.get(item, "sync_id", null),
        document_no: _.get(item, "document_no", null),
        company_code: _.get(item, "company.code_sync", null),
        time: _.get(item, "time"),
        currency_code: _.get(item, "currency_code"),
        currency_rate: helper.round(_.get(item, "currency_rate"), 4),
        company_currency_code: _.get(item, "currency_code"),
        company_currency_rate: helper.round(_.get(item, "currency_rate"), 4),
        amount:
          Math.abs(helper.round(_.get(item, "amount"), 2)) *
          _.get(item, "direction", 1),
        description: _.get(item, "description"),
      };
    });

    await this.model.insert(list);
    if (list.length === perpage) {
      await helper.sleep(this.apiDelay);
      await this.fetch(page + 1, perpage);
    }
  }
}
