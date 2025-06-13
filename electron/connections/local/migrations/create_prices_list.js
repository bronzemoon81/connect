const PriceListColumns = (t) => {
  t.string("id").nullable();
  t.string("code").nullable();
};

exports.PriceListColumns = PriceListColumns;

exports.up = (knex) => {
  return knex.schema.createTable("price_list", PriceListColumns);
};

exports.down = (knex) => {
  return knex.schema.dropTable("price_list");
};
