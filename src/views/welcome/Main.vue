<template>
  <div
    class="bg-primary dark:bg-darkmode-600 sm:px-10"
    v-if="localeMessageLoaded"
  >
    <div class="container relative">
      <div class="grid grid-cols-5 h-screen">
        <!-- BEGIN: Login Info -->
        <div
          class="flex justify-center items-end lg:items-center lg:min-h-screen col-span-5 lg:col-span-2"
        >
          <div class="lg:my-auto -intro-x">
            <div
              class="rounded-full h-48 w-48 sm:h-96 sm:w-96 border border-white border-opacity-30 flex items-center justify-center"
            >
              <div
                class="rounded-full h-32 w-32 sm:h-48 sm:w-48 border border-white border-opacity-30 flex items-center justify-center"
              >
                <img
                  class="rounded-full h-24 w-24 sm:h-36 sm:w-36"
                  :src="gravatar"
                />
              </div>
            </div>
          </div>
        </div>
        <!-- END: Login Info -->
        <!-- BEGIN: Login Form -->
        <div
          class="lg:h-screen xl:h-auto flex py-5 xl:py-0 col-span-5 lg:col-span-3"
        >
          <div class="lg:my-auto px-5 py-10 w-full intro-x text-white">
            <div
              class="text-center lg:text-left text-4xl sm:text-7xl font-extralight"
            >
              {{ nameSurname }}
            </div>
            <div class="text-center lg:text-left font-light text-base mt-3">
              <span v-if="loading">
                Uygulama ayarlarınız yüklenirken lütfen bekleyiniz
              </span>
            </div>
          </div>
        </div>
        <!-- END: Login Form -->
      </div>
    </div>
  </div>
</template>

<script>
import { mapStores } from "pinia";
import { useAuthStore } from "@/stores/auth-store";
import { useSystemStore } from "@/stores/system-store";
import dom from "@/libs/dom";

export default {
  name: "Welcome",
  data() {
    return {
      loading: true,
    };
  },
  computed: {
    localeMessageLoaded() {
      return this.systemStore.localeMessageLoaded;
    },
    nameSurname() {
      return this.$h.formatNameSurname(this.authStore.profile);
    },
    email() {
      return _.get(this.authStore, "profile.email") || "";
    },
    gravatar() {
      return `https://secure.gravatar.com/avatar/${this.$h.md5(
        this.email
      )}?size=256`;
    },
    ...mapStores(useAuthStore, useSystemStore),
  },
  mounted() {
    this.initComponent();
  },
  methods: {
    async initComponent() {
      dom("html").removeClass("error-page").removeClass("login");

      this.authStore.setVisibleSplashScreen(false);
      return this.$router.push({
        path: "/",
      });

      // await authService.profile().then((result) => {
      //   if (result.kind === "ok") {
      //     this.authStore.setProfile(result.data);
      //     this.emailVerifiedAt = _.get(result.data, "email_verified_at");
      //   } else {
      //     ToastNotify({ text: result.message, className: "error" });
      //     if (result.kind === "unauthorized") {
      //       this.logout();
      //     } else if (result.kind === "too-many") {
      //       this.tooManyAttempt = true;
      //     }
      //   }
      // });
      //
      // await settingsService.fetch().then((result) => {
      //   if (result.kind === "ok") {
      //     this.systemStore.setSettings(result.data);
      //   } else if (result.kind === "too-many") {
      //     this.tooManyAttempt = true;
      //   }
      // });
      //
      // if (!this.tooManyAttempt) {
      //   this.authStore.setVisibleSplashScreen(false);
      //   if (this.$route.redirectedFrom) {
      //     return this.$router.replace({
      //       name: this.$route.redirectedFrom.name,
      //       params: this.$route.redirectedFrom.params,
      //       query: this.$route.redirectedFrom.query,
      //     });
      //   }
      //   this.$router.replace({
      //     path: _.get(this.$route.query, "redirect", "/"),
      //   });
      // }
    },
  },
};
</script>
