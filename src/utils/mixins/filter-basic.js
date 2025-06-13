export const filterBasicMixin = {
  data() {
    return {
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
          cVal !== oVal
        ) {
          count++;
        }
      });
      return count;
    },
  },
  watch: {
    "$route.query": {
      handler() {
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
        ...this.filterFields,
        ...this.filterOriginalFields,
      };
      this.filterOriginalFields = _.cloneDeep(this.filterFields);
    },
    applyFilter() {
      this.$router.push({ query: this.formattedQuery(true) }).finally();
    },
    clearFilter() {
      const original = _.cloneDeep(this.filterOriginalFields);
      this.filterFields = {
        ...original,
      };
      this.$router.push({ query: this.formattedQuery(true) }).finally();
    },
    formattedQuery() {
      const obj = {};
      _.forEach(this.filterFields, (value, key) => {
        if (_.isArray(value) && value.length > 0) {
          _.set(obj, key, value);
        }

        if (
          !_.isArray(value) &&
          value !== "" &&
          value !== null &&
          value !== undefined
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
