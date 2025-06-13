import { localDatabase } from "@/utils/properties/local-database";
import { Compare } from "@/utils/transactions/compare";

export class CompareMethod extends Compare {
  constructor() {
    super();
    this.model = localDatabase().companies.bridge;
    this.model.truncate();
  }

  async compare() {
    let columns = await localDatabase().companies.bayiloji.getColumnNames();
    const columnKeys = _.keys(_.omit(columns, ["id"]));

    const columnKeysToString = (table = null) => {
      return columnKeys.map((o) => (table ? `${table}.${o}` : o)).join(", ");
    };

    const bayilojiColumns = columnKeysToString("companies_bayiloji");
    const erpColumns = columnKeysToString("companies_erp");

    const queries = [
      `INSERT INTO companies_bridge (id, ${columnKeysToString()}, operation)`,
      "SELECT null as 'id', EXP1.*,'UPDATED' AS 'operation' FROM",
      `(SELECT ${erpColumns} FROM companies_erp EXCEPT SELECT ${bayilojiColumns} FROM companies_bayiloji) AS EXP1`,
      "JOIN companies_bayiloji ON EXP1.code = companies_bayiloji.code",
      "UNION ALL",
      `SELECT companies_bayiloji.id as 'id', ${bayilojiColumns}, 'DELETED' AS 'operation' FROM companies_bayiloji`,
      "LEFT JOIN companies_erp ON companies_bayiloji.code = companies_erp.code",
      "WHERE companies_erp.code IS NULL",
      "UNION ALL",
      `SELECT null as 'id', ${erpColumns}, 'INSERTED' AS 'operation' FROM companies_erp`,
      "LEFT JOIN companies_bayiloji ON companies_bayiloji.code = companies_erp.code",
      "WHERE companies_bayiloji.code IS NULL",
    ];

    await this.model.raw(queries.join(" "));
  }
}
