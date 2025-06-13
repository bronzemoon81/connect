import { ipcRenderer } from "electron";
import connections from "../../connections";
export default async function () {
  return {
    connections: await connections(),
    reload() {
      ipcRenderer.postMessage("application-reload", true);
    },
    env: () => {
      return { ...process.env };
    },
  };
}
