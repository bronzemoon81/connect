<template>
  <div v-if="visible" class="hu-color-picker-container" @click="close">
    <VueColorPicker
      theme="light"
      :color="color"
      :colors-default="colorsDefault"
      @changeColor="onChange"
      class="absolute"
      :style="{ top: `${top}px`, left: `${left}px` }"
      @click.prevent.stop
    />
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { ColorPicker as VueColorPicker } from "vue-color-kit";

export default defineComponent({
  name: "ColorPicker",
  components: { VueColorPicker },
  setup() {
    const visible = ref(false);
    const color = ref("");
    const top = ref(0);
    const left = ref(0);
    const callback = ref((val) => {
      console.log(val);
    });

    const colorsDefault = [
      "#ED9005",
      "#0E1822",
      "#5e5e5e",
      "#FFB243",
      "#2DD4BF",
      "#F47365",
      "#FF1900",
      "#6EFF2A",
      "#00BEFF",
      "#2E81FF",
      "#5D61FF",
      "#FC3CAD",
      "#BF3DCE",
    ];

    const show = (props) => {
      color.value = props.color;
      top.value = props.top || 0;
      left.value = props.left || 0;
      callback.value = props.onChange;
      visible.value = true;
    };

    const close = () => {
      visible.value = false;
    };

    const onChange = (color) => {
      const red = _.get(color, "rgba.r");
      const green = _.get(color, "rgba.g");
      const blue = _.get(color, "rgba.b");
      const alpha = _.get(color, "rgba.a", 1);
      if (alpha < 1) callback.value(`rgba(${red},${green},${blue},${alpha})`);
      else callback.value(_.get(color, "hex"));
    };

    return {
      visible,
      color,
      top,
      left,
      colorsDefault,
      show,
      close,
      onChange,
    };
  },
});
</script>
