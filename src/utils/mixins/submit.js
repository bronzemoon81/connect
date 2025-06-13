import { ToastNotify } from "@/libs/toast-notify";
import { IsCompare } from "@/libs/is-compare";
import { ValidationErrors } from "@/libs/validation-errors";

export const submitMixin = {
  data() {
    return {
      processing: false,
      query: {},
      originalQuery: {},
      validationErrors: new ValidationErrors(),
      createServiceMethod: null,
      updateServiceMethod: null,
      visibleSavedNotification: true,
      savedNotificationText: "İşleminiz Başarıyla Gerçekleştirildi",
    };
  },
  computed: {
    isChangedQuery() {
      return (
        this.id &&
        !IsCompare(_.cloneDeep(this.originalQuery), _.cloneDeep(this.query))
      );
    },
    removeKeysIfEmptyValue() {
      return false;
    },
  },
  methods: {
    getOriginalQuery() {
      return _.cloneDeep(this.originalQuery);
    },
    setInitialQuery(params) {
      this.query = _.cloneDeep(params);
      this.originalQuery = _.cloneDeep(params);
    },
    onResetQuery() {
      this.setQuery(this.originalQuery);
    },
    setQuery(params, equalOriginalQuery = false) {
      _.forEach(this.query, (val, key) => {
        if (_.has(params, key)) {
          _.set(this.query, key, _.cloneDeep(_.get(params, key)));
        }
      });

      if (equalOriginalQuery) {
        _.forEach(this.originalQuery, (val, key) => {
          if (_.has(params, key)) {
            _.set(this.originalQuery, key, _.cloneDeep(_.get(params, key)));
          }
        });
        this.validationErrors.clear();
      }
    },
    async submit(recordId) {
      if (this.processing) return;
      this.processing = true;
      this.validationErrors.clear();

      let request = _.cloneDeep(this.query);

      if (
        this.removeKeysIfEmptyValue &&
        this.removeKeysIfEmptyValue.length > 0
      ) {
        this.removeKeysIfEmptyValue.map((k) => {
          if (!_.get(request, k)) _.unset(request, k);
        });
      }

      if (typeof this.formatRequestBeforeSubmit === "function") {
        request = await this.formatRequestBeforeSubmit(request);
      }

      let result = null;
      if (recordId && this.updateServiceMethod)
        result = await this.updateServiceMethod(recordId, request);
      if (!recordId && this.createServiceMethod)
        result = await this.createServiceMethod(request);

      this.processing = false;
      if (result) {
        if (result.kind === "ok") {
          this.setQuery(result.data, true);

          if (this.visibleSavedNotification) {
            ToastNotify({
              type: "success",
              text: this.savedNotificationText,
            });
          }

          if (typeof this.submitSuccess === "function") {
            this.submitSuccess(result);
          }
        }
        if (result.kind !== "ok") {
          ToastNotify({
            text: result.message,
            className: "error",
            sound: true,
          });
          if (result.kind === "validation") {
            this.validationErrors.record(result.fields);
          }
          if (typeof this.submitFail === "function") this.submitFail(result);
        }
        if (typeof this.submitFinish === "function") this.submitFinish(result);
      }
    },
    submitSuccess(result) {},
  },
};
