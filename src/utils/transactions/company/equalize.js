import { localDatabase } from "@/utils/properties/local-database";
import { companyService } from "@/services";
import { Equalize } from "@/utils/transactions/equalize";

export class EqualizeMethod extends Equalize {
  serviceName = "company";
  groups = [];

  saveMethodService = companyService.massSubmit;
  deleteMethodService = companyService.massArchive;

  constructor() {
    super();
    this.bridgeModel = localDatabase().companies.bridge;
    this.bayilojiModel = localDatabase().companies.bayiloji;
  }

  async process() {
    this.groups = await localDatabase().companyGroups.get();
    this.staffCodes = await localDatabase().staff.get();
    await super.process();
  }

  eachItemFormatForSave(item) {
    const groupIndex = _.findIndex(this.groups, { code: item.group_code });
    const staffId = _.findIndex(this.staffCodes, {
      code: item.representative_1,
    });
    // console.log(this.staffCodes);
    return {
      uuid: _.get(item, "uuid"),
      type: _.get(item, "type"),
      title: _.get(item, "title"),
      code: _.get(item, "code"),
      code_sync: _.get(item, "code"),
      address: _.get(item, "address"),
      district: _.get(item, "district"),
      city: _.get(item, "city"),
      country: _.get(item, "country"),
      phone: _.get(item, "phone"),
      email: _.get(item, "email"),
      gsm: _.get(item, "gsm"),
      description_1: _.get(item, "description_1"),
      description_2: _.get(item, "description_2"),
      currency_code: _.get(item, "currency_code"),
      tax_number: _.get(item, "tax_number"),
      tax_office: _.get(item, "tax_office"),
      tc_number: _.get(item, "tc_number"),
      name_surname: _.get(item, "name_surname"),
      due_days: _.get(item, "due_days"),
      group_code: _.get(item, "group_code"),
      group_id: _.get(this.groups, `${groupIndex}.id`) || null,
      representative_1: _.get(this.staffCodes, `${staffId}.id`) || null,
      series: "ERP",
    };
  }
}
