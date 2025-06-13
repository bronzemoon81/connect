<template>
  <div
    class="form-group"
    :class="{
      'form-inline': horizontal,
      'has-form-error': errors && errors.length > 0,
    }"
  >
    <div
      v-if="$slots.label || $slots.description"
      class="form-label-container"
      :class="labelClass"
    >
      <div class="flex items-center" v-if="$slots.label">
        <div
          class="form-label flex items-start"
          :class="{
            '!text-danger': errors && errors.length > 0,
            'font-bold': required,
          }"
        >
          <span class="text-red-600 dark:text-slate-300 mr-1" v-if="required">
            *
          </span>
          <slot name="label"></slot>
        </div>
      </div>
      <div
        v-if="$slots.description"
        class="text-xs text-slate-500 dark:text-slate-400/60 mt-1 text-left"
      >
        <slot name="description"></slot>
      </div>
    </div>
    <div class="w-full flex-1">
      <slot></slot>
      <div
        v-if="$_.has($slots, 'bottom-description')"
        class="text-sm text-slate-500 dark:text-slate-400/60 mt-1.5 text-left"
      >
        <slot name="bottom-description"></slot>
      </div>
      <div
        class="col-span-full w-full mt-2 pl-2"
        v-if="errors && errors.length > 0"
      >
        <div
          v-for="(error, index) in errors"
          :key="index"
          class="text-danger mt-1 text-xs"
        >
          {{ $_.get(error, "$message", error) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "FormInputContainer",
  props: {
    required: {
      type: Boolean,
      default: false,
    },
    lang: {
      type: String,
      default: "",
    },
    labelClass: {
      type: String,
      default: "",
    },
    horizontal: {
      type: Boolean,
      default: false,
    },
    errors: {
      type: Array,
      default: () => null,
    },
  },
});
</script>
