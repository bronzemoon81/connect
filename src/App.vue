<template>
  <Confirm ref="confirmRef" />
  <RouterView />
  <UpdateNotification />

  <div
    v-if="processing"
    class="fixed left-0 top-0 w-full h-full bg-slate-100/20"
    style="z-index: 99999"
  ></div>
</template>

<script>
import { defineComponent, provide, ref } from "vue";
import { mapStores } from "pinia";
import { useSystemStore } from "@/stores/system-store";
import { useThemeModeStore } from "@/stores/theme-mode";
import { useAuthStore } from "@/stores/auth-store";
import { useDarkModeStore } from "@/stores/dark-mode";
import { KEYS, useKeyboardShortcuts } from "@/stores/keyboard-shortcuts";
import dom from "@/libs/dom";
import Confirm from "@/components/confirm/Main.vue";
import UpdateNotification from "@/components/UpdateNotification.vue";
import { ToastNotify } from "@/libs/toast-notify";
import { useTransactionStore } from "@/stores/transaction-store";

export default defineComponent({
  name: "App",
  components: { Confirm, UpdateNotification },

  data() {
    return {
      enabledAutoRunTransaction: true,
    };
  },

  setup() {
    const confirmRef = ref();
    provide("confirmRef", confirmRef);

    return {
      confirmRef,
    };
  },
  computed: {
    darkMode() {
      return this.darkModeStore.darkMode;
    },
    processing() {
      return this.systemStore.processing.length > 0;
    },
    visibleSplashScreen() {
      return this.authStore.visibleSplashScreen;
    },
    ...mapStores(
      useSystemStore,
      useAuthStore,
      useDarkModeStore,
      useKeyboardShortcuts,
      useThemeModeStore,
      useTransactionStore
    ),
  },
  watch: {
    visibleSplashScreen(val) {
      if (val) this.$router.push({ name: "welcome" });
    },
  },
  mounted() {
    this.initComponent();
    this.keyboardShortcuts();
    setInterval(() => this.autoRunTransaction(), 1000);

    this.systemStore.setSplashScreenRemoved(window.splashScreenRemoved || false);
    document.addEventListener("splashScreenRemoved", () => {
      this.systemStore.setSplashScreenRemoved(true);
    });
  },
  methods: {
    initComponent() {
      document.body.addEventListener("keydown", (event) => {
        const action = this.keyboardShortcutsStore.shortcutAction(
          event.keyCode,
          event.metaKey,
          event.altKey
        );
        if (typeof action === "function") {
          action();
        }
      });

      dom("html").addClass(`theme-color-${this.themeModeStore.themeColor}`);

      dom("html").removeClass("dark");

      if (this.darkMode) dom("html").addClass("dark");

    },
    keyboardShortcuts() {
      this.keyboardShortcutsStore.setDefaultShortcuts([
        {
          keyCode: KEYS.F1,
          metaKey: true,
          callback: () => {
            this.$router.push({ name: "home" });
          },
        },
        {
          keyCode: KEYS.F2,
          metaKey: true,
          callback: () => {
            this.$router.push({ name: "monitor" });
          },
        },
        {
          keyCode: KEYS.F3,
          metaKey: true,
          callback: () => {
            this.$router.push({ name: "settings" });
          },
        },
        {
          keyCode: KEYS.F8,
          metaKey: true,
          callback: () => {
            this.enabledAutoRunTransaction = !this.enabledAutoRunTransaction;
            ToastNotify({
              className: this.enabledAutoRunTransaction ? "info" : "warning",
              text: this.enabledAutoRunTransaction
                ? "Otomatik senkronizasyon başlatma işlemi aktif edildi"
                : "Otomatik senkronizasyon başlatma işlemi kapatıldı",
            });
          },
        },
        {
          keyCode: KEYS.F12,
          metaKey: true,
          callback: () => {
            this.resetDatabase();
          },
        },
      ]);
    },
    resetDatabase() {
      this.confirmRef.show("warning", {
        text: "Veritabanı tabloları yeniden oluşturulacak. İşleme devam etmek istiyor musunuz?",
        callback: () => {
          window.expose.connections
            .local()
            .resetDatabase()
            .then(async () => {
              ToastNotify({
                className: "success",
                text: "Veritabanı tabloları başarıyla yeniden oluşturuldu.",
              });

              await this.authStore.logout();
              window.expose.reload();
            });
        },
      });
    },
    autoRunTransaction() {
      if (!this.authStore.token() || this.transactionStore.nextRunTime === null)
        return;

      const nowUnix = new Date().getTime();
      if (
        nowUnix >= this.transactionStore.nextRunTime &&
        this.enabledAutoRunTransaction
      )
        this.transactionStore.process();
    },
  },
});
</script>
