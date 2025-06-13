import { EqualizeMethod as BaseEqualizeMethod } from "@/utils/transactions/company-fiche/equalize";
import { localDatabase } from "@/utils/properties/local-database";

export class EqualizeMethod extends BaseEqualizeMethod {
  serviceName = "companyBalance";

  constructor() {
    super();
    this.bridgeModel = localDatabase().companyBalances.bridge;
    this.bayilojiModel = localDatabase().companyBalances.bayiloji;
  }

  async process() {
    this.bridgeModel.delete({
      where: {
        amount: 0,
      },
    });

    await super.process();
  }

  eachItemFormatForSave(item) {
    return {
      ...super.eachItemFormatForSave(item),
      series: "ERP-DEVIR",
    };
  }
}
