const { PriceMigrationColumns } = require("./create_prices_bayiloji");

exports.up = (knex) => {
  return knex.schema.createTable("prices_bridge", (t) => {
    t.increments("uuid").primary().unsigned();
    PriceMigrationColumns(t);
    t.string("operation").nullable();
    t.string("product_id").nullable();
    t.string("price_list_id").nullable();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable("prices_bridge");
};
