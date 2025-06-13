<template>
  <select
      ref="inputRef"
      class="form-select"
      @keydown.enter.stop.prevent="$h.onNextFocus"
      v-bind="$attrs"
      :value="modelValue"
      @input="changeValue"
      :class="{ 'border-red-100 bg-red-50': hasError }"
  >
    <slot></slot>
  </select>
</template>

<script>
import { defineComponent } from "vue";
import debounce from "debounce";

export default defineComponent({
  name: "FormSelect",
  props: {
    modelValue: { default: () => "" },
    modelModifiers: { default: () => ({}) },
    hasError: {
      type: Boolean,
      default: () => false,
    },
  },
  mounted() {
    if (_.has(this.modelModifiers, "lazy")) {
      this.changeValue = debounce(this.changeValue, 500);
    }
  },
  methods: {
    changeValue(e) {
      let value = _.cloneDeep(_.get(e, "target.value", ""));
      if (value === "true") value = true;
      else if (value === "false") value = false;
      this.$emit(
          "update:modelValue",
          /^-?\d+$/.test(value) ? value * 1 : value
      );
    },
  },
});
</script>
