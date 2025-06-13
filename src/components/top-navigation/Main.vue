<template>
  <Transition name="bounce">
    <div class="h-10" v-if="transactionStore.processing">
      <div
        class="z-[9999] fixed left-0 top-0 w-full h-10 flex items-center justify-center text-center gap-2 text-sm font-bold bg-gradient-to-r from-teal-400 to-teal-600 text-white"
      >
        <i class="icon-duotone-refresh animate-spin text-xs"></i>
        <span>Senkronizasyon Yapılıyor</span>
      </div>
    </div>
  </Transition>
  <div class="container py-3">
    <div class="flex font-semibold text-sm">
      <router-link :to="{ name: 'home' }" class="hover:text-primary px-2">
        Anasayfa
      </router-link>
      <router-link
        :to="{ name: 'monitor' }"
        class="hover:text-primary px-2 border-l"
      >
        Anlık Takip Ekranı
      </router-link>
      <router-link
        :to="{ name: 'error-tracking' }"
        class="hover:text-primary px-2 border-l"
      >
        Oluşan Hatalar
      </router-link>
      <router-link
        :to="{ name: 'settings' }"
        class="hover:text-primary px-2 border-l"
      >
        Uygulama Ayarları
      </router-link>
    </div>
  </div>
  <div class="top-navigation">
    <div class="top-navigation__content">
      <div class="top-navigation__middle">
        <div id="top-navigation__icon"></div>
        <div class="top-navigation__header">
          <h1 id="top-navigation__title"></h1>
          <div id="top-navigation__description"></div>
        </div>
      </div>
      <div class="top-navigation__actions">
        <Dropdown>
          <DropdownToggle
            tag="a"
            href="javascript:;"
            class="top-navigation__profile"
          >
            <div class="top-navigation__profile-image">
              <img :src="gravatar" />
            </div>
            <div class="flex-1">
              <div class="top-navigation__profile-name">{{ nameSurname }}</div>
              <div
                class="top-navigation__profile-email"
                :class="{ '!text-red-400': !emailVerifiedAt }"
              >
                {{ email }}
              </div>
            </div>
          </DropdownToggle>
          <DropdownMenu class="w-64">
            <DropdownContent>
              <DropdownHeader v-if="!emailVerifiedAt">
                <div class="text-xs text-yellow-600 font-semibold">
                  E-posta bildirimleri alabilmek için e-posta adresinizi
                  onaylamanız gerekiyor.
                </div>
                <FormButton
                  class="btn-warning-soft btn-sm py-1 px-3 w-full mt-2"
                  :loading="sendingEmailVerification"
                  @click="sendEmailVerification"
                >
                  Onay Linki Gönder
                </FormButton>
              </DropdownHeader>
              <DropdownItem
                class="dropdown-item font-semibold py-1"
                v-if="darkMode"
                @click="toggleDarkMode"
              >
                <SunIcon class="icon-square" />
                <span class="ml-3">Aydınlık Tema</span>
              </DropdownItem>
              <DropdownItem
                class="dropdown-item font-semibold py-1"
                v-else
                @click="toggleDarkMode"
              >
                <MoonIcon class="icon-square" />
                <span class="ml-3">Karanlık Tema</span>
              </DropdownItem>
              <DropdownItem
                class="dropdown-item font-semibold py-1"
                @click="logout"
              >
                <LogOutIcon class="icon-square-danger" />
                <span class="ml-3">Oturumu Kapat</span>
              </DropdownItem>
            </DropdownContent>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent } from "vue";
import { mapStores } from "pinia";
import { useSystemStore } from "@/stores/system-store";
import { useAuthStore } from "@/stores/auth-store";
import { authService } from "@/services";
import { ToastNotify } from "@/libs/toast-notify";
import { useDarkModeStore } from "@/stores/dark-mode";
import dom from "@/libs/dom";
import { useTransactionStore } from "@/stores/transaction-store";

export default defineComponent({
  name: "TopNavigation",
  data() {
    return {
      sendingEmailVerification: false,
    };
  },
  computed: {
    darkMode() {
      return this.darkModeStore.darkMode;
    },
    nameSurname() {
      return _.get(this.authStore.profile, "name_surname");
    },
    email() {
      return _.get(this.authStore.profile, "email");
    },
    emailVerifiedAt() {
      return true;
    },
    gravatar() {
      return `https://secure.gravatar.com/avatar/${this.$h.md5(
        this.email
      )}?size=256`;
    },
    ...mapStores(
      useSystemStore,
      useAuthStore,
      useDarkModeStore,
      useTransactionStore
    ),
  },
  methods: {
    logout() {
      this.authStore.logout();
    },
    sendEmailVerification() {
      this.sendingEmailVerification = true;
      authService
        .sendEmailVerification()
        .then((result) => {
          if (result.kind === "ok") {
            ToastNotify({
              text: "Onay Linki E-posta Adresinize Gönderildi",
              className: "info",
            });
          } else {
            ToastNotify({ text: result.message, className: "error" });
          }
        })
        .finally(() => {
          this.sendingEmailVerification = false;
        });
    },
    toggleDarkMode() {
      dom("html").removeClass("dark");
      if (!this.darkMode) dom("html").addClass("dark");

      this.darkModeStore.setDarkMode(!this.darkMode);
    },
  },
});
</script>
