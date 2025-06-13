import Model from "../../model";

export default class SettingModel extends Model {
  name = "Setting";

  tableName = "settings";

  casts = {
    content: "json",
    status: "boolean",
  };

  async getActiveSqlQueries() {
    return this.knex
      .from(this.tableName)
      .where("status", 1)
      .whereNotIn("type", ["server"])
      .then((results) => this.fromCast(results));
  }

  getInstance() {
    return {
      ...super.getInstance(),
      getActiveSqlQueries: this.getActiveSqlQueries.bind(this),
    };
  }
}
