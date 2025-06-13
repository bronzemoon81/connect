<template>
  <div class="input-group">
    <div class="input-group-text">
      <input
        class="form-check-input form-control-lg"
        type="checkbox"
        :true-value="true"
        :false-value="false"
        v-model="checked"
      />
    </div>
    <input
      v-if="checked"
      class="form-control pl-4"
      readonly
      disabled
      :placeholder="placeholder"
    />
    <slot v-else></slot>
  </div>
</template>

<script>
export default {
  name: "FormSelectOrNot",
  props: {
    modelValue: {
      default: null,
    },
    placeholder: {
      default: null,
    },
  },
  data() {
    return {
      checked: !this.$h.isset(this.modelValue),
    };
  },
  watch: {
    checked: {
      handler(val) {
        if (val) {
          this.$emit("update:model-value", null);
        }
      },
      flush: "post",
    },
  },
};
</script>
