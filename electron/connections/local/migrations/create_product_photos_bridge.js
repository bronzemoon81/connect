const {
  ProductPhotoMigrationColumns,
} = require("./create_product_photos_bayiloji");

exports.up = (knex) => {
  return knex.schema.createTable("product_photos_bridge", (t) => {
    t.increments("uuid").primary().unsigned();
    ProductPhotoMigrationColumns(t);
    t.string("operation").nullable();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable("product_photos_bridge");
};
