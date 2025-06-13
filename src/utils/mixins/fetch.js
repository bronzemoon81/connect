import { ToastNotify } from "@/libs/toast-notify";
import { selectionService } from "@/services";

export const fetchMixin = {
  data() {
    return {
      loading: false,
      selected: [],
      list: {
        data: [],
        meta: { current_page: 1, total: 0, per_page: 25 },
      },
      fetchServiceMethod: null,
    };
  },
  computed: {
    selectAll: {
      get() {
        return (
          this.list.data.length > 0 &&
          this.selected.length === this.list.data.length
        );
      },
      set(value) {
        let s = [];
        if (value) {
          s = this.list.data.map((item) => item.id || item.key);
        }
        this.selected = s;
      },
    },
    enabledLoadMore() {
      let perpage = _.get(this.filterFields, "perpage", "0") * 1;
      if (perpage <= 0) perpage = _.get(this.list, "meta.per_page", "0") * 1;
      const max = this.list.meta.current_page * perpage;
      if (this.list.data.length === 0 && this.loading) return true;
      return this.list.data.length >= max;
    },
  },
  methods: {
    async fetchRecords(query, more = false) {
      if (!more) this.list.data = [];
      if (!this.fetchServiceMethod) {
        await this.fetchThroughSelection(query);
      } else {
        this.loading = true;
        const result = await this.fetchServiceMethod(query || {});
        if (result.kind !== "ok") {
          ToastNotify({
            text: result.message,
            className: "error",
            sound: true,
          });
          if (this.fetchFail) this.fetchFail(result);
          if (this.fetchFinish) this.fetchFinish(result);
        } else {
          this.list.data = this.formattedList(_.get(result, "data", []));
          this.list.meta = _.get(result, "meta", { current_page: 1, total: 0 });
          if (this.fetchSuccess) this.fetchSuccess(result);
          if (this.fetchFinish) this.fetchFinish(result);
          this.selected = [];
        }
        this.loading = false;
      }
    },
    async fetchThroughSelection(query) {
      if (this.fetchSelectionQuery) {
        const selectionQuery = _.cloneDeep(
          typeof this.fetchSelectionQuery === "function"
            ? this.fetchSelectionQuery()
            : this.fetchSelectionQuery
        );
        let config = _.cloneDeep(selectionQuery.config);
        if (_.has(selectionQuery.config, "effect")) {
          config = _.cloneDeep(selectionQuery.config.value);
        }
        _.unset(config, "@first");
        const params = {
          [selectionQuery.source]: {
            ...config,
            ...this.getFilterValues(query),
          },
        };
        if (!_.has(config, "@offset")) {
          _.set(
            params,
            [selectionQuery.source, "@paginate"],
            query?.perpage || 25
          );
          _.set(params, [selectionQuery.source, "@page"], query?.page || 1);
        }
        if (_.get(query, "archive", "0") * 1 === 1) {
          _.set(params, `${selectionQuery.source}.@func`, [
            ..._.get(params, `${selectionQuery.source}.@func`, []),
            "onlyTrashed",
          ]);
        }
        this.loading = true;
        const result = await selectionService.fetch(
          params,
          selectionQuery.withoutQueue || false
        );
        try {
          if (result.kind !== "ok") {
            ToastNotify({
              text: result.message,
              className: "error",
              sound: true,
            });
            if (this.fetchFail) this.fetchFail(result);
            if (this.fetchFinish) this.fetchFinish(result);
          } else {
            const { data = [], ...meta } = result.data[selectionQuery.source];
            this.list.data = [...this.list.data, ...this.formattedList(data)];
            this.list.meta = meta;
            if (this.fetchSuccess) this.fetchSuccess(result);
            if (this.fetchFinish) this.fetchFinish(result);
            this.selected = [];
          }
        } catch (e) {
          console.error(e);
        } finally {
          this.loading = false;
        }
      }
    },
    formattedList(list) {
      return list.map((item) => {
        if (typeof this.formattedListItem === "function")
          return this.formattedListItem(item);
        return item;
      });
    },
    getFilterValues(query) {
      const params = {};
      if (this.fetchSelectionQuery) {
        const selectionQuery =
          typeof this.fetchSelectionQuery === "function"
            ? this.fetchSelectionQuery()
            : this.fetchSelectionQuery;

        _.set(params, "@where", _.get(selectionQuery, "config.@where") || {});
        if (selectionQuery.filterFormat && query) {
          Object.keys(query).map((key) => {
            const value = _.get(selectionQuery, `filterFormat.${key}`, "");
            if (value) {
              _.set(params, `${value}`, query[key]);
            }
          });
        }
      }
      return params;
    },
    fetchSuccess() {},
    fetchFail() {},
    fetchFinish() {},
  },
};
