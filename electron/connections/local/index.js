import knexModule from "knex";
import { join } from "node:path";
import { existsSync, mkdirSync, rmSync } from "node:fs";
import models from "./models";
import _ from "lodash";

const applicationName = import.meta.env.VITE_APP_NAME_SLUG;
const dbPath = process.env.HOME
  ? join(process.env.HOME, applicationName, "db")
  : join(process.env.HOMEDRIVE + process.env.HOMEPATH, applicationName, "db");

export default function (callback) {
  const env = process.env.NODE_ENV || "production";

  let serverConnectionConfig = {};

  if (!existsSync(dbPath)) {
    mkdirSync(dbPath, { recursive: true });
  }

  const configs = {
    development: {
      client: "sqlite3",
      connection: { filename: join(dbPath, "db.sqlite") },
      migrations: {
        tableName: "migrations",
        directory: `./electron/connections/local/migrations`,
      },
      // seeds: {
      //   directory: `./electron/connections/local/seeds`,
      // },
    },
    production: {
      client: "sqlite3",
      connection: { filename: join(dbPath, "db.sqlite") },
      migrations: {
        tableName: "migrations",
        directory: join(__dirname, "../connections/local/migrations"),
      },
      // seeds: {
      //   directory: join(__dirname, "./connections/local/seeds"),
      // },
    },
  };

  let knex = {};
  let eloquentModels = {};

  const startConnection = () => {
    knex = knexModule(configs[env]);
    eloquentModels = models(knex);
  };

  startConnection();

  const resetDatabase = async () => {
    const path = join(dbPath, "db.sqlite");
    if (existsSync(path)) await rmSync(path);
    await knex.destroy();
    startConnection();
    await new Promise((res) => setTimeout(res, 1000));
    const result = await migrateDatabase();
    await resolve();
    return result;
  };

  const migrateDatabase = async () => {
    await knex.migrate.latest().then((results) => results);
  };

  const resolve = async () => {
    serverConnectionConfig = await eloquentModels.settings.first({
      where: {
        type: "server",
      },
    });

    serverConnectionConfig = _.get(serverConnectionConfig, "content") || {};

    let connection = _.get(serverConnectionConfig, "connection");
    let getSelect = "SELECT 1";

    // if (connection == "firebird") {
    //   getSelect = "SELECT 1 FROM RDB$DATABASE";
    // }

    if (typeof callback === "function") {
      callback(
        {
          raw: async (sql, params) =>
            await knex
              .raw(sql, params)
              .then((result) => result)
              .catch((result) => result),

          models: eloquentModels,
          resetDatabase,
          migrateDatabase,
          testConnection: async () =>
            await knex
              .raw(getSelect)
              // .raw("SELECT 1 FROM RDB$DATABASE")
              .then(() => true)
              .catch(() => false),
        },
        serverConnectionConfig,
      );
    }
  };

  knex.migrate.currentVersion().then(async (result) => {
    if (result === "none") await migrateDatabase();
    await resolve();
  });
}
