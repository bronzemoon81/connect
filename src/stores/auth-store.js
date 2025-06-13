import { defineStore } from "pinia";
import { authService } from "@/services";
import { localDatabase } from "@/utils/properties/local-database";

const loadProfile = () => {
  const data = window.localStorage.getItem("profile") || "";
  try {
    return JSON.parse(decodeURIComponent(escape(window.atob(data))));
  } catch (e) {
    return data;
  }
};

export const useAuthStore = defineStore("auth", {
  state: () => ({
    profile: loadProfile(),
    visibleSplashScreen: true,
    tenantValue: window.localStorage.getItem("tenant") || null,
    tokenValue: window.localStorage.getItem("token") || null,
    expiresAt: null,
  }),
  getters: {
    tenant(state) {
      return () => state.tenantValue;
    },
    token(state) {
      return () => state.tokenValue;
    },
    can:
      (state) =>
      (ability, entityId = null) => {
        return true;

        let isCan = false;

        if (_.get(state, "profile.roles", []).indexOf("admin") > -1) {
          return true;
        }

        if (!ability) ability = [];
        if (_.isString(ability)) ability = [ability];

        _.get(state, "profile.abilities", []).map((item) => {
          if (ability.indexOf(_.get(item, "name")) > -1) {
            if (
              !_.get(item, "entity_id") ||
              !entityId ||
              _.get(item, "entity_id").toString() ===
                (entityId || "").toString()
            ) {
              isCan = true;
            }
          }
        });

        return isCan;
      },
    isExpiredToken(state) {
      return false;
    },
  },
  actions: {
    setToken(token, visibleSplashScreen = true) {
      window.localStorage.setItem("token", token);
      window.localStorage.removeItem("profile");
      this.visibleSplashScreen = visibleSplashScreen;
      this.tokenValue = token;
      this.expiresAt = null;
    },
    setProfile(data) {
      this.profile = data;
      try {
        window.localStorage.setItem(
          "profile",
          window.btoa(unescape(encodeURIComponent(JSON.stringify(data))))
        );
      } catch (e) {
        console.error(e);
      }
    },
    setTenant(value) {
      this.tenantValue = value;
      window.localStorage.setItem("tenant", value);
    },
    setVisibleSplashScreen(data) {
      this.visibleSplashScreen = data;
    },
    async logout() {
      this.tokenValue = null;
      this.expiresAt = null;
      window.localStorage.clear();
      this.setProfile(null);
      this.setVisibleSplashScreen(true);
    },
    setExpiresAt(timestamp) {
      this.expiresAt = /^\d+$/.test(timestamp) ? timestamp * 1 : null;
    },
    async refreshToken() {
      const userAccount = await localDatabase().users.first();

      if (!userAccount) return { kind: "unauthorized" };

      const result = await authService.login({
        email: _.get(userAccount, "email", null),
        password: _.get(userAccount, "password", null),
        content_manager: true,
        // email: "info@bayiloji.com",
        // password: "m14251425!",
        // content_manager: true,
      });

      if (result.kind === "ok") {
        this.setToken(_.get(result, "meta.token"), false);
        this.setProfile(_.get(result, "data"));
      }

      return result;
    },
  },
});
