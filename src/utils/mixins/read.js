import { ToastNotify } from "@/libs/toast-notify";
import { selectionService } from "@/services";

export const readMixin = {
  data() {
    return {
      loading: false,
      readData: null,
      readServiceMethod: null,
    };
  },
  methods: {
    setData(value) {
      this.readData = _.cloneDeep(value);
    },
    mergeData(value) {
      this.readData = {
        ...(this.readData || {}),
        ...(value || {}),
      };
    },
    async fetchRecord(id = null) {
      if (!this.readServiceMethod) {
        await this.fetchThroughSelection(id);
      } else {
        this.loading = true;
        const result = await this.readServiceMethod(id || this.id);
        if (result.kind !== "ok") {
          ToastNotify({
            text: result.message,
            className: "error",
            sound: true,
          });
          if (typeof this.readFail === "function") this.readFail(result);
        } else {
          this.readData = _.get(result, "data");
          if (typeof this.readSuccess === "function") this.readSuccess(result);
        }
        this.loading = false;
      }
    },
    async fetchThroughSelection(id = null) {
      if (this.readSelectionQuery) {
        const selectionQuery =
          typeof this.readSelectionQuery === "function"
            ? this.readSelectionQuery()
            : this.readSelectionQuery;
        let config = _.cloneDeep(selectionQuery.config);
        if (_.has(selectionQuery.config, "effect")) {
          config = _.cloneDeep(selectionQuery.config.value);
        }
        _.unset(config, "@get");
        _.unset(config, "@page");
        _.unset(config, "@paginate");

        _.set(config, "@first", true);
        _.set(config, "@where.id", id || this.id);

        const params = {
          [selectionQuery.source]: config,
        };
        this.loading = true;
        const result = await selectionService.fetch(params);
        try {
          if (result.kind !== "ok") {
            ToastNotify({
              text: result.message,
              className: "error",
              sound: true,
            });
            if (typeof this.readFail === "function") this.readFail(result);
          } else {
            this.readData = _.get(result.data, `${selectionQuery.source}`);
            if (typeof this.readSuccess === "function")
              this.readSuccess(result);
          }
        } catch (e) {
          console.error(e);
        } finally {
          this.loading = false;
        }
      }
    },
  },
};
