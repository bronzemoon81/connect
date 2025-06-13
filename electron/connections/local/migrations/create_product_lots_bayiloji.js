const ProductLotMigrationColumns = (t) => {
  t.string("id").nullable();
  t.string("lot_id").primary().unique();
  t.string("product_code");
  t.decimal("qty").nullable();
  t.string("warehouse_code").nullable();
  t.string("warehouse_shelf").nullable();
};

exports.ProductLotMigrationColumns = ProductLotMigrationColumns;

exports.up = (knex) => {
  return knex.schema.createTable(
    "product_lots_bayiloji",
    ProductLotMigrationColumns
  );
};

exports.down = (knex) => {
  return knex.schema.dropTable("product_lots_bayiloji");
};
