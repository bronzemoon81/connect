import { helper } from "@/utils/properties/helper";
import { mapStores } from "pinia";
import { useSystemStore } from "@/stores/system-store";
import { ToastNotify } from "@/libs/toast-notify";

export const deleteMixin = {
  inject: ["confirmRef"],
  data() {
    return {
      processing: false,
      archiveState: {
        ids: [],
        processingUuid: helper.uuid(),
        chunks: [],
        transactionIds: [],
        pendingTransactionIds: [],
        errors: [],
        type: "",
      },
      archiveServiceMethod: null,
      archiveMassServiceMethod: null,
      unarchiveServiceMethod: null,
      unarchiveMassServiceMethod: null,
      deleteServiceMethod: null,
      deleteMassServiceMethod: null,
    };
  },
  computed: {
    ...mapStores(useSystemStore),
  },
  methods: {
    async nextRecords() {
      this.archiveState.transactionIds = this.archiveState.chunks.shift() || [];
      this.archiveState.pendingTransactionIds = _.flattenDeep(
        this.archiveState.chunks
      );
      if (this.archiveState.transactionIds.length > 0) {
        this.processing = true;
        if (this.archiveState.transactionIds.length === 1)
          await this.singleRecord(this.archiveState.transactionIds[0]);
        else if (this.archiveState.transactionIds.length > 1)
          await this.massRecords(this.archiveState.transactionIds);
        this.processing = false;
        this.nextRecords().finally();
      } else {
        this.systemStore.removeProcessing(this.archiveState.processingUuid);
      }
    },
    async singleRecord(id) {
      const serviceMethod = _.get(
        this,
        `${this.archiveState.type}ServiceMethod`
      );
      if (typeof serviceMethod !== "function") return;

      const result = await serviceMethod(id);
      if (result) {
        const successMethod = _.get(this, `${this.archiveState.type}Success`);
        const failMethod = _.get(this, `${this.archiveState.type}Fail`);
        const finishMethod = _.get(this, `${this.archiveState.type}Finish`);

        if (result.kind === "ok" && typeof successMethod === "function") {
          successMethod(id, result);
        }
        if (result.kind !== "ok") {
          ToastNotify({
            text: result.message,
            className: "error",
            sound: true,
          });
          this.archiveState.errors.push({ id, error: result.message });
          if (typeof failMethod === "function") failMethod(id, result);
        }
        if (typeof finishMethod === "function") finishMethod(id, result);
        this.processingFinish();
      }
    },
    async massRecords(ids) {
      const serviceMethod = _.get(
        this,
        `${this.archiveState.type}MassServiceMethod`
      );
      if (typeof serviceMethod !== "function") return;
      const result = await serviceMethod(ids);
      if (result) {
        const successMethod = _.get(this, `${this.archiveState.type}Success`);
        const failMethod = _.get(this, `${this.archiveState.type}Fail`);
        const finishMethod = _.get(this, `${this.archiveState.type}Finish`);

        if (result.kind === "ok") {
          this.archiveState.errors = [
            ...this.archiveState.errors,
            ...result.data.error,
          ];
          result.data.success.map((item) => {
            if (typeof successMethod === "function")
              successMethod(item, result);
          });
          result.data.error.map((item) => {
            if (typeof failMethod === "function") failMethod(item, result);
          });
        } else {
          ToastNotify({
            text: result.message,
            className: "error",
            sound: true,
          });
        }
        if (typeof finishMethod === "function") finishMethod(ids, result);
        this.processingFinish();
      }
    },
    triggerArchive(ids) {
      if (!this.confirmRef || ids.length === 0 || this.processing) return;
      this.confirmRef.show("danger", {
        text: "Seçilen kayıtlar arşive kaldırılacaktır, işleme devam etmek istiyor musunuz?",
        callback: () => {
          this.prepareState("archive", ids);
        },
      });
    },
    triggerUnarchive(ids) {
      if (!this.confirmRef || ids.length === 0 || this.processing) return;
      this.confirmRef.show("danger", {
        text: "Seçilen kayıtlar arşivden çıkarılacaktır, işleme devam etmek istiyor musunuz?",
        callback: () => {
          this.prepareState("unarchive", ids);
        },
      });
    },
    triggerDelete(ids) {
      if (!this.confirmRef || ids.length === 0 || this.processing) return;
      this.confirmRef.show("danger", {
        text: "Seçilen kayıtlar kalıcı olarak silinecektir, işleme devam etmek istiyor musunuz?",
        subtext: "Yapılan bu işlem geri alınamaz!",
        callback: () => {
          this.prepareState("delete", ids);
        },
      });
    },
    prepareState(type, ids) {
      this.archiveState.ids = ids;
      this.archiveState.transactionIds = [];
      this.archiveState.pendingTransactionIds = [];
      this.archiveState.errors = [];
      this.archiveState.processing = false;
      this.archiveState.chunks = _.chunk(_.cloneDeep(ids), 20);
      this.archiveState.type = type;
      this.systemStore.setProcessing(this.archiveState.processingUuid);
      this.nextRecords().finally();
    },
    processingFinish() {
      ToastNotify({
        type: "success",
        text: "İşleminiz Tamamlandı",
      });
    },
    removeArchiveError(id) {
      this.archiveState.errors = this.archiveState.errors.filter(
        (o) => o.id !== id
      );
    },
  },
};
