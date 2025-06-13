<template>
  <div class="virtual--table-wrapper">
    <slot name="header"></slot>
    <WaitingTransaction
      :show="processing || downloading"
      class="rounded-lg"
      fixed
    />

    <div class="table-container" v-if="!visibleExcel">
      <div class="overflow-x-auto scrollbar--minimize pb-1">
        <table class="table" v-bind="$attrs">
          <thead>
            <template v-if="loading && list.length === 0">
              <th class="!p-0"></th>
            </template>
            <slot name="thead" v-else></slot>
          </thead>

          <tbody>
            <slot name="tbody-before"></slot>
            <template v-if="list.length === 0">
              <tr v-if="!loading">
                <td
                  colspan="100%"
                  class="text-center font-semibold !py-6 text-slate-400"
                >
                  Aradığınız kriterlere ait kayıt bulunamadı!
                </td>
              </tr>
              <template v-else>
                <tr
                  v-for="i in perpage"
                  class="tr-placeholder"
                  :key="`tr-placeholder-${i}`"
                >
                  <td colspan="100%" :style="{ height: `${itemHeight}px` }">
                    <div
                      class="w-full animate-pulse bg-slate-200/50 rounded-xl"
                    ></div>
                  </td>
                </tr>
              </template>
            </template>
            <TableRow
              v-for="(row, index) in list"
              :item="row"
              :index="index"
              :key="`${uuid}-${row.id}`"
              :processing="processing"
              :transaction-ids="transactionIds"
              :pending-transaction-ids="pendingTransactionIds"
              :errors="errors"
              :remove-error="removeArchiveError"
              :virtual="virtual"
              :height="itemHeight"
            >
              <slot name="row" :index="index" :item="row"></slot>
            </TableRow>
            <slot name="tbody"></slot>
          </tbody>
        </table>
      </div>
    </div>

    <slot name="footer"></slot>

    <div
      class="table-pagination"
      :class="{ 'sticky bottom-6': virtual }"
      v-if="!hiddenPagination"
    >
      <SimplePagination
        :class="{ '!shadow-none': !virtual }"
        :page="page * 1"
        :perpage="perpage * 1"
        :data-length="list.length"
        @update:page="changePage"
        @update:perpage="changePerPage"
      >
        <template v-slot:append>
          <Tippy
            tag="button"
            content="Excel Dosyası İndir"
            class="btn btn-icon !hidden md:!inline-flex btn-white"
            v-if="canDownloadExcel"
            @click="downloadExcel"
          >
            <i class="icon-outline-file-download-rounded"></i>
          </Tippy>
        </template>
      </SimplePagination>
    </div>
  </div>
</template>

<script>
import TableRow from "./Row.vue";

export default {
  name: "TableList",
  components: {
    TableRow,
  },
  props: {
    list: { type: Array, default: [] },
    loading: { type: Boolean, default: false },
    processing: { type: Boolean, default: false },
    page: { default: 1 },
    perpage: { default: 25 },
    transactionIds: { type: Array, default: () => [] },
    pendingTransactionIds: { type: Array, default: () => [] },
    errors: { type: Array, default: () => [] },
    excel: {
      type: Object,
      default: {
        visible: false,
        download: true,
        title: "",
        options: {},
      },
    },
    hiddenPagination: { type: Boolean, default: false },
    virtual: { type: Boolean, default: false },
    itemHeight: {
      type: Number,
      default: 44,
    },
  },
  data() {
    return {
      uuid: this.$h.uuid(),
      visibleExcel: false,
      downloading: false,
      excelRenderKey: this.$h.uuid(),
    };
  },
  computed: {
    canDisplayExcel() {
      return _.get(this.excel, "visible") || false;
    },
    downloadAction() {
      return _.get(this.excel, "download") || true;
    },
    canDownloadExcel() {
      return _.get(this.excel, "visible") || false;
    },
  },
  watch: {
    "excel.options": {
      handler() {
        this.excelRenderKey = this.$h.uuid();
      },
      deep: true,
      flush: "post",
    },
  },
  methods: {
    changePage(val) {
      this.$emit("update:page", val * 1);
    },
    changePerPage(val) {
      this.$emit("update:perpage", val * 1);
    },
    removeArchiveError(id) {
      const index = _.findIndex(this.errors, { id });
      if (index > -1) this.errors.splice(index, 1);
    },
    async downloadExcel() {
      if (!this.downloadAction) return;

      this.downloading = true;
      await this.$nextTick();

      setTimeout(async () => {
        if (typeof this.downloadAction === "function") {
          await this.downloadAction();
          this.downloading = false;
          return;
        }

        const headers = {};
        const columns = _.cloneDeep(_.get(this.excel, "options.columns") || []);
        columns.map((o) => {
          headers[_.get(o, "data")] = _.get(o, "title");
        });

        const instance = this.$excel.basic(headers);
        await instance.process();
        instance.setRows(this.list, "primary");
        await instance.export(
          `${_.get(this.excel, "title") || "Bayiloji"} ${this.$h.formatDate(
            new Date(),
            "yyyy-MM-dd-HH-mm-ss"
          )}`
        );
        this.downloading = false;
      }, 100);
    },
    toggleVisibleExcel() {
      this.visibleExcel = !this.visibleExcel;
      this.$emit("update:visible-excel", this.visibleExcel);
    },
  },
};
</script>
