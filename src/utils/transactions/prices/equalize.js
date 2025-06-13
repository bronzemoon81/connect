import { localDatabase } from "@/utils/properties/local-database";
import { priceService } from "@/services/prices";
import { Equalize } from "@/utils/transactions/equalize";

export class EqualizeMethod extends Equalize {
  serviceName = "price";

  take = 500;
  saveMethodService = priceService.massSubmit;

  // deleteMethodService = priceService.massArchive;

  constructor() {
    super();
    this.bridgeModel = localDatabase().prices.bridge;
    this.bayilojiModel = localDatabase().prices.bayiloji;
  }
  eachItemFormatForSave(item) {
    return {
      uuid: _.get(item, "uuid"),
      price_list_id: parseInt(item.price_list_id),
      product_id: item.product_id,
      price: parseFloat(item.price),
      is_vat_included: false,
    };
  }
}
