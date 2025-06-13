<template>
  <div class="form-check" :class="{ 'form-switch': isSwitch }">
    <input
      :id="id || uuid"
      class="form-check-input"
      :type="type"
      :true-value="trueValue"
      :false-value="falseValue"
      :checked="modelValue === trueValue"
      :name="name"
      @input="changeValue"
      :disabled="disabled"
    />
    <label
      :for="id || uuid"
      class="form-check-label cursor-pointer select-none"
      v-if="$slots.label"
    >
      <slot name="label"></slot>
    </label>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "FormCheckbox",
  props: {
    id: {
      default: null,
    },
    modelValue: { default: () => "" },
    value: {
      default: null,
    },
    trueValue: {
      default: true,
    },
    falseValue: {
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    isSwitch: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "checkbox",
    },
    name: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      uuid: this.$h.uuid(),
    };
  },
  methods: {
    changeValue(e) {
      const checked = _.cloneDeep(_.get(e, "target.checked", false));
      this.$emit(
        "update:modelValue",
        checked ? this.trueValue : this.falseValue
      );
    },
  },
});
</script>
