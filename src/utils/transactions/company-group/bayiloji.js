import { localDatabase } from "@/utils/properties/local-database";
import { selectionService } from "@/services";
import { Bayiloji } from "@/utils/transactions/bayiloji";

export class BayilojiMethod extends Bayiloji {
  constructor() {
    super();
    this.model = localDatabase().companyGroups;
  }

  async fetch(page = 1, perpage = 250) {
    const columns = await this.model.getColumnNames();
    const columnKeys = _.keys(_.omit(columns, ["id"]));

    const result = await selectionService.fetch({
      company_group: {
        "@get": true,
        "@select": [...columnKeys],
        "@whereNotNull": ["code"],
      },
    });

    if (result.kind !== "ok") throw new Error(result.message);

    const list = _.get(result.data, "company_group.data", []);

    await this.model.insert(list);
  }
}
