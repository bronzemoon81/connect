<template>
  <input
    v-if="!maskFormat"
    ref="inputRef"
    class="form-control"
    @keydown.enter="onEnterEvent"
    @blur="onBlur"
    v-bind="bindAttrs"
    :value="modelValue"
    @input="changeValue"
    @keypress="onKeypress"
    @focus="onFocus"
  />
  <input
    v-else
    ref="inputRef"
    class="form-control"
    @keydown.enter="onEnterEvent"
    v-bind="bindAttrs"
    v-mask="maskConfig"
    :value="modelValue"
    @input="changeValue"
    @keypress="onKeypress"
    @focus="onFocus"
  />
  <div class="mt-1 text-slate-500 text-right text-xs" v-if="counter">
    Karakter Sayısı: {{ stringLength }}
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { mask, tokens } from "vue-the-mask";
import masker from "vue-the-mask/src/masker";

export default defineComponent({
  name: "FormInput",
  inheritAttrs: false,
  directives: { mask },
  props: {
    modelValue: { default: () => "" },
    modelModifiers: { default: () => ({}) },
    type: { type: String, default: () => "text" },
    maskFormat: { default: "" },
    decimal: { default: null },
    hasError: {
      type: Boolean,
      default: () => false,
    },
    counter: {
      type: Boolean,
      default: () => false,
    },
    disableEnterEvent: {
      type: Boolean,
      default: () => false,
    },
    disableAutocomplete: {
      type: Boolean,
      default: () => true,
    },
    autoNextInputChar: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    stringLength() {
      if ([undefined, null].indexOf(this.modelValue) === -1)
        return this.modelValue.toString().length;
      return 0;
    },
    bindAttrs() {
      let classNames = { "has-error": this.hasError };

      if (typeof this.$attrs.class === "string")
        classNames[this.$attrs.class] = true;
      else if (typeof this.$attrs.class === "object")
        classNames = { ...classNames, ...this.$attrs.class };

      const attrs = {
        name: this.$h.uuid(),
        id: this.$h.uuid(),
        ...this.$attrs,
        type: this.type,
        class: classNames,
      };

      if (this.disableAutocomplete) {
        _.set(attrs, "readOnly", true);
        _.set(attrs, "autocomplete", "off");
      }

      _.unset(attrs, "onUpdate:modelValue");

      return attrs;
    },
    maskConfig() {
      return {
        mask: this.maskFormat,
        masked: false,
        tokens,
      };
    },
  },
  mounted() {
    if (_.get(this.modelModifiers, "lazy")) {
      this.changeValue = _.debounce(this.changeValue, 500);
    }

    setTimeout(() => {
      if (
        this.$refs.inputRef &&
        this.disableAutocomplete &&
        !_.get(this.$attrs, "readonly")
      ) {
        this.$refs.inputRef.readOnly = false;
      }
    }, 500);
  },
  methods: {
    changeValue(e) {
      let str = _.cloneDeep(_.get(e, "target.value", ""));
      if (_.get(this.modelModifiers, "capitalize") && _.isString(str)) {
        str = this.$h.capitalizeEachWords(str);
      }
      if (_.get(this.modelModifiers, "uppercase") && _.isString(str)) {
        str = this.$h.upperCase(str);
      }
      if (this.maskFormat && !this.maskConfig.masked) {
        str = masker(
          str,
          this.maskConfig.mask,
          this.maskConfig.masked,
          this.maskConfig.tokens
        );
      }

      this.$emit("update:modelValue", str);

      if (parseInt(this.autoNextInputChar) > 0) {
        this.onEnterEvent(e);
      }
    },
    onKeypress(e) {
      let keysAllowed = [];
      const selectionStart = _.get(e, "target.selectionStart", "0") * 1;
      const selectionEnd = _.get(e, "target.selectionEnd", "0") * 1;
      const targetValue = _.get(e, "target.value") || "";

      if (
        _.get(this.modelModifiers, "decimal") ||
        _.get(this.modelModifiers, "numeric")
      ) {
        keysAllowed = [
          ...keysAllowed,
          "0",
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
        ];
      }

      const keyPressed = e.key;

      if (_.get(this.modelModifiers, "decimal")) {
        const dotIndex = targetValue.toString().indexOf(".");
        if (
          keyPressed === "." &&
          dotIndex > -1 &&
          (dotIndex < selectionStart || dotIndex >= selectionEnd)
        ) {
          return e.preventDefault();
        }
        keysAllowed = [...keysAllowed, "."];
      }

      if (_.get(this.modelModifiers, "negative") && selectionStart === 0) {
        keysAllowed = [...keysAllowed, "-"];
      }

      if (keysAllowed.length > 0 && !keysAllowed.includes(keyPressed)) {
        e.preventDefault();
      }
    },
    focus() {
      setTimeout(() => {
        if (
          this.$refs.inputRef &&
          typeof this.$refs.inputRef.focus === "function"
        ) {
          this.$refs.inputRef.focus();
        }
      }, 250);
    },
    onEnterEvent(e) {
      if (!this.disableEnterEvent) {
        this.$h.onNextFocus(e);
      }
    },
    onFocus() {
      if (
        this.$refs.inputRef &&
        ["text", "password"].indexOf(this.$refs.inputRef.type) > -1 &&
        typeof this.$refs.inputRef.setSelectionRange === "function"
      ) {
        this.$refs.inputRef.setSelectionRange(0, this.stringLength);
      }
    },
    onBlur() {
      if (_.get(this.modelModifiers, "decimal") && this.decimal) {
        this.$emit(
          "update:modelValue",
          this.$h.round(this.modelValue, this.decimal)
        );
      }
    },
  },
});
</script>
