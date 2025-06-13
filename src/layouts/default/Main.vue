<template>
  <div v-if="systemStore.localeMessageLoaded">
    <CheckExpiresAt />
    <div class="flex">
      <!-- BEGIN: Side Menu -->
      <!-- END: Side Menu -->

      <!-- BEGIN: Content -->
      <div id="content-container" class="content">
        <TopNavigation />
        <router-view v-if="renderKey"></router-view>
      </div>
      <!-- END: Content -->
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { mapStores } from "pinia";
import { useSystemStore } from "@/stores/system-store";
import { useThemeModeStore } from "@/stores/theme-mode";
import dom from "@/libs/dom";
import CheckExpiresAt from "@/components/check-expires-at/Main.vue";
import TopNavigation from "@/components/top-navigation/Main.vue";

export default defineComponent({
  name: "LayoutDefault",
  components: { TopNavigation, CheckExpiresAt },
  data() {
    return {
      renderKey: null,
    };
  },
  computed: {
    layout() {
      switch (this.themeModeStore.theme) {
        default:
          return "LayoutDefault";
      }
    },
    ...mapStores(useSystemStore, useThemeModeStore),
  },
  watch: {
    "systemStore.splashScreenRemoved": {
      handler() {
        this.renderKey = this.$h.uuid();
      },
      flush: "post",
    },
  },
  mounted() {
    dom("html")
      .removeClass("error-page")
      .removeClass("login")
      .addClass("theme-default");

    if (this.systemStore.splashScreenRemoved) {
      this.renderKey = this.$h.uuid();
    }
  },
  beforeUnmount() {
    dom("html").removeClass("theme-default");
  },
});
</script>
