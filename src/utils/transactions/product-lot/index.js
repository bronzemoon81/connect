import { ServiceAbstract } from "@/utils/transactions";
import { BayilojiMethod } from "./bayiloji";
import { ServerMethod } from "./server";
import { CompareMethod } from "./compare";
import { EqualizeMethod } from "./equalize";

export class ProductLotService extends ServiceAbstract {
  name = "productLot";

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
