<template>
  <div v-if="renderKey">
    <div
      class="flex items-center gap-4 pb-4 mb-8 text-base border-b border-slate-200/60 dark:border-darkmode-400"
    >
      <div class="flex-1 flex items-start gap-2 font-bold">
        <i class="icon-duotone-alt-arrow-down"></i>
        <div>
          <div>
            <slot name="title"></slot>
          </div>
          <div class="font-normal text-sm text-slate-500"></div>
        </div>
      </div>
    </div>

    <div class="mt-10 pb-10 grid grid-cols-12 gap-4 xl:w-3/4 mx-auto">
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
        class="col-span-full"
        :errors="validationErrors.get('content.query')"
      >
        <template v-slot:label>SQL Sorgusu</template>
        <template v-slot:description>
          Veritabanından verileri çekebilmek için buraya uygun SQL sorgusunu
          yazın.
        </template>
        <AceSQLEditor
          :model-value="query.content.query"
          @update:model-value="onChangeQuery"
        />
      </FormInputContainer>

      <div class="col-span-full py-2"></div>

      <button
        :disabled="loading || processing"
        class="btn btn-warning-soft col-span-full sm:col-span-6 gap-2 uppercase font-bold"
        @click="runTestQuery"
      >
        <i class="icon-outline-play"></i>
        <span>Sorguyu Test Et</span>
      </button>

      <FormButton
        :disabled="loading"
        :loading="processing"
        class="btn col-span-full sm:col-span-6 gap-2 uppercase font-bold"
        :class="{
          'btn-danger': !testSuccessful,
          'btn-success': testSuccessful,
        }"
        @click="() => submit(type)"
      >
        <i class="icon-outline-diskette"></i>
        <span>Kaydet</span>
      </FormButton>

      <div class="col-span-full pt-6">
        <div>
          Yukarıya yazacağınız SQL sorgusunun sonucunda dönen her satır için
          aşağıda gösterilen alanları içermelidir. Aksi takdirde testi geçemez
          bu bölümü aktif edemezsiniz.
        </div>
        <div class="overflow-x-auto mt-6">
          <table class="table table-sm table-secondary">
            <thead>
              <th>Anahtar Kelime</th>
              <th>Açıklama</th>
              <th v-if="result">Cevap</th>
            </thead>
            <tbody>
              <tr v-for="(columnDescription, columnKey) in columns">
                <td
                  class="font-bold whitespace-nowrap"
                  :class="{
                    'text-red-700': result && !$_.has(result, columnKey),
                    'text-green-600': result && $_.has(result, columnKey),
                  }"
                >
                  {{ columnKey }}
                </td>
                <td>
                  <div>{{ columnDescription }}</div>
                </td>
                <td v-if="result">
                  <div
                    class="text-sm font-bold text-pending"
                    v-if="$_.has(result, columnKey)"
                  >
                    {{ result[columnKey] }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { readMixin } from "@/utils/mixins/read";
import { submitMixin } from "@/utils/mixins/submit";
import validator from "@/libs/validator";
import validate from "joi";
import { ToastNotify } from "@/libs/toast-notify";
import AceSQLEditor from "@/components/ace-sql-editor/Main.vue";

export default {
  name: "BaseSettings",
  components: { AceSQLEditor },
  props: {
    type: {
      type: String,
      required: true,
    },
    columns: {
      type: Object,
      required: true,
    },
    runTestQueryValidation: {
      type: Function,
      default: (query) => {},
    },
  },
  mixins: [readMixin, submitMixin],
  data() {
    return {
      renderKey: null,
      testSuccessful: null,
      readServiceMethod: this.readService,
      updateServiceMethod: this.submitService,
      result: null,
    };
  },
  mounted() {
    this.initComponent();
  },
  methods: {
    initComponent() {
      this.fetchRecord(this.type);
      this.setInitialQuery({
        type: this.type,
        status: false,
        content: {
          query: null,
        },
      });

      this.renderKey = this.$h.uuid();
    },
    readSuccess(result) {
      this.setQuery(result.data, true);
    },
    async readService(id) {
      const data = await this.$db().settings.first({ where: { type: id } });

      return {
        kind: "ok",
        data,
      };
    },
    async submitService(id, params) {
      const validationResults = validator(params, {
        status: validate
          .boolean()
          .disallow(this.testSuccessful ? null : true)
          .messages({
            "any.invalid":
              "SQL kodunun testi başarılı olmadığı sürece aktif olarak kayıt edemezsiniz. Yalnız pasif olarak işaretleyip kaydedebilirsiniz.",
          }),
      });

      if (validationResults) return validationResults;

      await this.$db().settings.createOrUpdate(params, { type: id });

      return {
        kind: "ok",
        data: params,
      };
    },

    onChangeQuery(val) {
      _.set(this.query, "content.query", val);
      this.testSuccessful = null;
    },
    async runTestQuery() {
      this.testSuccessful = false;
      this.processing = true;

      try {
        await this.runTestQueryValidation(this.query.content.query);
      } catch (e) {
        this.processing = false;

        return ToastNotify({
          className: "error",
          text: e.message,
        });
      }

      this.result = await this.$server().testSqlQuery(this.query.content.query);

      this.processing = false;

      if (!this.result) {
        return ToastNotify({
          className: "error",
          text: "SQL kodu başarısız oldu!",
        });
      }

      this.testSuccessful =
        Object.keys(this.columns).filter((k) => !Object.hasOwn(this.result, k))
          .length === 0;

      ToastNotify({
        className: this.testSuccessful ? "success" : "error",
        text: this.testSuccessful
          ? "Tebrikler, yazdığınız SQL kodunun testi başarılı oldu!"
          : "Gelen verinin içinde istenilen alanların hepsi mevcut değil. Lütfen SQL kodunuzu kontrol edip tekrar deneyin.",
      });
    },
  },
};
</script>
