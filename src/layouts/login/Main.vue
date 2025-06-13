<template>
  <div class="container" v-if="localeMessageLoaded">
    <div class="block lg:grid grid-cols-2 gap-4">
      <!-- BEGIN: Login Info -->
      <div class="relative hidden lg:flex flex-col min-h-screen">
        <a href="javascript:;" class="-intro-x flex items-center pt-5">
          <img src="@/assets/images/bayiloji-logo-white-text.svg" class="h-12" />
        </a>
        <div class="my-auto">
          <img
            class="-intro-x w-3/5 -mt-16"
            src="@/assets/images/illustration.svg"
          />
          <div class="w-2/3 -intro-x text-white font-medium text-2xl mt-10">
            Bayilerinizle İlgili Her Şey Bayiloji İle Tek Çatı Altında
          </div>
        </div>
      </div>
      <!-- END: Login Info -->
      <!-- BEGIN: Login Form -->
      <div class="h-screen lg:h-auto flex py-5 lg:py-0">
        <div class="my-auto w-full flex flex-col items-center">
          <a
            href="javascript:;"
            class="-intro-x flex items-center mb-10 lg:hidden"
          >
            <img src="@/assets/images/bayiloji-logo-white-text.svg" class="h-16" />
          </a>
          <div
            id="content-container"
            class="bg-white dark:bg-darkmode-500 lg:bg-transparent lg:dark:bg-transparent px-5 sm:px-8 py-8 lg:p-0 rounded-md shadow-md lg:shadow-none w-full sm:w-3/4 xl:w-2/4 mx-auto"
          >
            <router-view></router-view>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { mapStores } from "pinia";
import { useSystemStore } from "@/stores/system-store";
import dom from "@/libs/dom";

export default defineComponent({
  name: "LayoutLogin",
  computed: {
    localeMessageLoaded() {
      return this.systemStore.localeMessageLoaded;
    },
    ...mapStores(useSystemStore),
  },
  mounted() {
    dom("html")
      .removeClass("error-page")
      .removeClass("theme-secondary")
      .removeClass("theme-minimize")
      .removeClass("theme-default")
      .addClass("login");
  },
  beforeUnmount() {
    dom("html").removeClass("login");
  },
});
</script>
