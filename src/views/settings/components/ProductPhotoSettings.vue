<template>
  <div class="box" :class="{ '!hidden': !isActive }" v-if="renderKey">
    <div
        class="flex items-center gap-4 pb-4 mb-8 text-base border-b border-slate-200/60 dark:border-darkmode-400"
    >
      <div class="flex-1 flex items-start gap-2 font-bold">
        <i class="icon-duotone-alt-arrow-down"></i>
        <div>
          <div>Ürün Fotoğraf Klasör Ayarları</div>
          <div class="font-normal text-sm text-slate-500">
            Ürün fotoğraflarının olduğu kalsör yolunu belirtin
          </div>
        </div>
      </div>
    </div>

    <div class="mt-10 pb-10 grid grid-cols-12 gap-4 xl:w-3/4 2xl:w-3/5 mx-auto">
      <FormInputContainer
          horizontal
          class="col-span-full"
          :errors="validationErrors.get('status')"
      >
        <template v-slot:label>Durum</template>
        <template v-slot:description>
          Veritabanınızda bulunan kayıtları karşılaştırıp bayilojiye göndermek
          için burayı aktif edebilirsiniz.
        </template>
        <FormCheckbox is-switch v-model="query.status">
          <template v-slot:label>
            {{ query.status ? "Aktif" : "Pasif" }}
          </template>
        </FormCheckbox>
      </FormInputContainer>
      <FormInputContainer
          required
          horizontal
          class="col-span-full"
          :errors="validationErrors.get('path')"
      >
        <template v-slot:label>Path</template>
        <template v-slot:description>
          Ürün Fotoğraflarının Klasör Yolu
        </template>
        <FormInput v-model="query.path" placeholder="D:/Products/Photo"/>
      </FormInputContainer>
      <FormButton
          :disabled="loading"
          :loading="processing"
          class="btn btn-primary col-span-full gap-2 uppercase font-bold"
          @click="() => submit(type)"
      >
        <i class="icon-outline-diskette"></i>
        <span>Kaydet</span>
      </FormButton>
    </div>
  </div>
</template>

<script>
import {readMixin} from "@/utils/mixins/read";
import {submitMixin} from "@/utils/mixins/submit";
import {mapStores} from "pinia";
import {useTransactionStore} from "@/stores/transaction-store";

export default {
  name: "ProductPhotoSettings",
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  mixins: [readMixin, submitMixin],
  data() {
    return {
      path: "",
      loaded: false,
      renderKey: null,
      readServiceMethod: this.readService,
      updateServiceMethod: this.submitService,
    };
  },
  computed: {
    type() {
      return "photos";
    },
    ...mapStores(useTransactionStore),
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
      this.fetchRecord(this.type);
      this.setInitialQuery({
        path: "",
        status: false,
      });
      this.renderKey = this.$h.uuid();
      this.loaded = true;
    },
    readSuccess(result) {
      this.setQuery(result.data, true);
    },
    async getFiles(){
      const x=await window.filesData.listFilesInFolder(this.path);
    },
    async readService(id) {
      const data = await this.$db().settings.first({where: {type: id}});
      this.path = _.get(data.content, "path") || "";
      this.getFiles();
      return {
        kind: "ok",
        data: _.get(data, "content") || {},
      };
    },
    async submitService(id, params) {
      await this.$db().settings.createOrUpdate(
          {type: id, content: params, status: params.status},
          {type: id}
      );

      return {
        kind: "ok",
        data: params,
      };
    },
    async submitSuccess() {
      // await this.$h.sleep(1000);
      // window.expose.reload();
    },
  },
};
</script>
