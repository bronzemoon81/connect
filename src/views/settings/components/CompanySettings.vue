<template>
  <BaseSettings
    :columns="columns"
    :type="type"
    :run-test-query-validation="runTestQueryValidation"
    class="box"
    :class="{ '!hidden': !isActive }"
    v-if="renderKey"
  >
    <template v-slot:title> Cari Aktarım Ayarları </template>
  </BaseSettings>
</template>

<script>
import BaseSettings from "./BaseSettings.vue";

export default {
  name: "CompanySettings",
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
      return "company";
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
      this.columns = this.$db().companies.erp.getColumnDescriptions();
      this.renderKey = this.$h.uuid();
      this.loaded = true;
    },
    runTestQueryValidation(query) {
      const str = (query || "").toString().trim();

      const hasPerpage = str.indexOf('"@perpage"') > -1;
      const hasOffset = str.indexOf('"@offset"') > -1;
      const hasPage = str.indexOf('"@page"') > -1;

      if (!hasPerpage)
        throw new Error(
          'SQL sorgusunun içinde "@perpage" değişkeni bulunmak zorundadır.'
        );

      if (!hasOffset && !hasPage)
        throw new Error(
          'SQL sorgusunun içinde "@page" veya "@offset" değişkenlerinden bir tanesi bulunmak zorundadır.'
        );
    },
  },
};
</script>
