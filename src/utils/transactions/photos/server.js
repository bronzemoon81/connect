import { localDatabase } from "@/utils/properties/local-database";
import { Server } from "@/utils/transactions/server";
import _ from "lodash";

export class ServerMethod extends Server {
  service = "photos";
  primaryKey = "id";

  constructor() {
    super();
    this.model = localDatabase().productPhotos.erp;
  }

  async process() {
    const data = await localDatabase().settings.first({
      where: { type: "photo" },
    });
    const path = _.get(data.content, "path") || "";
    const list = await window.filesData.listFilesInFolder(path);
    console.log({ list });
    await this.model.truncate();
    await this.model.insert(list);
  }
}

// const x=await window.filesData.listFilesInFolder(this.path);
