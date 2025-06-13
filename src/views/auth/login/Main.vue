<template>
  <div :key="renderKey" v-if="renderKey">
    <h2 class="intro-x text-center text-xl font-bold uppercase text-slate-500">
      Hesabınıza Giriş Yapınız Ve Devam Edin
    </h2>
    <div class="intro-x mt-8 grid gap-4">
      <FormInputContainer :errors="validationErrors.get('subdomain')">
        <div class="intro-x input-group input-group-xl">
          <FormInput
            class="login__input"
            placeholder="Firma Kodu"
            v-model="query.subdomain"
            :disable-autocomplete="false"
          />
          <div class="input-group-text !text-xl whitespace-nowrap !px-6">
            .bayiloji.com
          </div>
        </div>
      </FormInputContainer>
      <FormInputContainer
        :errors="validationErrors.get('email', 'device_name')"
      >
        <FormInput
          class="intro-x form-control-xl login__input"
          name="email"
          type="email"
          placeholder="E-posta Adresi"
          v-model="query.email"
          :disable-autocomplete="false"
        />
      </FormInputContainer>
      <FormInputContainer :errors="validationErrors.get('password')">
        <FormInput
          type="password"
          class="intro-x form-control-xl login__input"
          placeholder="Şifre"
          v-model="query.password"
          :disable-autocomplete="false"
          disable-enter-event
          @keyup.enter="() => onSubmit()"
        />
      </FormInputContainer>
    </div>
    <div class="intro-x mt-5 xl:mt-8">
      <FormButton
        class="btn-primary btn-lg w-full"
        @click="() => onSubmit()"
        :loading="processing"
      >
        Giriş Yap
      </FormButton>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { mapStores } from "pinia";
import { useSystemStore } from "@/stores/system-store";
import { useAuthStore } from "@/stores/auth-store";
import { authService } from "@/services";
import { submitMixin } from "@/utils/mixins/submit";
import { ToastNotify } from "@/libs/toast-notify";

export default defineComponent({
  name: "Login",
  mixins: [submitMixin],
  inject: ["confirmRef"],
  data() {
    return {
      renderKey: null,
      createServiceMethod: authService.login,
      visibleSavedNotification: false,
    };
  },
  computed: {
    ...mapStores(useSystemStore, useAuthStore),
  },
  mounted() {
    this.initComponent();
  },
  methods: {
    initComponent() {
      this.prepareInitialQuery();
    },
    prepareInitialQuery() {
      this.setInitialQuery({
        subdomain: "",
        email: _.get(this.$route, "query.email") || "",
        password: "",
        content_manager: true,
      });
      this.renderKey = this.$h.uuid();
    },
    onSubmit() {
      if (!this.query.subdomain) {
        return ToastNotify({
          className: "error",
          text: "Firma kodunu mutlaka belirtmelisiniz.",
        });
      }
      this.authStore.setTenant(this.query.subdomain);
      this.submit();
    },
    submitSuccess(result) {
      if (result.kind === "ok") {
        this.$db().users.truncate();
        // this.$db().users.create({
        //   subdomain: this.query.subdomain,
        //   email: this.query.email,
        //   password: this.query.password,
        // });

        window.localStorage.setItem("username", this.query.email);
        this.authStore.setToken(_.get(result, "meta.token"));
        this.authStore.setProfile(_.get(result, "data"));
        this.redirect();
      }
    },
    redirect() {
      const query = {};
      if (this.$route.query.redirect)
        _.set(query, "redirect", this.$route.query.redirect);
      this.$router.push({ name: "welcome" });
    },
  },
});
</script>
