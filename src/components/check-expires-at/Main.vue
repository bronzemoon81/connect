<template>
  <Modal backdrop="static" :show="visible">
    <ModalBody class="p-0">
      <div class="p-5 text-center">
        <FingerprintIcon class="w-14 h-14 mx-auto mt-2 text-warning" />
        <div class="text-2xl text-warning font-bold mt-4">
          {{ title }}
        </div>
        <div class="text-slate-500 mt-2">
          {{ text }}
        </div>
        <div class="text-slate-500 text-sm font-bold text-slate-700 mt-2">
          {{ subtext }}
        </div>

        <FormInputContainer
          class="mt-6 text-left"
          :errors="validationErrors.get('email', 'password')"
        >
          <FormCheckPassword
            ref="passwordRef"
            :visible-strength="false"
            :generate="false"
            placeholder="Şifre"
            v-model="query.password"
            @keydown.enter="() => submit()"
          />
        </FormInputContainer>

        <FormButton
          class="btn-primary w-full btn-lg mt-4"
          @click="() => submit()"
          :loading="processing"
        >
          Süreyi Uzat
        </FormButton>

        <FormButton class="btn-danger-soft w-full mt-10" @click="logout">
          Oturumu Kapat
        </FormButton>
      </div>
      <!--      <div class="px-5 pb-8 text-center">-->
      <!--        <button-->
      <!--          type="button"-->
      <!--          @click="cancel"-->
      <!--          class="btn min-w-[100px] mr-1"-->
      <!--          :class="{ [options.cancelClass]: true, [options.cancelTheme]: true }"-->
      <!--        >-->
      <!--          {{ options.cancelText }}-->
      <!--        </button>-->
      <!--        <button-->
      <!--          ref="confirmButton"-->
      <!--          type="button"-->
      <!--          class="btn min-w-[100px]"-->
      <!--          :class="{-->
      <!--            [options.confirmClass]: true,-->
      <!--            [options.confirmTheme]: true,-->
      <!--          }"-->
      <!--          @click="callback"-->
      <!--        >-->
      <!--          {{ options.confirmText }}-->
      <!--        </button>-->
      <!--      </div>-->
    </ModalBody>
  </Modal>
</template>

<script>
import { mapStores } from "pinia";
import { useAuthStore } from "@/stores/auth-store";
import { submitMixin } from "@/utils/mixins/submit";
import { authService } from "@/services";

export default {
  name: "CheckExpiresAt",
  inject: ["confirmRef"],
  mixins: [submitMixin],
  data() {
    return {
      lessThan: 300000, // milisaniye cinsinde
      visible: false,
      diffTimestamp: 0,
      diffText: "",
      createServiceMethod: authService.login,
      visibleSavedNotification: false,
    };
  },
  computed: {
    expiresAt() {
      return this.authStore.expiresAt;
    },
    email() {
      return _.get(this.authStore, "profile.email") || "";
    },
    title() {
      if (this.diffTimestamp <= 0) return "Oturumunuzun Süresi Doldu";
      return "Oturumunuzun Süresi Dolmak Üzere";
    },
    text() {
      return "Hesabınızın şifresini yazarak, sayfanızı yenilemeye ihtiyaç kalmadan oturumunuzun süresini uzatabilirsiniz.";
    },
    subtext() {
      if (this.diffTimestamp <= 0) return "";
      return `Süresinizin Dolmasına: ${this.diffText}`;
    },
    ...mapStores(useAuthStore),
  },
  watch: {
    visible: {
      handler(val, oldVal) {
        if (!oldVal && val && this.$refs.passwordRef) {
          this.$nextTick(() => {
            setTimeout(() => {
              this.$refs.passwordRef.focus();
            }, 500);
          });
        }
      },
      flush: "post",
    },
  },
  mounted() {
    setInterval(() => this.calculate(), 1000);
    this.prepareInitialQuery();
  },
  methods: {
    calculate() {
      try {
        this.diffTimestamp = (this.expiresAt || 0) - new Date().getTime();
        this.visible =
          this.expiresAt !== null && this.diffTimestamp <= this.lessThan;

        if (this.visible && this.diffTimestamp >= 0) {
          const diffTimeByNow = this.$h.diffTimeByNow(this.expiresAt);
          this.diffText = diffTimeByNow.toString();
        }
      } catch (e) {}
    },
    prepareInitialQuery() {
      this.setInitialQuery({
        email: this.email || "",
        password: "",
        content_manager: true,
      });
    },
    submitSuccess(result) {
      if (result.kind === "ok") {
        this.authStore.setToken(_.get(result, "meta.token"), false);
        this.authStore.setProfile(_.get(result, "data"));
      }
    },
    logout() {
      this.confirmRef.show("danger", {
        title: "Oturumunuzu kapatmak istediğinize emin misiniz?",
        text: "Oturumunuzu kapatmanız, kaydedilmeyen değişikliklerin kaybolmasına neden olabilir.",
        callback: () => {
          this.authStore.logout();
        },
      });
    },
  },
};
</script>
