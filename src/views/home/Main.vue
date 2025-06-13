<template>
  <div class="container-xs p-10">
    <teleport to="#top-navigation__icon">
      <i class="icon-duotone-garage"></i>
    </teleport>

    <teleport to="#top-navigation__title">
      <span>{{ header }}</span>
    </teleport>

    <teleport to="#top-navigation__description">
      <span>
        {{ description }}
      </span>
    </teleport>

    <ul class="flex flex-col gap-4">
      <li v-for="item in list.data" :key="`operation-${item.type}`">
        <button
          class="btn btn-secondary h-24 px-10 justify-between text-left gap-6 w-full"
          @click="selectOperation(item.type)"
        >
          <div>
            <div class="font-bold text-lg text-primary">{{ item.title }}</div>
            <div class="text-sm text-slate-500 dark:text-slate-500 mt-2">
              {{ item.text }}
            </div>
          </div>
          <i :class="item.icon" class="!text-xl text-primary"></i>
        </button>
      </li>
    </ul>
  </div>
</template>
<script>
import { defineComponent } from "vue";
import { mapStores } from "pinia";
import { useSystemStore } from "@/stores/system-store";

export default defineComponent({
  name: "Home",
  data() {
    return {
      list: {
        data: [
          {
            type: "monitor",
            title: "Anlık Takip Ekranı",
            text: "Uygulama & Bayiloji arasında gerçekleşen işlemleri anlık olarak buradan takip edebilirsiniz.",
            icon: "icon-duotone-monitor",
          },
          {
            type: "error",
            title: "Oluşan Hatalar",
            text: "Uygulama & Bayiloji arasında gerçekleşen işlemler sırasında oluşan hataları buradan görebilirsiniz.",
            icon: "icon-duotone-bug",
          },
          {
            type: "settings",
            title: "Uygulama Ayarları",
            text: "Uygulama & Sunucu & Senkronizasyon ile ilgili tüm ayarları buradan yapabilirsiniz.",
            icon: "icon-duotone-settings",
          },
        ],
      },
    };
  },
  computed: {
    header() {
      return import.meta.env.VITE_APP_NAME;
    },
    description() {
      return import.meta.env.VITE_APP_DESCRIPTION;
    },
    ...mapStores(useSystemStore),
  },
  methods: {
    selectOperation(id) {
      switch (id) {
        case "monitor":
          this.$router.push({ name: "monitor" });
          break;
        case "error":
          this.$router.push({ name: "error-tracking" });
          break;
        case "settings":
          this.$router.push({ name: "settings" });
          break;
      }
    },
  },
});
</script>
