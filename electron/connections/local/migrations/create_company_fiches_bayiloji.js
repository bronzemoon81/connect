const CompanyFicheMigrationColumns = (t) => {
  t.string("id").nullable(); //id
  t.string("sync_id").nullable();
  t.string("document_no").nullable();
  t.string("company_code").nullable();
  t.string("time").nullable();
  t.string("currency_code").nullable();
  t.decimal("currency_rate", 11, 4).nullable();
  t.string("company_currency_code").nullable();
  t.decimal("company_currency_rate", 11, 4).nullable();
  t.decimal("amount", 18, 2).nullable();
  t.string("description").nullable();
};

exports.CompanyFicheMigrationColumns = CompanyFicheMigrationColumns;

exports.up = (knex) => {
  return knex.schema.createTable(
    "company_fiches_bayiloji",
    CompanyFicheMigrationColumns
  );
};

exports.down = (knex) => {
  return knex.schema.dropTable("company_fiches_bayiloji");
};
