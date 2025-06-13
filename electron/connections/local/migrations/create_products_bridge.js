const { ProductMigrationColumns } = require("./create_products_bayiloji");
exports.up = (knex) => {
  return knex.schema.createTable("products_bridge", (t) => {
    t.increments("uuid").primary().unsigned();
    ProductMigrationColumns(t);
    t.string("operation").nullable();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable("products_bridge");
};
