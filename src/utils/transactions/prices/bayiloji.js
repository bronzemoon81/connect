import { localDatabase } from "@/utils/properties/local-database";
import { selectionService } from "@/services";
import { helper } from "@/utils/properties/helper";
import { Bayiloji } from "@/utils/transactions/bayiloji";
import _ from "lodash";

export class BayilojiMethod extends Bayiloji {
  priceCodes = [];

  constructor() {
    super();
    this.model = localDatabase().prices.bayiloji;
    this.model.truncate();
  }

  async fetch(page = 1, perpage = 250) {
    if (!this.store.processing) return;

    this.priceCodes = await localDatabase().priceList.get();

    const result = await selectionService.fetch({
      product: {
        "@select": ["id", "code"],
        "@page": page,
        "@paginate": perpage,
        prices: {
          "@select": ["price_list_id", "product_id", "price"],
        },
      },
    });

    if (result.kind !== "ok") throw new Error(result.message);

    let list = _.get(result, "data.product.data", []).flatMap((item) => {
      return item.prices.map((price) => ({
        product_code: item.code,
        price_list_id: price.price_list_id,
        price: price.price,
      }));
    });

    list.forEach((item) => {
      const matchingPriceCode = this.priceCodes.find(
        (code) => code.id === item.price_list_id.toString()
      );

      if (matchingPriceCode) {
        item.price_list_code = matchingPriceCode.code;
      }
    });

    list = list.map(({ price_list_id, ...rest }) => rest);
    await this.model.insert(list);

    if (list.length === perpage) {
      await helper.sleep(this.apiDelay);
      await this.fetch(page + 1, perpage);
    }
  }
}
