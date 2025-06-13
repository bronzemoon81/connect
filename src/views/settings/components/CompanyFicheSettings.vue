<template>
  <BaseSettings
    :columns="columns"
    :type="type"
    class="box"
    :run-test-query-validation="runTestQueryValidation"
    :class="{ '!hidden': !isActive }"
    v-if="renderKey"
  >
    <template v-slot:title> Cari Fiş Aktarım Ayarları </template>
  </BaseSettings>
</template>

<script>
import BaseSettings from "./BaseSettings.vue";

export default {
  name: "CompanyFicheSettings",
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
      return "companyFiche";
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
      this.columns = this.$db().companyFiches.erp.getColumnDescriptions();
      this.renderKey = this.$h.uuid();
      this.loaded = true;
    },
    runTestQueryValidation(query) {
      const str = (query || "").toString().trim();

      const hasPerpage = str.indexOf('"@perpage"') > -1;
      const hasOffset = str.indexOf('"@offset"') > -1;
      const hasPage = str.indexOf('"@page"') > -1;
      const hasTime = str.indexOf('"@date"') > -1;

      if (!hasTime)
        throw new Error(
          'SQL sorgusunun içinde "@date" değişkeni bulunmak zorundadır.'
        );

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
