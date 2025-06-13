<template>
  <div class="ace-container">
    <div ref="input"></div>
  </div>
</template>
<script>
import ace from "ace-builds";
import themeSQL from "ace-builds/src-noconflict/theme-sqlserver";
import modeSQL from "ace-builds/src-noconflict/mode-sql";

ace.config.setModuleUrl("ace/mode/sql", modeSQL);
ace.config.setModuleUrl("ace/theme/sqlserver", themeSQL);

export default {
  name: "AceSQLEditor",
  emits: ["update:model-value"],
  props: {
    modelValue: {
      default: null,
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
      maxLines: 20,
      minLines: 20,
      fontSize: 14,
      theme: "ace/theme/sqlserver",
      mode: "ace/mode/sql",
      tabSize: 4,
      wrap: true,
      printMargin: false,
      value: _.cloneDeep(this.modelValue),
      placeholder: "SQL sorgusunu bu alana yazabilirsiniz...",
    });

    this.editor.on("input", () => {
      this.$emit("update:model-value", this.editor.getValue());
    });
  },
  beforeUnmount() {
    if (this.editor) this.editor.destroy();
  },
};
</script>
