import { ServiceAbstract } from "@/utils/transactions";
import { BayilojiMethod } from "./bayiloji";
import { CategoryService } from "@/utils/transactions/category";

export class StaffService extends ServiceAbstract {
  name = "staff";

  expect = ["server", "compare", "equalize"];

  duration = 1000 * 60 * 60 * 24;

  async bayiloji() {
    await new BayilojiMethod().process();
    await super.bayiloji();
  }
}
