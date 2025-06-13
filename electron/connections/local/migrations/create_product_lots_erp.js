const {
  ProductLotMigrationColumns,
} = require("./create_product_lots_bayiloji");

exports.up = (knex) => {
  return knex.schema.createTable(
    "product_lots_erp",
    ProductLotMigrationColumns
  );
};

exports.down = (knex) => {
  return knex.schema.dropTable("product_lots_erp");
};
