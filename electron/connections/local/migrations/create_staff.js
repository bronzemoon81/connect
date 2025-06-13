exports.up = (knex) => {
  return knex.schema.createTable("staff", (t) => {
    t.increments("id").primary().unsigned();
    t.string("code");
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable("staff");
};
