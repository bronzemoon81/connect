<template>
  <div
    class="left-0 top-0 w-full h-full flex flex-col items-center justify-center z-[1024] bg-white/60 dark:bg-darkmode-200/60"
    :class="{ fixed: fixed, absolute: !fixed }"
    v-if="show"
  >
    <LoadingIcon icon="puff" class="w-8 h-8 inline-block" />
    <div class="text-lg px-6 py-1 text-center">
      <slot>
        İşleminiz devam ederken lütfen bekleyin
      </slot>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    fixed: {
      type: Boolean,
      default: false,
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
});
</script>
