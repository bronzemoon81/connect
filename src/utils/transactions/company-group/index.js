import { ServiceAbstract } from "@/utils/transactions";
import { BayilojiMethod } from "./bayiloji";

export class CompanyGroupService extends ServiceAbstract {
  name = "companyGroup";

  expect = ["server", "compare", "equalize"];

  duration = 1000 * 60 * 60 * 24;

  async bayiloji() {
    await new BayilojiMethod().process();
    await super.bayiloji();
  }
}
