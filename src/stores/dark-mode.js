import { defineStore } from "pinia";

export const useDarkModeStore = defineStore("darkMode", {
  state() {
    let darkMode = localStorage.getItem("darkMode");
    // if (darkMode === null) {
    //   darkMode =
    //     window.matchMedia &&
    //     window.matchMedia("(prefers-color-scheme: dark)").matches
    //       ? "true"
    //       : "false";
    // }
    return {
      darkModeValue: darkMode === "true",
    };
  },
  getters: {
    darkMode(state) {
      return state.darkModeValue;
    },
  },
  actions: {
    setDarkMode(darkMode) {
      localStorage.setItem("darkMode", darkMode);
      this.darkModeValue = darkMode;
    },
  },
});
