import { useTransactionStore } from "@/stores/transaction-store";
import { helper } from "@/utils/properties/helper";
import { serverDatabase } from "@/utils/properties/server-database";
import { localDatabase } from "@/utils/properties/local-database";
import _ from "lodash";

export class Server {
  model = null;
  store = null;
  service = null;
  query = null;
  serverDate = null;
  date = null;
  primaryKey = null;

  takeFromPage = 1000;
  constructor() {
    this.store = useTransactionStore();
  }

  async process() {
    if (!this.store.processing) return;

    await this.fetchFromServerDate();
    const result = await localDatabase().settings.first({
      where: { type: this.service },
    });
    this.query = _.get(result, "content.query");

    await this.truncate();
    await this.fetch();
  }

  async truncate() {
    await this.model.truncate();
  }

  async fetchFromServerDate() {
    this.serverDate = serverDatabase().fromDate;
    this.date = _.cloneDeep(this.serverDate);
  }

  async fetch(page = 1, perpage = this.takeFromPage) {
    const columns = await this.model.getColumnNames();
    const columnKeys = _.keys(_.omit(columns, ["id"]));

    const replacedQuery = await helper.sqlReplaceParameters(this.query, {
      perpage,
      page,
      date: this.date,
    });

    console.warn(replacedQuery);
    const results = await serverDatabase().runSqlQuery(replacedQuery);
    console.log(results);

    if (results instanceof Error) throw results;

    const list = results
      .map((item) => {
        const pureItem = {};
        columnKeys.map((key) => {
          const value = _.get(item, key);
          pureItem[key] = helper.isset(value) ? value : null;
        });
        return this.eachItemFormatForSave(pureItem);
      })
      .filter((item, index, array) => {
        if (!this.primaryKey) return true;
        return (
          _.findIndex(array, { [this.primaryKey]: item[this.primaryKey] }) ===
          index
        );
      });

    await this.deleteSameRecords(list);
    await this.model.insert(list);
    if (results.length === perpage) await this.fetch(page + 1, perpage);
  }

  async deleteSameRecords(list = []) {
    const values = _.map(list, this.primaryKey);
    if (values.length === 0) return;
    for (const chunk of _.chunk(values, 100)) {
      await this.model.delete({ whereIn: { [this.primaryKey]: chunk } });
    }
  }

  eachItemFormatForSave(item) {
    return item;
  }
}
