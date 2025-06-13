import { localDatabase } from "@/utils/properties/local-database";
import { selectionService } from "@/services";
import { helper } from "@/utils/properties/helper";
import { Bayiloji } from "@/utils/transactions/bayiloji";

export class BayilojiMethod extends Bayiloji {
  constructor() {
    super();
    this.model = localDatabase().products.bayiloji;
  }

  async fetch(page = 1, perpage = 250) {
    if (!this.store.processing) return;

    const categoryIds = await localDatabase()
      .categories.get(["id"])
      .then((result) => _.map(result, "id"));

    const result = await selectionService.fetch({
      product: {
        "@select": [
          "id",
          "product_group_code",
          "code",
          "code_sync",
          "invoice_code",
          "title",
          "description_1",
          "model",
          "brand",
          // "color",
          "color_code",
          // "warehouse_code",
          // "warehouse_shelf",
          "category_id",
          "item_group_1",
          "item_group_2",
          "item_group_3",
          "vat_rate",
          "use_serial_lot",
          "is_divisible",
          "unit",
        ],
        "@page": page,
        "@paginate": perpage,
        "@func": ["withQty"],
        "@where": {
          category_id: categoryIds,
        },
        category: {
          "@select": ["id", "title", "code"],
        },
      },
    });

    if (result.kind !== "ok") throw new Error(result.message);

    const list = _.get(result.data, "product.data", []).map((item) => {
      const { category, category_id, ...pureItems } = item;
      const useSerialLot = !!_.get(item, "use_serial_lot", false);
      const qty = !useSerialLot ? _.get(pureItems, "qty") : 0;
      return {
        ...pureItems,
        warehouse_code: _.get(pureItems, "warehouse_code", null),
        warehouse_shelf: _.get(pureItems, "warehouse_shelf", null),

        use_serial_lot: useSerialLot,
        category_code: _.get(category, "code", null),
        qty: helper.round(qty, 4),
      };
    });

    await this.model.insert(list);
    if (list.length === perpage) {
      await helper.sleep(this.apiDelay);
      await this.fetch(page + 1, perpage);
    }
  }
}
