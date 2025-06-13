exports.up = (knex) => {
  return knex.schema.createTable("users", (t) => {
    t.increments("id").primary().unsigned();
    t.string("subdomain");
    t.string("email");
    t.string("password");
    t.timestamp("created_at").defaultTo(knex.fn.now());
    t.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable("users");
};
