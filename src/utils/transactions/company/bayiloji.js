import { localDatabase } from "@/utils/properties/local-database";
import { selectionService } from "@/services";
import { helper } from "@/utils/properties/helper";
import { Bayiloji } from "@/utils/transactions/bayiloji";

export class BayilojiMethod extends Bayiloji {
  constructor() {
    super();
    this.model = localDatabase().companies.bayiloji;
  }

  async fetch(page = 1, perpage = 250) {
    if (!this.store.processing) return;

    const columns = await this.model.getColumnNames();
    const columnKeys = _.keys(_.omit(columns, ["id", "group_code"]));

    const result = await selectionService.fetch({
      company: {
        "@select": [...columnKeys, "group_id"],
        "@page": page,
        "@paginate": perpage,
        "@where": {
          series: "ERP",
        },
        group: {
          "@select": ["id", "title", "code"],
        },
      },
    });

    if (result.kind !== "ok") throw new Error(result.message);

    const list = _.get(result.data, "company.data", []).map((item) => {
      const { group, group_id, ...pureItems } = item;
      return {
        ...pureItems,
        group_code: _.get(group, "code", null),
      };
    });

    await this.model.insert(list);
    if (list.length === perpage) {
      await helper.sleep(this.apiDelay);
      await this.fetch(page + 1, perpage);
    }
  }
}
