<template>
  <BaseSettings
    :columns="columns"
    :type="type"
    class="box"
    :run-test-query-validation="runTestQueryValidation"
    :class="{ '!hidden': !isActive }"
    v-if="renderKey"
  >
    <template v-slot:title> Cari Bakiye Ayarları </template>
  </BaseSettings>
</template>

<script>
import BaseSettings from "./BaseSettings.vue";

export default {
  name: "CompanyBalanceSettings",
  components: { BaseSettings },
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loaded: false,
      renderKey: null,
      columns: {},
    };
  },
  computed: {
    type() {
      return "companyBalance";
    },
  },
  watch: {
    isActive: {
      handler(val) {
        if (val && !this.loaded) this.initComponent();
      },
      flush: "post",
    },
  },
  mounted() {
    if (this.isActive && !this.loaded) this.initComponent();
  },
  methods: {
    initComponent() {
      this.columns = this.$db().companyBalances.erp.getColumnDescriptions();
      this.renderKey = this.$h.uuid();
      this.loaded = true;
    },
    runTestQueryValidation(query) {
      const str = (query || "").toString().trim();

      const hasTime = str.indexOf('"@date"') > -1;

      if (!hasTime)
        throw new Error(
          'SQL sorgusunun içinde "@date" değişkeni bulunmak zorundadır.'
        );
    },
  },
};
</script>
