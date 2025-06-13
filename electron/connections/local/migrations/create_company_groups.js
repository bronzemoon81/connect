exports.up = (knex) => {
  return knex.schema.createTable("company_groups", (t) => {
    t.string("id");
    t.string("code");
    t.string("title");
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable("company_groups");
};
