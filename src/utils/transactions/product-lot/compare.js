import { localDatabase } from "@/utils/properties/local-database";
import { Compare } from "@/utils/transactions/compare";

export class CompareMethod extends Compare {
  constructor() {
    super();
    this.model = localDatabase().productLots.bridge;
    this.model.truncate();
  }

  async compare() {
    let columns = await localDatabase().productLots.bayiloji.getColumnNames();
    const columnKeys = _.keys(_.omit(columns, ["id"]));

    const columnKeysToString = (table = null) => {
      return columnKeys.map((o) => (table ? `${table}.${o}` : o)).join(", ");
    };

    const bayilojiColumns = columnKeysToString("product_lots_bayiloji");
    const erpColumns = columnKeysToString("product_lots_erp");

    const queries = [
      `INSERT INTO product_lots_bridge (id, ${columnKeysToString()}, operation)`,
      "SELECT null as 'id', EXP1.*,'UPDATED' AS 'operation' FROM",
      `(SELECT ${erpColumns} FROM product_lots_erp EXCEPT SELECT ${bayilojiColumns} FROM product_lots_bayiloji) AS EXP1`,
      `JOIN product_lots_bayiloji ON EXP1.lot_id = product_lots_bayiloji.lot_id`,
      `UNION ALL`,
      `SELECT product_lots_bayiloji.id as 'id', ${bayilojiColumns}, 'DELETED' AS 'operation' FROM product_lots_bayiloji`,
      `LEFT JOIN product_lots_erp ON product_lots_bayiloji.lot_id = product_lots_erp.lot_id`,
      `WHERE product_lots_erp.lot_id IS NULL`,
      `UNION ALL`,
      `SELECT null as 'id', ${erpColumns}, 'INSERTED' AS 'operation' FROM product_lots_erp`,
      `LEFT JOIN product_lots_bayiloji ON product_lots_bayiloji.lot_id = product_lots_erp.lot_id`,
      `WHERE product_lots_bayiloji.lot_id IS NULL`,
    ];

    /*
    const queries = [
      "INSERT INTO product_lots_bridge(",
      productLotBridgeColumnKeys,
      ")",
      "SELECT  product_lots_erp.*,",
      "CASE",
      "    WHEN CAST(product_lots_bayiloji.qty AS INT) > CAST(product_lots_erp.qty AS INT) THEN   ",
      "    CAST(product_lots_bayiloji.qty AS INT) - CAST(product_lots_erp.qty AS INT) ",
      "    WHEN CAST(product_lots_bayiloji.qty AS INT) < CAST(product_lots_erp.qty AS INT) THEN  ",
      "     CAST(product_lots_erp.qty AS INT) -  CAST(product_lots_bayiloji.qty AS INT)  ",
      "END AS quantity, ",
      "CASE",
      "    WHEN product_lots_bayiloji.qty > product_lots_erp.qty THEN 'MINUS'",
      "    WHEN product_lots_bayiloji.qty < product_lots_erp.qty THEN 'PLUS'",
      "END AS op,",
      "'0' AS sending, 0 AS 'error'",
      "",
      "FROM product_lots_bayiloji JOIN product_lots_erp ON product_lots_bayiloji.lot_id=product_lots_erp.lot_id",
      "where product_lots_bayiloji.qty!=product_lots_erp.qty",
      " UNION",
      "    SELECT product_lots_bayiloji.*, 0 AS 'quantity','DELETED' AS 'op', 0 AS 'sending', 0 AS 'error' ",
      "          FROM product_lots_bayiloji",
      "     LEFT JOIN product_lots_erp ON product_lots_bayiloji.lot_id= product_lots_erp.lot_id",
      "     WHERE product_lots_erp.lot_id IS NULL",
      "     UNION",
      "     SELECT product_lots_erp.* ,0 AS 'quantity', 'INSERTED' AS 'op', 0 AS 'sending', 0 AS 'error'",
      "          FROM product_lots_erp",
      "     LEFT JOIN product_lots_bayiloji ON product_lots_bayiloji.lot_id= product_lots_erp.lot_id",
      "     WHERE product_lots_bayiloji.lot_id IS NULL",
      "     ",
    ];
     */

    await this.model.raw(queries.join(" "));
  }
}
