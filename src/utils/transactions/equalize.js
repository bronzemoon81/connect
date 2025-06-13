import { useTransactionStore } from "@/stores/transaction-store";
import { helper } from "@/utils/properties/helper";
import { useErrorStore } from "@/stores/error-store";

export class Equalize {
  transactionId = null;
  serviceName = null;
  bridgeModel = null;
  bayilojiModel = null;

  saveMethodService = null;
  deleteMethodService = null;

  store = null;
  errorStore = null;

  take = 20;

  constructor() {
    this.store = useTransactionStore();
    this.errorStore = useErrorStore();
  }

  async process() {
    if (!this.store.processing) return;

    const transactionStore = useTransactionStore();
    this.transactionId = transactionStore.identifier;

    for (const operation of ["INSERTED", "UPDATED", "DELETED"]) {
      await this.chunk(operation);
    }
  }

  async chunk(operation) {
    if (!this.store.processing) return;

    const totalCount = await this.bridgeModel.count();
    this.store.setCount(this.serviceName, "equalize", totalCount);

    const records = await this.bridgeModel.paginate(0, this.take, {
      operation,
    });

    if (records.length === 0) return;

    if (operation === "DELETED") await this.deleteRecords(records);
    else await this.saveRecords(records);

    await helper.sleep(1000);
    await this.chunk(operation);
  }

  async extractLinesContainingErrors(records, itemCallback) {
    const newRecords = [];
    const errorRecordIds = [];
    records.map((item) => {
      const data = itemCallback(item);
      const hash = helper.md5(
        JSON.stringify(_.cloneDeep(_.omit(data, "uuid")))
      );

      if (this.errorStore.hasHash(hash)) {
        errorRecordIds.push(item.uuid);
        return;
      }

      newRecords.push(data);
    });

    if (errorRecordIds.length > 0) {
      await this.bridgeModel.delete({ whereIn: { uuid: errorRecordIds } });
    }

    return newRecords;
  }

  async saveRecords(records = []) {
    if (typeof this.saveMethodService !== "function") return;
    let newRecords = await this.collectRecords(records);

    if (newRecords.length === 0) return;

    const result = await this.saveMethodService({
      if_exists: 1,
      if_not_exists: 1,
      if_update_qty: 1,
      rows: newRecords,
    });

    await this.serviceResponse(result, newRecords, async (item) => {
      const index = _.findIndex(records, { uuid: item.uuid });
      if (index > -1)
        await this.bayilojiModel.create({ ...records[index], id: item.id });
    });
  }

  async deleteRecords(records = []) {
    if (typeof this.deleteMethodService !== "function") return;

    records = records.map(this.eachItemFormatForDelete.bind(this));
    if (records.length === 0) return;

    const result = await this.deleteMethodService(records.map((o) => o.id));

    await this.serviceResponse(result, records);
  }

  async serviceResponse(result, records, successItemCallback) {
    let deleteIndexes = [];
    if (result instanceof Error) throw result;
    else if (result.kind === "unauthorized") throw new Error(result.message);
    else if (result.kind === "validation") {
      const validationFieldKeys = _.keys(result.fields);

      for (const index in records) {
        const errors = {};
        validationFieldKeys
          .filter((o) => o.indexOf(`rows.${index}`) > -1)
          .map((o) => {
            const key = _.get((o || "").toString().split("."), 2);
            _.set(errors, key, _.get(result.fields, o) || []);
          });

        if (Object.keys(errors).length > 0) {
          this.errorStore.insert({
            uuid: this.transactionId,
            service: this.serviceName,
            method: "equalize",
            request: _.omit(records[index], ["uuid"]),
            response: errors,
            message: "Veri Doğrulama Hatası Aldınız.",
          });
        }
      }

      const anyRowValidation =
        validationFieldKeys.filter((o) => o.indexOf(`rows.`) > -1).length > 0;

      if (anyRowValidation) {
        deleteIndexes = _.uniq(
          validationFieldKeys.map((o) =>
            parseInt(_.get((o || "").toString().split("."), 1))
          )
        );
      } else {
        this.errorStore.insert({
          uuid: this.transactionId,
          service: this.serviceName,
          method: "equalize",
          request: null,
          response: null,
          message: "Veri Doğrulama Hatası Aldınız.",
        });
      }
    } else if (result.kind !== "ok") {
      for (const record of records) {
        this.errorStore.insert({
          uuid: this.transactionId,
          service: this.serviceName,
          method: "equalize",
          request: _.omit(record, ["uuid"]),
          response: null,
          message: result.message,
        });
      }
    } else {
      const { success = [], error = [] } = result.data;

      for (const successItem of success) {
        let id = _.isObject(successItem) ? successItem.id : successItem;
        let uuid = _.isObject(successItem) ? successItem.uuid : null;

        const recordIndex = uuid
          ? _.findIndex(records, { uuid })
          : _.findIndex(records, { id });

        const record = _.cloneDeep(_.get(records, recordIndex));
        if (!record) continue;

        if (id) await this.bayilojiModel.delete({ where: { id } });
        if (typeof successItemCallback === "function") {
          await successItemCallback({ ...record, id, uuid });
        }
      }

      for (const errorItem of error) {
        let id = _.isObject(errorItem) ? errorItem.id : errorItem;
        let uuid = _.isObject(errorItem) ? errorItem.uuid : null;

        const recordIndex = uuid
          ? _.findIndex(records, { uuid })
          : _.findIndex(records, { id });

        const record = _.cloneDeep(_.get(records, recordIndex));
        if (!record) continue;

        this.errorStore.insert({
          uuid: this.transactionId,
          service: this.serviceName,
          method: "equalize",
          request: _.omit(record, ["uuid"]),
          response: null,
          message: errorItem.text || "",
        });
      }
    }

    const deleteRecords = records.filter((o, i) => {
      return deleteIndexes.length === 0 || deleteIndexes.indexOf(i) > -1;
    });

    await this.bridgeModel.delete({
      whereIn: { uuid: _.flatMap(deleteRecords, "uuid") },
    });
  }

  async collectRecords(records = []) {
    return await this.extractLinesContainingErrors(
      records,
      this.eachItemFormatForSave.bind(this)
    );
  }

  eachItemFormatForSave(item) {
    return item;
  }

  eachItemFormatForDelete(item) {
    return item;
  }
}
