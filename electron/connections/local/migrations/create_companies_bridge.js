const { CompanyMigrationColumns } = require("./create_companies_bayiloji");

exports.up = (knex) => {
  return knex.schema.createTable("companies_bridge", (t) => {
    t.increments("uuid").primary().unsigned();
    CompanyMigrationColumns(t);
    t.string("operation").nullable();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable("companies_bridge"); //.dropTable("companies_erp");
};
