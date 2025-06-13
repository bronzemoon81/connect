import { localDatabase } from "@/utils/properties/local-database";
import { selectionService } from "@/services";
import { helper } from "@/utils/properties/helper";
import { Bayiloji } from "@/utils/transactions/bayiloji";

export class BayilojiMethod extends Bayiloji {
  constructor() {
    super();
    this.model = localDatabase().productLots.bayiloji;
    this.model.truncate();
  }

  async fetch(page = 1, perpage = 250) {
    if (!this.store.processing) return;

    const categoryIds = await localDatabase()
      .categories.get(["id"])
      .then((result) => _.map(result, "id"));

    const result = await selectionService.fetch({
      product_lot: {
        "@select": ["lot_id", "product_code"],
        "@page": page,
        "@paginate": perpage,
        "@func": ["withQty"],
        "@whereHas": {
          product: {
            category_id: categoryIds,
          },
        },
        "@customQuery": { qty: 2 },
      },
    });

    if (result.kind !== "ok") throw new Error(result.message);

    const list = _.get(result.data, "product_lot.data", []);

    await this.model.insert(list);
    if (list.length === perpage) {
      await helper.sleep(this.apiDelay);
      await this.fetch(page + 1, perpage);
    }
  }
}
