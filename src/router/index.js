import { createMemoryHistory, createRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth-store";

import { useKeyboardShortcuts } from "@/stores/keyboard-shortcuts";

import routes from "./routes";
import { ToastNotify } from "@/libs/toast-notify";

export const setupRouter = () => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
      return savedPosition || { left: 0, top: 0 };
    },
  });

  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();

    const query = {};
    if (to.fullPath && ["/", "/welcome"].indexOf(to.fullPath) === -1)
      _.set(query, "redirect", to.fullPath);

    if (authStore.token()) {
      if (
        authStore.visibleSplashScreen &&
        to.name !== "page.notfound" &&
        to.name !== "welcome"
      ) {
        return next({ name: "welcome" });
      }

      if (to.meta.requiresGuest === true) {
        return next({ name: "dashboard" });
      }
    } else {
      if (to.meta.requiresAuth === true) {
        return next({ name: "login", query });
      }
    }

    let valid = true;

    const toParamId = _.get(to, "params.id") || null;
    const abilities = _.get(to, "meta.abilities") || [];

    if (valid && abilities.length > 0) {
      valid = false;
      abilities.map((ability) => {
        if (authStore.can(ability || [], toParamId)) valid = true;
      });
    }

    if (!valid) {
      ToastNotify({
        text: "Bu sayfayı görmek için yetkiniz yok!",
        className: "error",
        sound: true,
      });
    }

    const keyboardShortcuts = useKeyboardShortcuts();
    keyboardShortcuts.resetShortcuts();

    return next(valid);
  });

  return router;
};
