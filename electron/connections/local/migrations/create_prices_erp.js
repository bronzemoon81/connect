const { PriceMigrationColumns } = require("./create_prices_bayiloji");

exports.up = (knex) => {
  return knex.schema.createTable("prices_erp", PriceMigrationColumns);
};

exports.down = (knex) => {
  return knex.schema.dropTable("prices_erp");
};
