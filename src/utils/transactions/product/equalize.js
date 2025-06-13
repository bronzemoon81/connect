import { localDatabase } from "@/utils/properties/local-database";
import { productService } from "@/services";
import { Equalize } from "@/utils/transactions/equalize";

export class EqualizeMethod extends Equalize {
  serviceName = "product";
  categories = [];

  saveMethodService = productService.massSubmit;
  deleteMethodService = productService.massArchive;

  constructor() {
    super();
    this.bridgeModel = localDatabase().products.bridge;
    this.bayilojiModel = localDatabase().products.bayiloji;
  }

  async process() {
    this.categories = await localDatabase().categories.get();
    await super.process();
  }

  eachItemFormatForSave(item) {
    const categoryIndex = _.findIndex(this.categories, {
      code: item.category_code,
    });
    return {
      uuid: _.get(item, "uuid"),
      category_id: _.get(this.categories, `${categoryIndex}.id`) || null,
      product_group_code: _.get(item, "product_group_code"),
      code: _.get(item, "code"),
      code_sync: _.get(item, "code_sync"),
      invoice_code: _.get(item, "invoice_code"),
      title: _.get(item, "title"),
      description_1: _.get(item, "description_1"),
      model: _.get(item, "model"),
      brand: _.get(item, "brand"),
      // color: _.get(item, "color"),
      color_code: _.get(item, "color_code"),
      warehouse_code: _.get(item, "warehouse_code"),
      warehouse_shelf: _.get(item, "warehouse_shelf"),
      item_group_1: _.get(item, "item_group_1"),
      item_group_2: _.get(item, "item_group_2"),
      item_group_3: _.get(item, "item_group_3"),
      vat_rate: _.get(item, "vat_rate"),
      use_serial_lot: _.get(item, "use_serial_lot"),
      is_divisible: _.get(item, "is_divisible"),
      unit: _.get(item, "unit"),
      qty: _.get(item, "qty"),
    };
  }
}
