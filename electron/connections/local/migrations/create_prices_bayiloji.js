const PriceMigrationColumns = (t) => {
  t.string("id").nullable();
  t.string("price_list_code").nullable();
  t.string("product_code").nullable();
  t.string("price").nullable(); //id
  // t.string("is_vat_included").defaultTo("0");
};

exports.PriceMigrationColumns = PriceMigrationColumns;

exports.up = (knex) => {
  return knex.schema.createTable("prices_bayiloji", PriceMigrationColumns);
};

exports.down = (knex) => {
  return knex.schema.dropTable("prices_bayiloji");
};
