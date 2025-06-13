import { defineStore } from "pinia";

export const useThemeModeStore = defineStore("themeMode", {
  state() {
    let theme = localStorage.getItem("theme") || "default";
    let themeColor = localStorage.getItem("theme-color") || "primary";
    return {
      themeValue: theme,
      themeColorValue: themeColor,
    };
  },
  getters: {
    theme(state) {
      return state.themeValue;
    },
    themeColor(state) {
      return state.themeColorValue;
    },
  },
  actions: {
    setTheme(value) {
      localStorage.setItem("theme", value);
      this.themeValue = value;
    },
    setThemeColor(value) {
      localStorage.setItem("theme-color", value);
      this.themeColorValue = value;
      const htmlClassList =
        _.get(window.document, "documentElement.classList") || [];
      const deleteClassList = [];
      _.forEach(htmlClassList, (o) => {
        if (/(^|\s)theme-color-\S+/g.test(o)) {
          deleteClassList.push(o);
        }
      });
      htmlClassList.remove(deleteClassList);
      htmlClassList.add(`theme-color-${value}`);
    },
  },
});
