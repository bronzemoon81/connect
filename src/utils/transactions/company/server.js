import { localDatabase } from "@/utils/properties/local-database";
import { Server } from "@/utils/transactions/server";

export class ServerMethod extends Server {
  service = "company";
  primaryKey = "code";

  constructor() {
    super();
    this.model = localDatabase().companies.erp;
  }
}
