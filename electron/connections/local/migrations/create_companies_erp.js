const { CompanyMigrationColumns } = require("./create_companies_bayiloji");

exports.up = (knex) => {
  return knex.schema.createTable("companies_erp", CompanyMigrationColumns);
};

exports.down = (knex) => {
  return knex.schema.dropTable("companies_erp");
};
