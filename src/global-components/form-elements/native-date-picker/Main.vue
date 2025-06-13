<template>
  <FormInput v-bind="bindAttrs" v-model="datetime" />
</template>
<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "FormNativeDatePicker",
  props: {
    modelValue: {
      type: String,
      default: "",
    },
    enableTimepicker: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    datetime: {
      get() {
        if (this.enableTimepicker) {
          return this.$h.formatDate(
            this.$h.parseDate(this.modelValue),
            "yyyy-MM-dd'T'HH:mm"
          );
        }

        return this.$h.formatDate(
          this.$h.parseDate(this.modelValue),
          "yyyy-MM-dd"
        );
      },
      set(val) {
        try {
          const date = this.$h.parseDate(val);
          const dateFormat =
            date instanceof Date
              ? this.enableTimepicker
                ? date.toISOString()
                : this.$h.formatDate(date, "yyyy-MM-dd")
              : date;
          this.onChangeValue(dateFormat);
        } catch (e) {}
      },
    },
    bindAttrs() {
      return {
        ...this.$attrs,
        type: this.enableTimepicker ? "datetime-local" : "date",
      };
    },
  },
  mounted() {
    this.onChangeValue = _.debounce(this.onChangeValue, 500);
  },
  methods: {
    onChangeValue(val) {
      this.$emit("update:modelValue", val || null);
    },
  },
});
</script>
