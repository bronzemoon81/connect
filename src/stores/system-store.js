import { defineStore } from "pinia";

export const useSystemStore = defineStore("system", {
  state: () => {
    return {
      teamId: null,
      localeMessageLoading: false,
      localeMessageLoaded: true,
      processing: [],
      definitionsValue: {
        cdn_static: null,
        cdn_image: null,
        cdn_file: null,
        roles: [],
        abilities: [],
      },
      internetConnection: true,
      splashScreenRemoved: false,
      tooManyAttempts: null,
    };
  },
  getters: {
    definitions: (state) => (key) => {
      const definitions = _.get(state.definitionsValue, key, []);
      if (!Array.isArray(definitions)) return definitions;

      return definitions.map((o) => ({
        ...o,
        text: _.get(o, "text"),
      }));
    },
    definition() {
      const self = this;
      return (key, where, field = null) => {
        const definitions = self.definitions(key);
        const index = _.findIndex(definitions, where);
        if (field) return _.get(definitions, `${index}.${field}`);
        return _.get(definitions, `${index}`);
      };
    },
  },
  actions: {
    setSettings(value) {
      this.definitionsValue = {
        ...this.definitionsValue,
        ..._.get(value, "definitions", {}),
      };
    },
    setProcessing(uuid) {
      if (this.processing.indexOf(uuid) === -1) this.processing.push(uuid);
    },
    removeProcessing(uuid) {
      const index = this.processing.indexOf(uuid);
      if (index > -1) this.processing.splice(index, 1);
    },
    setInternetConnection(val) {
      this.internetConnection = val;
    },
    setSplashScreenRemoved(val) {
      this.splashScreenRemoved = val;
    },
    setTooManyAttempts(val) {
      this.tooManyAttempts = val * 1;
      const interval = setInterval(() => {
        this.tooManyAttempts--;
        if (this.tooManyAttempts <= 0) {
          this.tooManyAttempts = null;
          clearInterval(interval);
        }
      }, 1000);
    },
  },
});
