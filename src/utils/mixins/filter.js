import { IsCompare } from "@/libs/is-compare";

export const filterMixin = {
  data() {
    return {
      filterWithoutRoute: false,
      filterVisible: false,
      filterFields: {},
      filterOriginalFields: {},
    };
  },
  computed: {
    filterCount() {
      let count = 0;
      _.forEach(this.filterFields, (val, key) => {
        const cVal = _.cloneDeep(_.get(this.$route.query, key));
        const oVal = _.get(this.filterOriginalFields, key, cVal);
        if (
          ((Array.isArray(cVal) && !_.isEmpty(cVal)) ||
            (!Array.isArray(cVal) && cVal)) &&
          cVal !== oVal &&
          ["page", "perpage", "archive", "sortBy"].indexOf(key) === -1
        ) {
          count++;
        }
      });
      return count;
    },
    visibleArchive() {
      return (_.get(this.filterFields, "archive") || "0") * 1 === 1;
    },
  },
  watch: {
    "$route.query": {
      handler() {
        if (this.filterWithoutRoute) return;
        this.filterFields = this.getRouteMergeFields();
        if (typeof this.fetchRecords === "function") {
          this.fetchRecords(this.formattedQuery()).finally();
        }
      },
      flush: "post",
    },
  },
  mounted() {
    this.initFilterMixin();
  },
  methods: {
    initFilterMixin(query = null) {
      this.filterFields = {
        page: 1,
        perpage: 25,
        archive: 0,
        sortBy: "id:asc",
        ...this.filterFields,
        ...this.filterOriginalFields,
      };
      this.filterOriginalFields = _.cloneDeep(this.filterFields);
      if (!this.filterWithoutRoute) {
        this.filterFields = this.getRouteMergeFields(query);
      }
    },
    changePage(page) {
      _.set(this.filterFields, "page", page);
      if (!this.filterWithoutRoute) {
        this.$router.push({ query: this.formattedQuery(true) }).finally();
      } else if (typeof this.fetchRecords === "function") {
        this.fetchRecords(this.formattedQuery()).finally();
      }
    },
    changePerPage(value) {
      _.set(this.filterFields, "perpage", value);
      if (!this.filterWithoutRoute) {
        this.$router.replace({ query: this.formattedQuery(true) }).finally();
      } else if (typeof this.fetchRecords === "function") {
        this.fetchRecords(this.formattedQuery()).finally();
      }
    },
    changeSortBy(value) {
      _.set(this.filterFields, "sortBy", value);
      if (!this.filterWithoutRoute) {
        this.$router.replace({ query: this.formattedQuery(true) }).finally();
      } else if (typeof this.fetchRecords === "function") {
        this.fetchRecords(this.formattedQuery()).finally();
      }
    },
    changeVisibleArchive(val) {
      _.set(this.filterFields, "page", 1);
      _.set(this.filterFields, "archive", val * 1);
      if (!this.filterWithoutRoute) {
        this.$router.replace({ query: this.formattedQuery(true) }).finally();
      } else if (typeof this.fetchRecords === "function") {
        this.fetchRecords(this.formattedQuery()).finally();
      }
    },
    applyFilter() {
      _.set(this.filterFields, "page", 1);
      if (!this.filterWithoutRoute) {
        this.$router.push({ query: this.formattedQuery(true) }).finally();
      } else if (typeof this.fetchRecords === "function") {
        this.fetchRecords(this.formattedQuery()).finally();
      }
    },
    clearFilter() {
      const original = _.cloneDeep(this.filterOriginalFields);
      this.filterFields = {
        ...original,
        sortBy: _.get(this.filterFields, "sortBy") || _.get(original, "sortBy"),
        perpage:
          _.get(this.filterFields, "perpage") || _.get(original, "perpage"),
        archive:
          _.get(this.filterFields, "archive") || _.get(original, "archive"),
      };
      if (!this.filterWithoutRoute) {
        this.$router.push({ query: this.formattedQuery(true) }).finally();
      } else if (typeof this.fetchRecords === "function") {
        this.fetchRecords(this.formattedQuery()).finally();
      }
    },
    formattedQuery(withSameOriginal = true) {
      const obj = {};
      _.forEach(this.filterFields, (value, key) => {
        if (
          _.isArray(value) &&
          value.length > 0 &&
          (withSameOriginal ||
            !IsCompare(value, _.get(this.filterOriginalFields, key)))
        ) {
          _.set(obj, key, value);
        }

        if (
          !_.isArray(value) &&
          value !== "" &&
          value !== null &&
          value !== undefined &&
          (withSameOriginal || value !== _.get(this.filterOriginalFields, key))
        ) {
          _.set(obj, key, value);
        }
      });
      return obj;
    },
    getRouteMergeFields(query = null) {
      const obj = {};
      _.forEach(_.cloneDeep(this.filterFields), (value, key) => {
        const originalValue = _.cloneDeep(
          _.get(this.filterOriginalFields, `${key}`, "")
        );
        if (!_.get(query || this.$route.query, key)) {
          value = originalValue;
        } else {
          if (
            _.isArray(originalValue) &&
            !_.isArray(_.get(query || this.$route.query, key))
          ) {
            value = [_.get(query || this.$route.query, key)];
          } else {
            value = _.get(query || this.$route.query, key);
          }
        }
        _.set(obj, key, value);
      });
      return obj;
    },
  },
};
