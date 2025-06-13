<template>
  <Tippy
    :tag="tag"
    href="javascript:;"
    content="Kopyalandı!"
    trigger-click
    @click.prevent.stop="$h.copyToClipboard(text)"
  >
    <slot></slot>
  </Tippy>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Clipboard",
  props: {
    tag: {
      type: String,
      default: "a",
    },
    text: {
      default: "",
    },
  },
});
</script>
