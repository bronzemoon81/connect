exports.up = (knex) => {
  return knex.schema.createTable("categories", (t) => {
    t.increments("id").primary().unsigned();
    t.string("code");
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable("categories");
};
