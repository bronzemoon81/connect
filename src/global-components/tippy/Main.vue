<template>
  <component :is="tag" ref="tippyRef" v-show="!hiddenEmptyContent || !!content">
    <slot></slot>
  </component>
</template>

<script setup>
import { ref, inject, onMounted } from "vue";
import tippy, { roundArrow, animateFill } from "tippy.js";

const props = defineProps({
  content: {
    required: true,
  },
  tag: {
    type: String,
    default: "span",
  },
  options: {
    type: Object,
    default: () => ({}),
  },
  refKey: {
    type: String,
    default: null,
  },
  triggerClick: {
    type: Boolean,
    default: false,
  },
  hiddenEmptyContent: {
    type: Boolean,
    default: false,
  },
});

const tippyRef = ref();
const init = () => {
  if (!props.content) return;
  const options = {
    plugins: [animateFill],
    content: props.content,
    arrow: roundArrow,
    popperOptions: {
      modifiers: [
        {
          name: "preventOverflow",
          options: {
            rootBoundary: "viewport",
          },
        },
      ],
    },
    animateFill: false,
    animation: "shift-away",
    placement: "bottom",
    zIndex: 10000,
    touch: false,
    ...props.options,
  };

  if (props.triggerClick) {
    _.set(options, "trigger", "click");
    _.set(options, "onShow", (instance) => {
      setTimeout(() => {
        instance.hide();
      }, 1000);
    });
  }

  tippy(tippyRef.value, options);
};

const bindInstance = () => {
  if (props.refKey) {
    const bind = inject(`bind[${props.refKey}]`);
    if (bind) {
      bind(tippyRef.value);
    }
  }
};

onMounted(() => {
  init();
  bindInstance();
});
</script>
