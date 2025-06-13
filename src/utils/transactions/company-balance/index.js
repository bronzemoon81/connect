import { ServiceAbstract } from "@/utils/transactions";
import { BayilojiMethod } from "./bayiloji";
import { ServerMethod } from "./server";
import { CompareMethod } from "./compare";
import { EqualizeMethod } from "./equalize";
import { localDatabase } from "@/utils/properties/local-database";
import { helper } from "@/utils/properties/helper";
import { serverDatabase } from "@/utils/properties/server-database";

export class CompanyBalanceService extends ServiceAbstract {
  name = "companyBalance";
  serverDate = null;

  async process(methods = []) {
    this.serverDate = serverDatabase().fromDate;

    const localDate = window.localStorage.getItem(`${this.name}Date`) || null;
    if (localDate === this.serverDate) return;

    if (methods.length > 0) this.methods = methods;
    else this.methods = ["bayiloji", "server", "compare", "equalize"];

    this.methods = this.methods.filter((o) => this.expect.indexOf(o) === -1);

    await this.call();

    window.localStorage.setItem(`${this.name}Date`, this.serverDate);
  }

  async bayiloji() {
    await new BayilojiMethod().process();
    await super.bayiloji();
  }

  async server() {
    await new ServerMethod(this.serverDate).process();
    await super.server();
  }

  async compare() {
    await new CompareMethod().process();
    await super.compare();
  }

  async equalize() {
    await new EqualizeMethod().process();
    await super.equalize();
  }
}
