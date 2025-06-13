<template>
  <div class="ace-container">
    <div ref="input"></div>
  </div>
</template>
<script>
import ace from "ace-builds";
import theme from "ace-builds/src-noconflict/theme-dracula";
import mode from "ace-builds/src-noconflict/mode-json";

ace.config.setModuleUrl("ace/mode/json", mode);
ace.config.setModuleUrl("ace/theme/dracula", theme);

export default {
  name: "AceJSONEditor",
  emits: ["update:model-value"],
  props: {
    modelValue: {
      default: null,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      editor: null,
    };
  },
  watch: {
    modelValue: {
      handler(val) {
        if (val !== this.editor.getValue()) {
          this.editor.setValue(val);
        }
      },
      flush: "post",
    },
  },
  mounted() {
    this.editor = ace.edit(this.$refs.input, {
      maxLines: 50,
      minLines: 2,
      fontSize: 14,
      theme: "ace/theme/dracula",
      mode: "ace/mode/json",
      tabSize: 4,
      wrap: true,
      printMargin: false,
      value: _.cloneDeep(this.modelValue),
      readOnly: this.readonly,
    });

    this.editor.on("input", () => {
      if (this.readonly) return;
      this.$emit("update:model-value", this.editor.getValue());
    });
  },
  beforeUnmount() {
    if (this.editor) this.editor.destroy();
  },
};
</script>
