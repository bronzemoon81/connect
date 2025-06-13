const ProductPhotoMigrationColumns = (t) => {
  t.string("name").nullable();
  t.string("path").nullable();
  t.string("extension").nullable();
  t.integer("size").nullable();
  t.string("updated_at").nullable();
  t.string("code").nullable();
};

exports.ProductPhotoMigrationColumns = ProductPhotoMigrationColumns;

exports.up = (knex) => {
  return knex.schema.createTable(
    "product_photos_bayiloji",
    ProductPhotoMigrationColumns
  );
};

exports.down = (knex) => {
  return knex.schema.dropTable("product_photos_bayiloji");
};
