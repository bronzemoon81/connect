<template>
  <button class="btn" :disabled="loading">
    <LoadingIcon icon="oval" class="w-5 h-5" v-if="loading" />
    <template v-else-if="$slots.default" :class="{ 'ml-2': loading }">
      <slot></slot>
    </template>
  </button>
</template>

<script>
export default {
  name: "FormButton",
  props: {
    loading: {
      type: Boolean,
      default: () => false,
    },
    loadingText: {
      type: String,
      default: () => "",
    },
  },
};
</script>
