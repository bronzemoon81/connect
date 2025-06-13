import { helper } from "@/utils/properties/helper";

function serverDatabase() {
  const serverConnection = window.expose.connections.server();

  const connectionType =
    _.get(serverConnection, "config.connection") || "mssql";

  return {
    cron: parseInt(_.get(serverConnection, "config.cron") || "0"),
    fromDate: _.get(serverConnection, "config.fromDate") || null,
    refresh: async () => {
      await window.expose.connections.refresh();
      await helper.sleep(1000);
    },
    testConnection: serverConnection.testConnection,
    testSqlQuery: async (query) => {
      const replacedQuery = await helper.sqlReplaceParameters(query, {
        page: 1,
        perpage: 1,
        date: serverDatabase().fromDate,
      });

      return await serverConnection
        .raw(replacedQuery)
        .then((results) => {
          if (connectionType === "mysql") return _.get(results, "0.0") || null;
          return _.get(results, "0") || null;
        })
        .catch((err) => {
          console.log(err);
          return null;
        });
    },
    runSqlQuery: async (query) => {
      return await serverConnection
        .raw(query)
        .then((results) => {
          if (connectionType === "mysql") return _.get(results, "0") || [];
          return results || [];
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
    },
  };
}

const install = (app) => {
  app.config.globalProperties.$server = serverDatabase;
};

export { install as default, serverDatabase };
