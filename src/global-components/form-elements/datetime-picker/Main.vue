<template>
  <Datepicker v-model="date" v-bind="bindAttrs" :format="previewFormat" />
</template>
<script>
import { defineComponent } from "vue";
import Datepicker from "@vuepic/vue-datepicker";

export default defineComponent({
  name: "FormDatetimePicker",
  components: {
    Datepicker,
  },
  props: {
    modelValue: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "Tarih Seçin",
    },
    utc: {
      type: Boolean,
      default: true,
    },
    enableTimepicker: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    date: {
      get() {
        return this.$h.parseDate(this.modelValue);
      },
      set(value) {
        this.setValues(value);
      },
    },
    bindAttrs() {
      return {
        locale: "tr",
        position: "left",
        monthNameFormat: "long",
        minutesGridIncrement: "1",
        autoApply: true,
        autoPosition: false,
        transitions: false,
        monthChangeOnScroll: false,
        calendarClassName: "dp-custom-calendar",
        calendarCellClassName: "dp-custom-cell",
        inputClassName: "dp-custom-input",
        menuClassName: "dp-custom-menu",
        ...this.$attrs,
        utc: this.utc,
        placeholder: this.placeholder,
        enableTimePicker: this.enableTimepicker,
      };
    },
  },
  methods: {
    setValues(from) {
      const fromText = this.enableTimepicker
          ? from
          : this.$h.formatDate(from, "yyyy-MM-dd");

      this.$emit("update:modelValue", fromText);
      this.$emit("date:changed", { from: fromText, to: fromText });
    },
    previewFormat(date) {
      return this.$h.formatDate(
          date,
          this.enableTimepicker ? "dd.MM.yyyy HH:mm" : "dd.MM.yyyy"
      );
    },
  },
});
</script>
