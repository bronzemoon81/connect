import { defineStore } from "pinia";

export const useKeyboardShortcuts = defineStore("keyboardShortcuts", {
  state: () => ({
    defaultShortcutsValue: [],
    shortcutsValue: [],
  }),
  getters: {
    shortcuts(state) {
      return [...state.defaultShortcutsValue, ...state.shortcutsValue];
    },
    shortcutAction:
      (state) =>
      (keyCode, metaKey = false, altKey = false) => {
        const shortcuts = [
          ...state.defaultShortcutsValue,
          ...state.shortcutsValue,
        ].reverse();

        let index = _.findIndex(shortcuts, { keyCode, metaKey, altKey });
        return _.get(shortcuts, `${index}.callback`) || null;
      },
  },
  actions: {
    resetShortcuts() {
      this.shortcutsValue = [];
    },
    setShortcuts(shortcuts) {
      this.shortcutsValue = [
        ...this.shortcutsValue,
        ...shortcuts.map((o) => ({
          keyCode: null,
          metaKey: false,
          altKey: false,
          ...o,
        })),
      ];
    },
    setDefaultShortcuts(shortcuts) {
      this.defaultShortcutsValue = shortcuts.map((o) => ({
        keyCode: null,
        metaKey: false,
        altKey: false,
        ...o,
      }));
    },
  },
});

export const KEYS = {
  0: 48,
  1: 49,
  2: 50,
  3: 51,
  4: 52,
  5: 53,
  6: 54,
  7: 55,
  8: 56,
  9: 57,
  A: 65,
  B: 66,
  C: 67,
  D: 68,
  E: 69,
  F: 70,
  G: 71,
  H: 72,
  I: 73,
  J: 74,
  K: 75,
  L: 76,
  M: 77,
  N: 78,
  O: 79,
  P: 80,
  Q: 81,
  R: 82,
  S: 83,
  T: 84,
  U: 85,
  V: 86,
  W: 87,
  X: 88,
  Y: 89,
  Z: 90,
  F1: 112,
  F2: 113,
  F3: 114,
  F4: 115,
  F5: 116,
  F6: 117,
  F7: 118,
  F8: 119,
  F9: 120,
  F10: 121,
  F11: 122,
  F12: 123,
  BACKSPACE: 8,
};
