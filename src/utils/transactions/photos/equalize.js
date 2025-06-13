import { localDatabase } from "@/utils/properties/local-database";
import { Equalize } from "@/utils/transactions/equalize";
import { useTransactionStore } from "@/stores/transaction-store";
import { helper } from "@/utils/properties/helper";
import axios from "axios";
import { useErrorStore } from "@/stores/error-store";
import { useAuthStore } from "@/stores/auth-store";
import { useSystemStore } from "@/stores/system-store";
import { photoService } from "@/services/photo";

export class EqualizeMethod {
  tenant = "";
  token = "";

  constructor() {
    this.store = useTransactionStore();
    this.errorStore = useErrorStore();
    this.bridgeModel = localDatabase().productPhotos.bridge;
    this.bayilojiModel = localDatabase().productPhotos.bayiloji;
    const authStore = useAuthStore();
    this.tenant = authStore.tenant();
    this.token = authStore.token();
  }

  async process() {
    if (!this.store.processing) return;
    // const transactionStore = useTransactionStore();
    // this.transactionId = transactionStore.identifier;
    await this.chunk("INSERTED");
  }

  async chunk(operation) {
    if (!this.store.processing) return;

    const totalCount = await this.bridgeModel.count();
    this.store.setCount(this.serviceName, "equalize", totalCount);

    const records = await this.bridgeModel.paginate(0, this.take, {
      operation,
    });

    if (records.length === 0) return;
    await this.saveRecords(records);
    return;
    await helper.sleep(1000);
    await this.chunk(operation);
  }

  async commitSendedFile(sign, file) {
    var response = "";
    try {
      // response = await axios.post(
      //   `https://tr-v4-api.bayiloji.com/api/files`,
      //   {
      //     tags: "connect",
      //     uuid: sign.uuid,
      //     name: file.name,
      //     size: file.size,
      //     product_code: file.code,
      //   },
      //   {
      //     headers: {
      //       Accept: "application/vnd.api+json",
      //       "x-tenant": this.tenant,
      //       "Content-Type": "application/json",
      //       Authorization: "Bearer " + this.token,
      //     },
      //   }
      // );
      response = await photoService.commitSendedFile(sign, file);
    } catch (error) {
      console.error("İstekte bir hata oluştu:", error);
      response = error;
    }
    return response;
  }

  async getSignedURL(count) {
    try {
      const response = await photoService.getSignedURL({
        count: count,
      });

      return _.get(response, "data");
    } catch (error) {
      console.error("İstekte bir hata oluştu:", error);
    }
  }

  async sendPhoto(photo, sign) {
    const blob = await window.filesData.getFileBlob(photo.path);
    await this.uploadToS3(sign, blob);
    return await this.commitSendedFile(sign, photo);
  }

  async saveRecords(records = []) {
    const sign = await this.getSignedURL(records.length);
    for (let i = 0; i < records.length; i++) {
      const result = await this.sendPhoto(records[i], sign[i]);
      console.log("result", result);

      if (result.kind == "ok") {
        const { uuid, operation, ...rest } = records[i];
        await this.bayilojiModel.create(rest);
      }
      // todo: Hata yazdırma olayına bakalım
    }
  }

  async uploadToS3(sign, blob) {
    try {
      const response = await axios.put(sign.url, blob, {
        headers: {
          "Content-Type": "image/jpeg",
        },
      });

      // const response = await photoService.uploadToS3(sign.url, blob);

      return response;
    } catch (error) {
      console.error("Dosya yüklenirken bir hata oluştu:", error);
      throw error;
    }
  }
}
