import { localDatabase } from "@/utils/properties/local-database";
import { Compare } from "@/utils/transactions/compare";

export class CompareMethod extends Compare {
  constructor() {
    super();
    this.model = localDatabase().companyFiches.bridge;
    this.model.truncate();
  }

  async compare() {
    let columns = await localDatabase().companyFiches.bayiloji.getColumnNames();
    const columnKeys = _.keys(_.omit(columns, ["id"]));

    const columnKeysToString = (table = null) => {
      return columnKeys.map((o) => (table ? `${table}.${o}` : o)).join(", ");
    };

    const bayilojiColumns = columnKeysToString("company_fiches_bayiloji");
    const erpColumns = columnKeysToString("company_fiches_erp");

    const queries = [
      `INSERT INTO company_fiches_bridge (id, ${columnKeysToString()}, operation)`,
      `SELECT company_fiches_bayiloji.id as 'id', ${bayilojiColumns}, 'DELETED' AS 'operation' FROM company_fiches_bayiloji`,
      `LEFT JOIN company_fiches_erp ON company_fiches_bayiloji.sync_id = company_fiches_erp.sync_id`,
      `WHERE company_fiches_erp.sync_id IS NULL`,
      `UNION ALL`,
      `SELECT null as 'id', ${erpColumns}, 'INSERTED' AS 'operation' FROM company_fiches_erp`,
      `LEFT JOIN company_fiches_bayiloji ON  company_fiches_bayiloji.sync_id = company_fiches_erp.sync_id`,
      `WHERE company_fiches_bayiloji.sync_id IS NULL`,
      `UNION ALL`,
      "SELECT null as 'id', EXP1.*,'UPDATED' AS 'operation' FROM",
      `(SELECT ${erpColumns} FROM company_fiches_erp EXCEPT SELECT ${bayilojiColumns} FROM company_fiches_bayiloji) AS EXP1`,
      "JOIN company_fiches_bayiloji ON EXP1.sync_id = company_fiches_bayiloji.sync_id",
    ];

    await this.model.raw(queries.join(" "));
  }
}
