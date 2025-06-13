import { localDatabase } from "@/utils/properties/local-database";
import { selectionService } from "@/services";
import { Bayiloji } from "@/utils/transactions/bayiloji";

export class BayilojiMethod extends Bayiloji {
  constructor() {
    super();
    this.model = localDatabase().priceList;
  }

  async fetch(page = 1, perpage = 250) {
    const columns = await this.model.getColumnNames();
    const columnKeys = _.keys(columns);

    const result = await selectionService.fetch({
      price_list: {
        "@get": true,
        "@select": [...columnKeys],
        "@whereNotNull": ["code"],
      },
    });

    if (result.kind !== "ok") throw new Error(result.message);

    const list = _.get(result.data, "price_list.data", []);

    await this.model.insert(list);
  }
}
