import { localDatabase } from "@/utils/properties/local-database";
import { Server } from "@/utils/transactions/server";
import { helper } from "@/utils/properties/helper";

export class ServerMethod extends Server {
  service = "product";
  primaryKey = "code";

  constructor() {
    super();
    this.model = localDatabase().products.erp;
  }

  eachItemFormatForSave(item) {
    const useSerialLot =
      typeof item.use_serial_lot === "boolean"
        ? item.use_serial_lot
        : parseInt(item.use_serial_lot) === 1;
    const qty = !useSerialLot ? _.get(item, "qty") : 0;
    return {
      ...item,
      code: (item.code || "").toString().trim(),
      use_serial_lot: useSerialLot,
      qty: helper.round(qty, 4),
      unit: item.unit || "C62", // Eğer birim gelmiyorsa ADET (C62) olarak kaydet
    };
  }
}
