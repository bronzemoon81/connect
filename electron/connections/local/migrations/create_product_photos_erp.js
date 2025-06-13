const {
  ProductPhotoMigrationColumns,
} = require("./create_product_photos_bayiloji");

exports.up = (knex) => {
  return knex.schema.createTable(
    "product_photos_erp",
    ProductPhotoMigrationColumns
  );
};

exports.down = (knex) => {
  return knex.schema.dropTable("product_photos_erp");
};
