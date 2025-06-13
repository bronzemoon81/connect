<template>
  <div ref="containerRef">
    <div ref="handsontableRef"></div>
  </div>
</template>

<script>
import { defineComponent, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { IsCompare } from "@/libs/is-compare";

export default defineComponent({
  name: "Handsontable",
  props: {
    modelValue: {
      type: Array,
      default: [],
    },
    options: {
      type: Object,
      required: true,
    },
    afterHeight: {
      type: Number,
      default: 0,
    },
  },
  setup(props, { emit }) {
    const containerRef = ref();
    const handsontableRef = ref();
    const handsontable = ref();

    const init = () => {
      if (!handsontableRef.value) return;
      const { top = 0 } = containerRef.value.getBoundingClientRect();
      let height =
        window.document.documentElement.offsetHeight -
        (top + window.scrollY) +
        props.afterHeight;
      if (height < 500) height = 500;

      const options = {
        height,
        stretchH: "all",
        rowHeaders: true,
        colHeaders: true,
        ...props.options,
        data: _.cloneDeep(props.modelValue || []),
        afterCreateCol() {
          emitData();
          if (typeof props.options.afterCreateCol === "function")
            props.options.afterCreateCol(...arguments);
        },
        afterRemoveCol() {
          emitData();
          if (typeof props.options.afterRemoveCol === "function")
            props.options.afterRemoveCol(...arguments);
        },
        afterCreateRow() {
          emitData();
          if (typeof props.options.afterCreateRow === "function")
            props.options.afterCreateRow(...arguments);
        },
        afterRemoveRow() {
          emitData();
          if (typeof props.options.afterRemoveRow === "function")
            props.options.afterRemoveRow(...arguments);
        },
        afterSetDataAtCell() {
          emitData();
          if (typeof props.options.afterSetDataAtCell === "function")
            props.options.afterSetDataAtCell(...arguments);
        },
      };

      if (props.options.columns) {
        options.columns = (_.get(props.options, "columns") || []).map(
          (column) => {
            return {
              ...column,
              // data: (row = null) => _.get(row, column.data, ""),
            };
          }
        );
      }

      handsontable.value = new Hansontable(handsontableRef.value, options);
    };

    watch(
      () => props.modelValue,
      (val, oldVal) => {
        if (!IsCompare(oldVal, val)) {
          loadData(val);
        }
      },
      { flush: "post", deep: true }
    );

    const loadData = (val) => {
      if (handsontable.value) {
        handsontable.value.loadData(val);
      }
    };

    const getData = () => {
      if (handsontable.value) {
        return handsontable.value.getData();
      }
      return [];
    };

    const emitData = () => {
      setTimeout(() => {
        emit("update:model-value", _.cloneDeep(getData()));
      }, 100);
    };

    onMounted(() => {
      init();
    });

    onBeforeUnmount(() => {
      if (handsontable.value) {
        handsontable.value.destroy();
        handsontable.value = null;
      }
    });

    return {
      containerRef,
      handsontableRef,
      loadData,
      getData,
    };
  },
});
</script>
