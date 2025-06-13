import { localDatabase } from "@/utils/properties/local-database";
import { Compare } from "@/utils/transactions/compare";

export class CompareMethod extends Compare {
  constructor() {
    super();
    this.model = localDatabase().companyBalances.bridge;
    this.model.truncate();
  }

  async compare() {
    let columns =
      await localDatabase().companyBalances.bayiloji.getColumnNames();
    const columnKeys = _.keys(_.omit(columns, ["id"]));

    const columnKeysToString = (table = null) => {
      return columnKeys.map((o) => (table ? `${table}.${o}` : o)).join(", ");
    };

    const bayilojiColumns = columnKeysToString("company_balances_bayiloji");
    const erpColumns = columnKeysToString("company_balances_erp");

    const queries = [
      `INSERT INTO company_balances_bridge (id, ${columnKeysToString()}, operation)`,
      `SELECT company_balances_bayiloji.id as 'id', ${bayilojiColumns}, 'DELETED' AS 'operation' FROM company_balances_bayiloji`,
      `LEFT JOIN company_balances_erp ON company_balances_bayiloji.sync_id = company_balances_erp.sync_id`,
      `WHERE company_balances_erp.sync_id IS NULL`,
      `UNION ALL`,
      `SELECT null as 'id', ${erpColumns}, 'INSERTED' AS 'operation' FROM company_balances_erp`,
      `LEFT JOIN company_balances_bayiloji ON  company_balances_bayiloji.sync_id = company_balances_erp.sync_id`,
      `WHERE company_balances_bayiloji.sync_id IS NULL`,
      `UNION ALL`,
      "SELECT null as 'id', EXP1.*,'UPDATED' AS 'operation' FROM",
      `(SELECT ${erpColumns} FROM company_balances_erp EXCEPT SELECT ${bayilojiColumns} FROM company_balances_bayiloji) AS EXP1`,
      "JOIN company_balances_bayiloji ON EXP1.sync_id = company_balances_bayiloji.sync_id",
    ];

    console.log(queries.join(" ").toString());
    await this.model.raw(queries.join(" "));
  }
}
