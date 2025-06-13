<template>
  <div class="box" :class="{ '!hidden': !isActive }" v-if="renderKey">
    <div
      class="flex items-center gap-4 pb-4 mb-8 text-base border-b border-slate-200/60 dark:border-darkmode-400"
    >
      <div class="flex-1 flex items-start gap-2 font-bold">
        <i class="icon-duotone-alt-arrow-down"></i>
        <div>
          <div>Veritabanı Bağlantı Ayarları</div>
          <div class="font-normal text-sm text-slate-500">
            Size ait veritabanının bağlantı ayarlarını aşağıda belirtin
          </div>
        </div>
      </div>
    </div>

    <div class="mt-10 pb-10 grid grid-cols-12 gap-4 xl:w-3/4 2xl:w-3/5 mx-auto">
      <FormInputContainer
        required
        horizontal
        class="col-span-full"
        :errors="validationErrors.get('connection')"
      >
        <template v-slot:label>Bağlantı Türü</template>
        <template v-slot:description>
          Hangi veritabanı türüne bağlanacağını buradan belirtin.
        </template>
        <FormSelect v-model="query.connection">
          <option value="mysql">MySQL</option>
          <option value="mssql">SQL Server</option>
          <option value="firebird">Firebird</option>
        </FormSelect>
      </FormInputContainer>
      <FormInputContainer
        required
        horizontal
        class="col-span-full"
        :errors="validationErrors.get('ip')"
      >
        <template v-slot:label>Sunucu</template>
        <template v-slot:description>
          Veritabanı sunucusunun ip adresini buraya yazın
        </template>
        <FormInput v-model="query.ip" placeholder="Örn: 127.0.0.1" />
      </FormInputContainer>
      <FormInputContainer
        required
        horizontal
        class="col-span-full"
        :errors="validationErrors.get('port')"
      >
        <template v-slot:label>Port</template>
        <template v-slot:description>
          Veritabanı sunucusunun port bilgisini buraya yazın
        </template>
        <FormInput v-model.numeric="query.port" placeholder="Örn: 3306" />
      </FormInputContainer>
      <FormInputContainer
        required
        horizontal
        class="col-span-full"
        :errors="validationErrors.get('database')"
      >
        <template v-slot:label>Veritabanı Adı</template>
        <template v-slot:description>
          Veritabanın kayıtlı olduğu adı buraya girin
        </template>
        <FormInput v-model="query.database" placeholder="Örn: ERP_DATABASE" />
      </FormInputContainer>
      <FormInputContainer
        required
        horizontal
        class="col-span-full"
        :errors="validationErrors.get('username')"
      >
        <template v-slot:label>Kullanıcı Adı</template>
        <template v-slot:description>
          Veritabanına giriş yapabilmek için tanımlanmış kullanıcı adını buraya
          girin.
        </template>
        <FormInput v-model="query.username" placeholder="Örn: Username" />
      </FormInputContainer>
      <FormInputContainer
        horizontal
        class="col-span-full"
        :errors="validationErrors.get('password')"
      >
        <template v-slot:label>Şifre</template>
        <template v-slot:description>
          Veritabanına giriş yapabilmek için tanımlanmış şifreyi buraya girin.
        </template>
        <FormInput v-model="query.password" placeholder="Örn: Password" />
      </FormInputContainer>

      <FormInputContainer
        horizontal
        class="col-span-full"
        :errors="validationErrors.get('cron')"
      >
        <template v-slot:label>Otomatik Senkronizasyon</template>
        <template v-slot:description>
          Senkronizasyon otomatik olarak kaç dakikada bir tetiklensin.
        </template>
        <FormSelect v-model="query.cron">
          <option value="0">Hiçbir Zaman</option>
          <option value="1">Her Dakika</option>
          <option value="5">5 Dakika</option>
          <option value="10">10 Dakika</option>
          <option value="15">15 Dakika</option>
          <option value="20">20 Dakika</option>
          <option value="25">25 Dakika</option>
          <option value="30">30 Dakika</option>
        </FormSelect>
      </FormInputContainer>

      <FormInputContainer
        horizontal
        class="col-span-full"
        :errors="validationErrors.get('fromDate')"
      >
        <template v-slot:label>Başlangıç Tarihi</template>
        <template v-slot:description>
          Buraya girdiğiniz tarihten itibaren olan kayıtları senkronize
          edecektir.
        </template>
        <FormNativeDatepicker v-model="query.fromDate" />
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
import { readMixin } from "@/utils/mixins/read";
import { submitMixin } from "@/utils/mixins/submit";
import validator from "@/libs/validator";
import validate from "joi";
import { mapStores } from "pinia";
import { useTransactionStore } from "@/stores/transaction-store";

export default {
  name: "ServerSettings",
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  mixins: [readMixin, submitMixin],
  data() {
    return {
      loaded: false,
      renderKey: null,
      readServiceMethod: this.readService,
      updateServiceMethod: this.submitService,
    };
  },
  computed: {
    type() {
      return "server";
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
        connection: "mssql",
        ip: "",
        port: "",
        database: "",
        username: "",
        password: "",
        cron: 5,
        fromDate: this.$h.formatDate(
          this.$date.startOfYear(new Date()),
          "yyyy-MM-dd"
        ),
      });
      this.renderKey = this.$h.uuid();
      this.loaded = true;
    },
    readSuccess(result) {
      this.setQuery(result.data, true);
    },
    async readService(id) {
      const data = await this.$db().settings.first({ where: { type: id } });

      return {
        kind: "ok",
        data: _.get(data, "content") || {},
      };
    },
    async submitService(id, params) {
      const validationResults = validator(params, {
        connection: validate.string().required(),
        ip: validate.string().required(),
        port: validate.number().required(),
        database: validate.string().required(),
        username: validate.string().required(),
        cron: validate.number().required(),
        fromDate: validate.date().required(),
      });

      if (validationResults) return validationResults;

      const result = await this.$server().testConnection(params);
      if (!result) {
        return {
          kind: "rejected",
          message:
            "Sunucuya erişim sağlanamadı. Bağlantı ayarlarınızı kontrol edin.",
        };
      }

      await this.$db().settings.createOrUpdate(
        { type: id, content: params },
        { type: id }
      );

      await this.$server().refresh();

      return {
        kind: "ok",
        data: params,
      };
    },
    async submitSuccess() {
      await this.$h.sleep(1000);
      window.expose.reload();
    },
  },
};
</script>
