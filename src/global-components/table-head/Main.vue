<template>
  <th :class="{ 'cursor-pointer': activeSortBy }" @click="changeSortBy">
    <div class="inline-flex items-center gap-1">
      <template v-if="activeSortBy && visibleIcon">
        <i
          class="icon-duotone-sort-from-top-to-bottom text-xs"
          v-if="sortDirection === 'asc'"
        ></i>
        <i class="icon-duotone-sort-from-bottom-to-top text-xs" v-else></i>
      </template>
      <slot></slot>
    </div>
  </th>
</template>
<script>
export default {
  name: "TableHead",
  props: {
    column: {
      type: String,
      default: "",
    },
    modelValue: {
      default: "",
    },
  },
  computed: {
    activeSortBy() {
      return !!this.column;
    },
    visibleIcon() {
      return this.sortColumn === this.column;
    },
    sortColumn() {
      const arr = (this.modelValue || "").toString().split(":");
      return _.get(arr, 0) || "";
    },
    sortDirection() {
      const arr = (this.modelValue || "").toString().split(":");
      return _.get(arr, 1) || "asc";
    },
  },
  methods: {
    changeSortBy() {
      if (!this.activeSortBy) return;
      const direction =
        this.sortColumn !== this.column || this.sortDirection !== "asc"
          ? "asc"
          : "desc";
      this.$emit("update:model-value", `${this.column}:${direction}`);
    },
  },
};
</script>
