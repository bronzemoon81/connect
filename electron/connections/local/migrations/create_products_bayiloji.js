const ProductMigrationColumns = (t) => {
  t.integer("id").nullable();
  t.string("category_code").nullable();
  t.string("product_group_code").nullable();
  t.string("code").nullable();
  t.string("code_sync").nullable();
  t.string("invoice_code").nullable();
  t.string("title").nullable();
  t.string("description_1").nullable();
  t.string("model").nullable();
  t.string("brand").nullable();
  // t.string("color").nullable();
  t.string("color_code").nullable();
  t.string("item_group_1").nullable();
  t.string("item_group_2").nullable();
  t.string("item_group_3").nullable();
  t.string("vat_rate").nullable();
  t.string("warehouse_code").nullable();
  t.string("warehouse_shelf").nullable();
  t.boolean("use_serial_lot").nullable();
  t.boolean("is_divisible").nullable();
  t.string("unit").nullable();
  t.decimal("qty", 11, 8).nullable();
};

exports.ProductMigrationColumns = ProductMigrationColumns;

exports.up = (knex) => {
  return knex.schema.createTable("products_bayiloji", ProductMigrationColumns);
};

exports.down = (knex) => {
  return knex.schema.dropTable("products_bayiloji");
};
