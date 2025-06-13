<template>
  <div class="container p-4">
    <teleport to="#top-navigation__icon">
      <i class="icon-duotone-settings"></i>
    </teleport>

    <teleport to="#top-navigation__title">
      <span>Uygulama Ayarları</span>
    </teleport>

    <teleport to="#top-navigation__description">
      <span
        >Bayiloji ve kendi sunucunuz arasında veri alışverişi yapabilmesi için
        bu sayfadaki ayarları yapmalısınız.</span
      >
    </teleport>

    <div
      class="relative w-full flex flex-col-reverse lg:flex-row items-start gap-y-6 sm:gap-x-6"
    >
      <div class="w-full">
        <ServerSettings :is-active="activeTab === 'server'" />
        <CompanySettings :is-active="activeTab === 'company'" />
        <CompanyBalanceSettings :is-active="activeTab === 'company-balance'" />
        <CompanyFicheSettings :is-active="activeTab === 'company-fiche'" />
        <ProductSettings :is-active="activeTab === 'product'" />
        <ProductLotSettings :is-active="activeTab === 'product-lot'" />
        <PricesSettings :is-active="activeTab === 'prices'" />
        <ProductPhotoSettings :is-active="activeTab === 'photos'" />
      </div>

      <div
        class="vertical-nav-links flex-shrink-0 w-full lg:w-[320px] lg:sticky lg:top-4"
      >
        <ul class="vnl-links">
          <li :class="{ active: activeTab === 'server' }">
            <a href="javascript:;" @click="changeTabNavigation('server')">
              <i class="icon-outline-database"></i>
              <span>Veritabanı Bağlantı Ayarları</span>
            </a>
          </li>
          <li :class="{ active: activeTab === 'company' }">
            <a href="javascript:;" @click="changeTabNavigation('company')">
              <i class="icon-outline-buildings-2"></i>
              <span>Cari Ayarları</span>
            </a>
          </li>
          <li :class="{ active: activeTab === 'company-balance' }">
            <a
              href="javascript:;"
              @click="changeTabNavigation('company-balance')"
            >
              <i class="icon-outline-dollar"></i>
              <span>Cari Bakiye Ayarları</span>
            </a>
          </li>
          <li :class="{ active: activeTab === 'company-fiche' }">
            <a
              href="javascript:;"
              @click="changeTabNavigation('company-fiche')"
            >
              <i class="icon-outline-bill"></i>
              <span>Cari Fiş Ayarları</span>
            </a>
          </li>
          <li :class="{ active: activeTab === 'product' }">
            <a href="javascript:;" @click="changeTabNavigation('product')">
              <i class="icon-outline-bill"></i>
              <span>Ürün Ayarları</span>
            </a>
          </li>
          <li :class="{ active: activeTab === 'product-lot' }">
            <a href="javascript:;" @click="changeTabNavigation('product-lot')">
              <i class="icon-outline-bill"></i>
              <span>Ürün Lot Ayarları</span>
            </a>
          </li>
          <li :class="{ active: activeTab === 'prices' }">
            <a href="javascript:;" @click="changeTabNavigation('prices')">
              <i class="icon-outline-bill"></i>
              <span>Ürün Fiyat Ayarları</span>
            </a>
          </li>
          <li :class="{ active: activeTab === 'photos' }">
            <a href="javascript:;" @click="changeTabNavigation('photos')">
              <i class="icon-outline-bill"></i>
              <span>Ürün Fotoğraf Ayarları</span>
            </a>
          </li>
          <li>
            <a href="javascript:;" @click="clearAllStorage">
              <i class="icon-outline-bill"></i>
              <span>Bellek Temizle</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import ServerSettings from "./components/ServerSettings.vue";
import CompanySettings from "./components/CompanySettings.vue";
import CompanyBalanceSettings from "./components/CompanyBalanceSettings.vue";
import CompanyFicheSettings from "./components/CompanyFicheSettings.vue";
import ProductSettings from "./components/ProductSettings.vue";
import ProductLotSettings from "./components/ProductLotSettings.vue";
import PricesSettings from "./components/PricesSettings.vue";
import ProductPhotoSettings from "@/views/settings/components/ProductPhotoSettings.vue";

import {ToastNotify} from "@/libs/toast-notify";

export default {
  name: "Settings",
  components: {
    ServerSettings,
    CompanySettings,
    CompanyBalanceSettings,
    CompanyFicheSettings,
    ProductSettings,
    ProductLotSettings,
    PricesSettings,
    ProductPhotoSettings
  },
  data() {
    const routeHash = _.get(this.$route, "hash") || "server";
    return {
      activeTab: routeHash.startsWith("#") ? routeHash.slice(1) : routeHash,
    };
  },
  methods: {
    changeTabNavigation(key) {
      if (this.activeTab === key) return;
      this.$router.replace({ hash: `#${key}` });
      this.activeTab = key;
    },
    async clearAllStorage(){
      const allKeys = Object.keys(localStorage);

      const keysToKeep = ['token', 'username','profile', 'tenant'];

      allKeys.forEach(key => {
        if (!keysToKeep.includes(key)) {
          localStorage.removeItem(key);
        }
      });

      ToastNotify({
        className: "success",
        text: `Bellek Temizlendi`,
      });
    }
  },
};
</script>
