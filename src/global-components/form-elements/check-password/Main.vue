<template>
  <div>
    <div class="input-group">
      <Tippy
        tag="button"
        content="Rastgele Şifre Oluşturun"
        class="btn btn-secondary-soft dismiss-select"
        @click="generateRandomPassword"
        v-if="generate"
      >
        <KeyIcon class="w-5 h-5" />
      </Tippy>
      <FormInput
        ref="inputRef"
        :model-value="modelValue"
        :model-modifiers="modelModifiers"
        @update:model-value="(val) => $emit('update:model-value', val)"
        :disable-enter-event="disableEnterEvent"
        :type="hidden ? 'password' : 'text'"
        disable-autocomplete
        v-bind="$attrs"
      />
      <button
        class="btn btn-secondary-soft dismiss-select"
        @click="hidden = !hidden"
      >
        <LockIcon v-if="hidden" class="w-5 h-5 icon-bold" />
        <UnlockIcon v-else class="w-5 h-5 icon-bold" />
      </button>
    </div>
    <div class="flex mt-2" v-if="visibleStrength">
      <div
        class="w-full h-1 rounded-lg bg-slate-300 mr-2"
        :class="{
          'bg-red-400': strength === 1,
          'bg-yellow-400': strength === 2,
          'bg-blue-400': strength === 3,
          'bg-green-400': strength === 4,
        }"
      ></div>
      <div
        class="w-full h-1 rounded-lg bg-slate-300 mr-2"
        :class="{
          'bg-red-400': strength === 1,
          'bg-yellow-400': strength === 2,
          'bg-blue-400': strength === 3,
          'bg-green-400': strength === 4,
        }"
      ></div>
      <div
        class="w-full h-1 rounded-lg bg-slate-300 mr-2"
        :class="{
          'bg-yellow-400': strength === 2,
          'bg-blue-400': strength === 3,
          'bg-green-400': strength === 4,
        }"
      ></div>
      <div
        class="w-full h-1 rounded-lg bg-slate-300 mr-2"
        :class="{
          'bg-blue-400': strength === 3,
          'bg-green-400': strength === 4,
        }"
      ></div>
      <div
        class="w-full h-1 rounded-lg bg-slate-300"
        :class="{
          'bg-green-400': strength === 4,
        }"
      ></div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { PasswordCheckService } from "@/libs/password-strength";

export default defineComponent({
  name: "FormCheckPassword",
  props: {
    modelValue: { default: () => "" },
    modelModifiers: { default: () => ({}) },
    disableEnterEvent: {
      type: Boolean,
      default: () => false,
    },
    visibleStrength: {
      type: Boolean,
      default: () => true,
    },
    generate: {
      type: Boolean,
      default: () => true,
    },
  },
  data() {
    return {
      hidden: true,
      strength: 0,
    };
  },
  watch: {
    modelValue: {
      handler(val) {
        const passwordCheckStrength = new PasswordCheckService();
        this.strength = passwordCheckStrength.checkPasswordStrength(val);
      },
      flush: "post",
    },
  },
  methods: {
    generateRandomPassword() {
      this.$emit("update:model-value", this.$h.generateRandomPassword());
    },
    focus() {
      this.$refs.inputRef.focus();
    },
  },
});
</script>
