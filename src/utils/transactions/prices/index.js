import { ServiceAbstract } from "@/utils/transactions";
import { BayilojiMethod } from "./bayiloji";
import { ServerMethod } from "./server";
import { CompareMethod } from "./compare";
import { EqualizeMethod } from "./equalize";

export class PricesService extends ServiceAbstract {
  name = "prices";

  take = 250;

  async bayiloji() {
    await new BayilojiMethod().process();
    await super.bayiloji();
  }

  async server() {
    await new ServerMethod().process();
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
