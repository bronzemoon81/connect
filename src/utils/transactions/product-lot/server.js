import { localDatabase } from "@/utils/properties/local-database";
import { Server } from "@/utils/transactions/server";
import { helper } from "@/utils/properties/helper";

export class ServerMethod extends Server {
  service = "productLot";
  primaryKey = "lot_id";

  takeFromPage = 1000;
  constructor() {
    super();
    this.model = localDatabase().productLots.erp;
  }

  eachItemFormatForSave(item) {
    return {
      ...item,
      lot_id: (item.lot_id || "").toString().trim(),
      qty: helper.round(_.get(item, "qty"), 4),
    };
  }
}
