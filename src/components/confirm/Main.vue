<template>
  <Modal
    :show="modalPreview"
    @hidden="modalPreview = false"
    backdrop="static"
    :size="options.size"
  >
    <ModalBody class="p-0" v-if="modalPreview">
      <div class="p-5 text-center">
        <component
          :is="options.icon"
          :class="{ [options.iconClass]: true, [options.iconTheme]: true }"
        />
        <div class="text-2xl dark:text-slate-200 mt-4" :class="options.titleClass">
          {{ options.title }}
        </div>
        <div
          class="text-slate-500 mt-2"
          :class="options.textClass"
          v-if="options.text"
        >
          {{ options.text }}
        </div>
        <div
          class="text-slate-500 text-sm"
          :class="options.subtextClass"
          v-if="options.subtext"
        >
          {{ options.subtext }}
        </div>
      </div>
      <div class="px-5 pb-8 text-center">
        <button
          type="button"
          @click="cancel"
          class="btn min-w-[100px] mr-1"
          :class="{ [options.cancelClass]: true, [options.cancelTheme]: true }"
        >
          {{ options.cancelText }}
        </button>
        <button
          ref="confirmButton"
          type="button"
          class="btn min-w-[100px]"
          :class="{
            [options.confirmClass]: true,
            [options.confirmTheme]: true,
          }"
          @click="callback"
        >
          {{ options.confirmText }}
        </button>
        <button
          v-if="options.otherText"
          ref="otherButton"
          type="button"
          class="btn min-w-[100px] ml-1"
          :class="{
            [options.otherClass]: true,
            [options.otherTheme]: true,
          }"
          @click="otherCallback"
        >
          {{ options.otherText }}
        </button>
      </div>
    </ModalBody>
  </Modal>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Confirm",
  data() {
    return {
      modalPreview: false,
      options: {},
    };
  },
  beforeUnmount() {
    this.modalPreview = false;
  },
  methods: {
    async show(type = "danger", ctx = {}) {
      this.options = {
        title: "Emin misiniz?",
        titleClass: "",
        text: "",
        textClass: "",
        subtext: "",
        subtextClass: "",
        icon: "x-circle-icon",
        iconTheme: "text-red-400",
        iconClass: "w-14 h-14 mx-auto mt-2",
        confirmText: "Devam Et",
        confirmTheme: "btn-danger-soft",
        confirmClass: "",
        cancelText: "İptal Et",
        cancelTheme: "btn-outline-secondary",
        cancelClass: "",
        otherText: "",
        otherTheme: "btn-secondary",
        otherClass: "",
        size: "modal-lg",
        callback: () => null,
        cancelCallback: () => null,
        otherCallback: () => null,
      };

      if (type === "info") {
        this.options = {
          ...this.options,
          icon: "info-icon",
          iconTheme: "text-success",
          confirmTheme: "btn-success-soft",
        };
      } else if (type === "warning") {
        this.options = {
          ...this.options,
          icon: "alert-triangle-icon",
          iconTheme: "text-warning",
          confirmTheme: "btn-warning-soft",
        };
      }

      this.options = { ...this.options, ...ctx };
      this.modalPreview = true;
      await this.$nextTick();
      this.$refs.confirmButton.focus();
    },
    cancel() {
      this.modalPreview = false;
      this.options.cancelCallback();
    },
    callback() {
      this.modalPreview = false;
      this.options.callback();
    },
    otherCallback() {
      this.modalPreview = false;
      this.options.otherCallback();
    },
  },
});
</script>
