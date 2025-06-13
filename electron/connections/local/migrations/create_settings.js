exports.up = (knex) => {
  return knex.schema.createTable("settings", (t) => {
    t.string("type").unique();
    t.text("content").nullable();
    t.boolean("status").defaultTo(true);
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable("settings");
};
