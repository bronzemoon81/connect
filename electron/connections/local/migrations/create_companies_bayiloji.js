const CompanyMigrationColumns = (t) => {
  t.string("id").nullable();
  t.string("type").nullable();
  t.string("title").nullable();
  t.string("code").nullable();
  t.string("code_sync").nullable();
  t.string("address").nullable();
  t.string("district").nullable();
  t.string("city").nullable();
  t.string("country").nullable();
  t.string("phone").nullable();
  t.string("email").nullable();
  t.string("gsm").nullable();
  t.string("description_1").nullable();
  t.string("description_2").nullable();
  t.string("currency_code").nullable();
  t.string("tax_number").nullable();
  t.string("tax_office").nullable();
  t.string("tc_number").nullable();
  t.string("name_surname").nullable();
  t.string("due_days").nullable();
  t.string("group_code").nullable();
  t.string("representative_1").nullable();
};

exports.CompanyMigrationColumns = CompanyMigrationColumns;

exports.up = (knex) => {
  return knex.schema.createTable("companies_bayiloji", CompanyMigrationColumns);
};

exports.down = (knex) => {
  return knex.schema.dropTable("companies_bayiloji"); //.dropTable("companies_erp");
};
