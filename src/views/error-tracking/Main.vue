<template>
  <div class="container p-4">
    <teleport to="#top-navigation__icon">
      <i class="icon-duotone-bug"></i>
    </teleport>

    <teleport to="#top-navigation__title">
      <span>Oluşan Hatalar</span>
    </teleport>

    <teleport to="#top-navigation__description">
      <span>
        Uygulama & Bayiloji arasında gerçekleşen işlemler sırasında oluşan
        hataları buradan görebilirsiniz.
      </span>
    </teleport>

    <Modal
      size="modal-lg"
      :show="selectedIndex > -1"
      @hidden="() => (selectedIndex = -1)"
    >
      <ModalHeader class="gap-2 flex justify-between">
        <div class="btn-group">
          <button
            class="btn btn-secondary"
            :disabled="selectedIndex <= 0"
            @click="selectedIndex--"
          >
            Önceki
          </button>
          <button
            class="btn btn-secondary"
            :disabled="selectedIndex >= list.data.length - 1"
            @click="selectedIndex++"
          >
            Sonraki
          </button>
        </div>
        <button class="btn btn-danger-soft" @click="selectedIndex = -1">
          Kapat
        </button>
      </ModalHeader>
      <ModalBody v-if="selectedItem" class="flex flex-col gap-2">
        <div class="flex gap-4">
          <div class="font-bold w-36 flex-shrink-0">Satır No:</div>
          <div class="flex-1">{{ selectedIndex + 1 }}</div>
        </div>
        <div class="flex gap-4">
          <div class="font-bold w-36 flex-shrink-0">Servis:</div>
          <div class="flex-1">{{ selectedItem.service_text }}</div>
        </div>
        <div class="flex gap-4">
          <div class="font-bold w-36 flex-shrink-0">İşlem:</div>
          <div class="flex-1">{{ selectedItem.method_text }}</div>
        </div>
        <div class="flex gap-4">
          <div class="font-bold w-36 flex-shrink-0">Hata Mesajı:</div>
          <div class="flex-1">{{ selectedItem.message }}</div>
        </div>
        <div class="flex gap-4">
          <div class="font-bold w-36 flex-shrink-0">İstek (Request)</div>
          <div class="flex-1">
            <AceJSONEditor :model-value="requestJSON" readonly />
          </div>
        </div>
        <div class="flex gap-4">
          <div class="font-bold w-36 flex-shrink-0">Cevap (Response)</div>
          <div class="flex-1">
            <AceJSONEditor :model-value="responseJSON" readonly />
          </div>
        </div>
      </ModalBody>
    </Modal>

    <div class="btn-group justify-end mb-4">
      <button
        class="btn btn-danger-soft font-semibold gap-2"
        @click="deleteAllRecords()"
      >
        <span>Hepsini Temizle</span>
        <i class="icon-outline-trash"></i>
      </button>

      <button
        class="btn btn-danger-soft font-semibold gap-2"
        @click="triggerDelete(selected)"
        v-if="selected.length > 0"
      >
        <span>Temizle</span>
        <i class="icon-outline-trash"></i>
      </button>
      <button
        class="btn btn-secondary font-semibold gap-2"
        @click="initComponent"
      >
        <span>Yenile</span>
        <i class="icon-outline-refresh"></i>
      </button>
    </div>
    <TableList
      virtual
      :list="list.data"
      :loading="loading"
      :page="$_.get(filterFields, 'page', 1) * 1"
      :perpage="$_.get(filterFields, 'perpage', 0) * 1"
      @update:page="changePage"
      @update:perpage="changePerPage"
      :processing="processing"
      :transaction-ids="archiveState.transactionIds"
      :pending-transaction-ids="archiveState.pendingTransactionIds"
      :errors="archiveState.errors"
    >
      <template v-slot:thead v-if="list.data.length > 0">
        <th class="whitespace-nowrap"></th>
        <th class="w-12 text-center">
          <input
            class="form-check-input form-control-lg"
            type="checkbox"
            v-model="selectAll"
          />
        </th>
        <th class="whitespace-nowrap">Servis</th>
        <th class="whitespace-nowrap">İşlem</th>
        <th>Hata Mesajı</th>
        <th class="whitespace-nowrap text-right">Tarih</th>
      </template>

      <template v-slot:row="{ item, index }">
        <td
          @click="onSelect(index)"
          class="w-0 whitespace-nowrap cursor-pointer text-sm"
        >
          <div class="w-8">#{{ index + 1 }}</div>
        </td>
        <td class="text-center">
          <input
            class="form-check-input form-control-lg"
            type="checkbox"
            v-model="selected"
            :value="item.id"
          />
        </td>
        <td
          @click="onSelect(index)"
          class="w-0 whitespace-nowrap cursor-pointer font-bold"
        >
          <div class="w-32 truncate">
            {{ item.service_text }}
          </div>
        </td>
        <td
          @click="onSelect(index)"
          class="w-0 whitespace-nowrap cursor-pointer"
        >
          <div class="w-72 truncate">
            {{ item.method_text }}
          </div>
        </td>
        <td @click="onSelect(index)" class="min-w-[250px] cursor-pointer">
          <div class="line-clamp-1">
            {{ item.message }}
          </div>
        </td>
        <td
          @click="onSelect(index)"
          class="w-0 whitespace-nowrap cursor-pointer text-right"
        >
          <div class="w-40 truncate">
            {{ $h.formatDate(item.created_at) }}
          </div>
        </td>
      </template>
    </TableList>
    <!--      <div class="btn-group mb-4">-->
    <!--        <button class="w-full btn btn-secondary gap-2" @click="initComponent">-->
    <!--          <i class="icon-outline-refresh"></i>-->
    <!--          <span>Listeyi Yenile</span>-->
    <!--        </button>-->
    <!--        <button-->
    <!--          class="w-full btn btn-pending-soft gap-2"-->
    <!--          @click="deleteAllRecords"-->
    <!--        >-->
    <!--          <span>Listeyi Temizle</span>-->
    <!--          <i class="icon-outline-trash"></i>-->
    <!--        </button>-->
    <!--      </div>-->
    <!--      <div class="overflow-x-auto" v-if="list.data.length > 0">-->
    <!--        <table class="table table-sm table-secondary text-sm">-->
    <!--          <thead>-->
    <!--            <th class="whitespace-nowrap">No</th>-->
    <!--            <th class="whitespace-nowrap">Servis</th>-->
    <!--            <th class="whitespace-nowrap">İşlem</th>-->
    <!--            <th>Hata Mesajı</th>-->
    <!--            <th class="whitespace-nowrap text-right">Tarih</th>-->
    <!--          </thead>-->
    <!--          <tbody>-->
    <!--            <template v-for="(item, index) in list.data">-->
    <!--              <tr v-if="index < 100">-->
    <!--                <td-->
    <!--                  @click="onSelect(index)"-->
    <!--                  class="whitespace-nowrap cursor-pointer"-->
    <!--                >-->
    <!--                  #{{ index + 1 }}-->
    <!--                </td>-->
    <!--                <td-->
    <!--                  @click="onSelect(index)"-->
    <!--                  class="whitespace-nowrap cursor-pointer font-bold"-->
    <!--                >-->
    <!--                  {{ item.service_text }}-->
    <!--                </td>-->
    <!--                <td-->
    <!--                  @click="onSelect(index)"-->
    <!--                  class="whitespace-nowrap cursor-pointer"-->
    <!--                >-->
    <!--                  {{ item.method_text }}-->
    <!--                </td>-->
    <!--                <td @click="onSelect(index)" class="cursor-pointer">-->
    <!--                  <div class="line-clamp-3">-->
    <!--                    {{ item.message }}-->
    <!--                  </div>-->
    <!--                </td>-->
    <!--                <td-->
    <!--                  @click="onSelect(index)"-->
    <!--                  class="whitespace-nowrap cursor-pointer text-right"-->
    <!--                >-->
    <!--                  {{ $h.formatDate(item.created_at) }}-->
    <!--                </td>-->
    <!--              </tr>-->
    <!--            </template>-->
    <!--          </tbody>-->
    <!--        </table>-->
    <!--      </div>-->
    <!--      <div v-else class="alert alert-success-soft text-green-900">-->
    <!--        <div class="font-bold text-2xl">Harika!</div>-->
    <!--        <div class="font-medium">-->
    <!--          Uygulama & Bayiloji arasında gerçekleşen veri transferlerinde herhangi-->
    <!--          bir hata gözükmüyor.-->
    <!--        </div>-->
    <!--      </div>-->
  </div>
</template>
<script>
import { defineComponent } from "vue";
import { mapStores } from "pinia";
import { useSystemStore } from "@/stores/system-store";
import { useTransactionStore } from "@/stores/transaction-store";
import { fetchMixin } from "@/utils/mixins/fetch";
import { filterMixin } from "@/utils/mixins/filter";
import { localDatabase } from "@/utils/properties/local-database";
import { deleteMixin } from "@/utils/mixins/delete";
import AceJSONEditor from "@/components/ace-json-editor/Main.vue";

export default defineComponent({
  name: "ErrorTracking",
  components: { AceJSONEditor },
  mixins: [fetchMixin, filterMixin, deleteMixin],
  data() {
    return {
      fetchServiceMethod: this.fetchService,
      deleteServiceMethod: this.deleteService,
      deleteMassServiceMethod: this.massDeleteService,
      selectedIndex: -1,
    };
  },
  computed: {
    selectedItem() {
      return _.get(this.list.data, this.selectedIndex);
    },
    transactionProcessing() {
      return this.transactionStore.processing;
    },
    requestJSON() {
      const request = _.get(this.selectedItem, "request");
      if (_.isObject(request)) return JSON.stringify(request, null, "\t");
      return request;
    },
    responseJSON() {
      const response = _.get(this.selectedItem, "response");
      if (_.isObject(response)) return JSON.stringify(response, null, "\t");
      return response;
    },
    ...mapStores(useSystemStore, useTransactionStore),
  },
  watch: {
    transactionProcessing: {
      handler() {
        this.initComponent();
      },
      flush: "post",
    },
  },
  mounted() {
    this.initComponent();
  },
  methods: {
    async initComponent() {
      this.fetchRecords(this.formattedQuery());

    },
    formattedListItem(item) {
      return {
        ...item,
        request_text: _.isObject(item.request)
          ? JSON.stringify(item.request)
          : item.request,
        response_text: _.isObject(item.response)
          ? JSON.stringify(item.response)
          : item.response,
        service_text: this.transactionStore.serviceText(item.service),
        method_text: this.transactionStore.methodText(item.method),
      };
    },
    async deleteAllRecords() {
      this.loading = true;
      await localDatabase().errors.truncate();
      this.initComponent();
      // await localDatabase().companies.bayiloji.truncate();
      // await localDatabase().companies.erp.truncate();
    },
    onSelect(index) {
      this.selectedIndex = index;
    },
    async fetchService(params) {
      const offset =
        this.$h.isset(params.perpage) && this.$h.isset(params.page)
          ? params.perpage * (params.page - 1)
          : null;

      return {
        kind: "ok",
        data: await localDatabase().errors.paginate(offset, params.perpage),
      };
    },
    async deleteService(id) {
      await localDatabase().errors.delete({ where: { id } });
      return {
        kind: "ok",
        data: null,
      };
    },
    async massDeleteService(ids) {
      await localDatabase().errors.delete({
        whereIn: { id: _.cloneDeep(ids) },
      });
      return {
        kind: "ok",
        data: {
          success: _.cloneDeep(ids),
          error: [],
        },
      };
    },
    deleteSuccess(id) {
      const index = _.findIndex(this.list.data, { id });
      if (index > -1) this.list.data.splice(index, 1);

      const selectedIndex = this.selected.indexOf(id);
      if (selectedIndex > -1) this.selected.splice(selectedIndex, 1);
    },
  },
});
</script>
