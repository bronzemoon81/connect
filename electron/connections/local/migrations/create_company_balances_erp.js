const {
  CompanyFicheMigrationColumns,
} = require("./create_company_fiches_bayiloji");

exports.up = (knex) => {
  return knex.schema.createTable(
    "company_balances_erp",
    CompanyFicheMigrationColumns
  );
};

exports.down = (knex) => {
  return knex.schema.dropTable("company_balances_erp");
};
