const {
  ProductLotMigrationColumns,
} = require("./create_product_lots_bayiloji");

exports.up = (knex) => {
  return knex.schema.createTable("product_lots_bridge", (t) => {
    t.increments("uuid").primary().unsigned();
    ProductLotMigrationColumns(t);
    t.string("operation").nullable();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable("product_lots_bridge");
};
