exports.up = (knex) => {
  return knex.schema.createTable("errors", (t) => {
    t.bigIncrements("id").primary().unsigned();
    t.string("uuid").nullable();
    t.string("service");
    t.string("method");
    t.string("hash");
    t.text("request");
    t.text("response");
    t.text("message");
    t.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable("errors");
};
