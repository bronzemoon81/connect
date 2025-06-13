import local from "./local";
import server from "./server";

let localConnection = {};
let serverConnection = {};

export default async function () {
  const connections = {
    local: () => localConnection,
    server: () => serverConnection,
    refresh: () => {
      local((connection, serverConnectionConfig) => {
        localConnection = connection;
        serverConnection = server(serverConnectionConfig);
      });
    },
  };

  connections.refresh();

  return connections;
}
