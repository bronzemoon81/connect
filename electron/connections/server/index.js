import _ from "lodash";
import knexModule from "knex";

// const knexFirebirdDialect = require("knex-firebird-dialect").default;

let getSelect = "SELECT 1";
// const getFirebirdConfig = (config = {}) => {
//   getSelect = "SELECT 1 FROM RDB$DATABASE";
//   return {
//     client: knexFirebirdDialect,
//     connection: {
//       host: _.get(config, "ip"),
//       port: parseInt(_.get(config, "port")),
//       user: _.get(config, "username"),
//       password: _.get(config, "password"),
//       database: _.get(config, "database"),
//       lowercase_keys: true,
//     },
//     createDatabaseIfNotExists: false,
//     debug: true,
//   };
// };
const getMysqlConfig = (config = {}) => {
  getSelect = "SELECT 1";
  return {
    client: "mysql",
    connection: {
      host: _.get(config, "ip"),
      port: parseInt(_.get(config, "port")),
      user: _.get(config, "username"),
      password: _.get(config, "password"),
      database: _.get(config, "database"),
    },
  };
};

const getMssqlConfig = (config = {}) => {
  getSelect = "SELECT 1";
  const fullAddress = (_.get(config, "ip") || "").toString().split("\\");
  const server = fullAddress.shift();
  const instanceName = fullAddress.join("\\") || undefined;

  return {
    client: "mssql",
    connection: {
      server: server,
      port: parseInt(_.get(config, "port")),
      user: _.get(config, "username"),
      password: _.get(config, "password"),
      database: _.get(config, "database"),
      options: {
        instanceName,
        connectTimeout: 29000,
        requestTimeout: 90000,
      },
    },
    useNullAsDefault: true,
  };
};

export default function (config = {}) {
  const knexConfig =
    config.connection === "mysql"
      ? getMysqlConfig(config)
      : getMssqlConfig(config);

  // const knexConfig =
  //   config.connection === "mysql"
  //     ? getMysqlConfig(config)
  //     : config.connection === "firebird"
  //       ? getFirebirdConfig(config)
  //       : getMssqlConfig(config);

  const knex = knexModule(knexConfig);

  return {
    config,
    raw: async (sql, params) => knex.raw(sql, params),

    testConnection: async (ctx = null) => {
      if (!ctx) {
        return await knex
          // .raw("select 1")
          .raw(getSelect)
          .then(() => true)
          .catch((err) => {
            console.log(err);
            return false;
          });
      }

      const testKnexConfig =
        ctx.connection === "mysql" ? getMysqlConfig(ctx) : getMssqlConfig(ctx);

      // const testKnexConfig =
      //   ctx.connection === "mysql"
      //     ? getMysqlConfig(ctx)
      //     : ctx.connection === "firebird"
      //       ? getFirebirdConfig(ctx)
      //       : getMssqlConfig(ctx);

      const module = knexModule(testKnexConfig);

      const result = await module
        .raw(getSelect)
        // .raw("SELECT 1")
        .then(() => true)
        .catch((err) => {
          console.log(err);
          return false;
        });

      await module.destroy();

      return result;
    },
  };
}
