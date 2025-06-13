import { localDatabase } from "@/utils/properties/local-database";
import { Compare } from "@/utils/transactions/compare";

export class CompareMethod extends Compare {
  constructor() {
    super();
    this.model = localDatabase().products.bridge;
    this.model.truncate();
  }

  async compare() {
    let columns = await localDatabase().products.bayiloji.getColumnNames();
    const columnKeys = _.keys(_.omit(columns, ["id"]));

    const columnKeysToString = (table = null) => {
      return columnKeys.map((o) => (table ? `${table}.${o}` : o)).join(", ");
    };

    const bayilojiColumns = columnKeysToString("products_bayiloji");
    const erpColumns = columnKeysToString("products_erp");

    const queries = [
      `INSERT INTO products_bridge (id, ${columnKeysToString()}, operation)`,
      "SELECT null as 'id', EXP1.*,'UPDATED' AS 'operation' FROM",
      `(SELECT ${erpColumns} FROM products_erp EXCEPT SELECT ${bayilojiColumns} FROM products_bayiloji) AS EXP1`,
      `JOIN products_bayiloji ON EXP1.code = products_bayiloji.code`,
      `UNION ALL`,
      `SELECT products_bayiloji.id as 'id', ${bayilojiColumns}, 'DELETED' AS 'operation' FROM products_bayiloji`,
      `LEFT JOIN products_erp ON products_bayiloji.code = products_erp.code`,
      `WHERE products_erp.code IS NULL`,
      `UNION ALL`,
      `SELECT null as 'id', ${erpColumns}, 'INSERTED' AS 'operation' FROM products_erp`,
      `LEFT JOIN products_bayiloji ON products_bayiloji.code = products_erp.code`,
      `WHERE products_bayiloji.code IS NULL`,
    ];

    await this.model.raw(queries.join(" "));
  }
}
