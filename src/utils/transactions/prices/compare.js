import { localDatabase } from "@/utils/properties/local-database";
import { Compare } from "@/utils/transactions/compare";

export class CompareMethod extends Compare {
  constructor() {
    super();
    this.model = localDatabase().prices.bridge;
    this.model.truncate();
  }

  async compare() {
    let columns = await localDatabase().prices.bayiloji.getColumnNames();
    const columnKeys = _.keys(
      _.omit(columns, ["id", "product_id", "price_list_id"])
    );

    const columnKeysToString = (table = null) => {
      return columnKeys.map((o) => (table ? `${table}.${o}` : o)).join(", ");
    };

    const deletePricelistCode =
      "delete from prices_erp WHERE price_list_code not in (select code from price_list)";

    await this.model.raw(deletePricelistCode);

    const bayilojiColumns = columnKeysToString("prices_bayiloji");
    const erpColumns = columnKeysToString("prices_erp");

    const queries = [
      `INSERT INTO prices_bridge (id, ${columnKeysToString()}, operation,product_id,price_list_id)`,
      "SELECT null as 'id', EXP1.*,'UPDATED' AS 'operation','' AS product_id,'' AS price_list_id FROM",
      `(SELECT ${erpColumns} FROM prices_erp EXCEPT SELECT ${bayilojiColumns} FROM prices_bayiloji) AS EXP1`,
      `JOIN prices_bayiloji ON EXP1.product_code = prices_bayiloji.product_code
        and
        EXP1.price_list_code = prices_bayiloji.price_list_code`,
      `UNION ALL`,
      `SELECT NULL as 'id', ${erpColumns}, 'INSERTED' AS 'operation','' AS product_id,'' AS price_list_id
       FROM prices_erp`,
      `LEFT JOIN prices_bayiloji ON prices_erp.product_code = prices_bayiloji.product_code
        and
        prices_erp.price_list_code = prices_bayiloji.price_list_code`,
      `WHERE prices_bayiloji.price_list_code IS NULL`,
    ];

    // console.log(queries.join(" "));

    await this.model.raw(queries.join(" "));

    // const updateProductID =
    //   "UPDATE prices_bridge SET product_id = (SELECT id FROM products_bayiloji AS c WHERE c.code = prices_bridge.product_code) WHERE prices_bridge.product_code IN (SELECT product_code FROM products_bayiloji)";

    const updateProductID =
      "UPDATE prices_bridge SET product_id = c.id FROM products_bayiloji AS c WHERE prices_bridge.product_code = c.code";

    const updateProductListID =
      "UPDATE prices_bridge SET price_list_id = pl.id FROM price_list AS pl WHERE prices_bridge.price_list_code = pl.code";

    // const updateProductListID =
    //      "UPDATE prices_bridge SET price_list_id = (SELECT id FROM price_list AS pl WHERE pl.code = prices_bridge.price_list_code) WHERE prices_bridge.price_list_code IN (SELECT code FROM price_list)";

    await this.model.raw(updateProductID);
    await this.model.raw(updateProductListID);

    const deleteERP = "Delete from prices_bridge where product_id IS NULL ";
    await this.model.raw(deleteERP);
  }
}
