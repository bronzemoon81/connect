import { localDatabase } from "@/utils/properties/local-database";
import { Compare } from "@/utils/transactions/compare";

export class CompareMethod extends Compare {
  constructor() {
    super();
    this.model = localDatabase().productPhotos.bridge;
    this.model.truncate();
  }

  async compare() {
    let columns = await localDatabase().productPhotos.bayiloji.getColumnNames();
    const columnKeys = _.keys(_.omit(columns, ["id"]));

    const columnKeysToString = (table = null) => {
      return columnKeys.map((o) => (table ? `${table}.${o}` : o)).join(", ");
    };

    const bayilojiColumns = columnKeysToString("product_photos_bayiloji");
    const erpColumns = columnKeysToString("product_photos_erp");

    this.model.truncate();

    const queries = [
      `INSERT INTO product_photos_bridge (${columnKeysToString()}, operation)`,
      `SELECT  ${erpColumns}, 'INSERTED' AS 'operation'
       FROM product_photos_erp`,
      `LEFT JOIN product_photos_bayiloji ON product_photos_erp.code = product_photos_bayiloji.code
        and
        product_photos_erp.name = product_photos_bayiloji.name`,
      `WHERE product_photos_bayiloji.code IS NULL`,
    ];

    await this.model.raw(queries.join(" "));
  }
}
