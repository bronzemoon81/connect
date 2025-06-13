const { ProductMigrationColumns } = require("./create_products_bayiloji");

exports.up = (knex) => {
  return knex.schema.createTable("products_erp", ProductMigrationColumns);
};

exports.down = (knex) => {
  return knex.schema.dropTable("products_erp");
};
