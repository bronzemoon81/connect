<template>
  <textarea
      ref="inputRef"
      class="form-control"
      v-bind="bindAttrs"
      :value="modelValue"
      @input="changeValue"
      @focus="onFocus"
  >
  </textarea>
  <div class="mt-0 text-indigo-600 text-right text-xs" v-if="counter">
    Karakter Sayısı: {{ stringLength }}
  </div>
</template>

<script>
import { defineComponent } from "vue";
import debounce from "debounce";
import capitalizeFirstLetter from "@/utils/properties/helper";

export default defineComponent({
  name: "FormTextarea",
  inheritAttrs: false,
  props: {
    modelValue: { default: () => "" },
    modelModifiers: { default: () => ({}) },
    hasError: {
      type: Boolean,
      default: () => false,
    },
    counter: {
      type: Boolean,
      default: () => false,
    },
    disableAutocomplete: {
      type: Boolean,
      default: () => true,
    },
  },
  computed: {
    stringLength() {
      if ([undefined, null].indexOf(this.modelValue) === -1)
        return this.modelValue.toString().length;
      return 0;
    },
    bindAttrs() {
      let classNames = { "border-red-100 bg-red-50": this.hasError };

      if (typeof this.$attrs.class === "string")
        classNames[this.$attrs.class] = true;
      else if (typeof this.$attrs.class === "object")
        classNames = { ...classNames, ...this.$attrs.class };

      const attrs = {
        name: this.$h.uuid(),
        id: this.$h.uuid(),
        ...this.$attrs,
        class: classNames,
      };

      if (this.disableAutocomplete) {
        _.set(attrs, "readOnly", true);
        _.set(attrs, "autocomplete", this.$h.uuid());
      }

      _.unset(attrs, "onUpdate:modelValue")

      return attrs;
    },
  },
  mounted() {
    if (_.has(this.modelModifiers, "lazy")) {
      this.changeValue = debounce(this.changeValue, 500);
    }

    setTimeout(() => {
      if (this.disableAutocomplete && !_.get(this.$attrs, "readonly", false)) {
        this.$refs.inputRef.readOnly = false;
      }
    }, 500);
  },
  methods: {
    changeValue(e) {
      let str = _.cloneDeep(_.get(e, "target.value", ""));
      if (_.has(this.modelModifiers, "capitalize") && _.isString(str)) {
        str = this.$h.capitalizeFirstLetter(str);
      }
      if (_.has(this.modelModifiers, "uppercase") && _.isString(str)) {
        str = this.$h.upperCase(str);
      }
      this.$emit("update:modelValue", str);
    },
    onFocus() {
      if (
          this.$refs.inputRef &&
          typeof this.$refs.inputRef.setSelectionRange === "function"
      ) {
        this.$refs.inputRef.setSelectionRange(0, this.stringLength);
      }
    },
  },
});
</script>
