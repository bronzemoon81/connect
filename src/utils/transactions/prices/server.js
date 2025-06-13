import { localDatabase } from "@/utils/properties/local-database";
import { Server } from "@/utils/transactions/server";

export class ServerMethod extends Server {
  service = "prices";
  primaryKey = "id";
  constructor() {
    super();
    this.model = localDatabase().prices.erp;
  }

  eachItemFormatForSave(item) {
    return {
      ...item,
      id: `${item.price_list_code}--${item.product_code}`,
    };
  }
}
