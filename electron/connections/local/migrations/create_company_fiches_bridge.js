const {
  CompanyFicheMigrationColumns,
} = require("./create_company_fiches_bayiloji");

exports.up = (knex) => {
  return knex.schema.createTable("company_fiches_bridge", (t) => {
    t.increments("uuid").primary().unsigned();
    CompanyFicheMigrationColumns(t);
    t.string("operation").nullable();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable("company_fiches_bridge");
};
