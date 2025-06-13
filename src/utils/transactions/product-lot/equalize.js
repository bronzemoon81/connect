import { localDatabase } from "@/utils/properties/local-database";
import { productLotService } from "@/services";
import { Equalize } from "@/utils/transactions/equalize";

export class EqualizeMethod extends Equalize {
  serviceName = "productLot";
  products = [];

  saveMethodService = productLotService.massSubmit;
  deleteMethodService = async (params) => {
    return productLotService.massSubmit({
      ...params,
      rows: params.rows.map((row) => ({
        ...row,
        qty: 0,
      })),
    });
  };

  constructor() {
    super();
    this.bridgeModel = localDatabase().productLots.bridge;
    this.bayilojiModel = localDatabase().productLots.bayiloji;
  }

  async process() {
    this.products = await localDatabase().products.bayiloji.get({
      select: ["code"],
    });

    const productCodes = _.map(this.products, "code");
    this.bridgeModel.delete({
      whereNotIn: {
        product_code: productCodes,
      },
    });

    await super.process();
  }

  eachItemFormatForSave(item) {
    return {
      uuid: _.get(item, "uuid"),
      product_code: _.get(item, "product_code"),
      lot_id: _.get(item, "lot_id"),
      warehouse_code: _.get(item, "warehouse_code"),
      warehouse_shelf: _.get(item, "warehouse_shelf"),
      qty: _.get(item, "qty"),
    };
  }
}
