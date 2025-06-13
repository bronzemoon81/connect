<template>
  <div class="simple-pagination">
    <Tippy
      tag="button"
      content="Önceki Sayfa"
      class="btn btn-icon btn-white"
      @click="prevButton"
    >
      <i class="icon-duotone-alt-arrow-left"></i>
    </Tippy>

    <FormInput
      class="bg-white w-14 text-center font-bold"
      :model-value="page"
      :model-modifiers="{ numeric: true }"
      @keydown.enter="onChangePage"
      @blur="onChangePage"
      disable-enter-event
    />

    <div class="h-0.5 w-1.5 bg-slate-500"></div>

    <FormSelect
      class="bg-white w-20 text-center font-bold"
      :model-value="perpage"
      @input="changePerPage"
      disable-enter-event
    >
      <option value="10">10</option>
      <option value="25">25</option>
      <option value="50">50</option>
      <option value="100">100</option>
      <option value="250">250</option>
      <option value="500">500</option>
      <option value="1000">1000</option>
    </FormSelect>

    <Tippy
      tag="button"
      content="Sonraki Sayfa"
      class="btn btn-icon btn-white"
      @click="nextButton"
    >
      <i class="icon-duotone-alt-arrow-right"></i>
    </Tippy>

    <slot name="append"></slot>
  </div>
</template>

<script>
export default {
  name: "SimplePagination",
  props: {
    dataLength: {
      type: Number,
      default: 0,
    },
    page: {
      type: Number,
      default: 1,
    },
    perpage: {
      type: Number,
      default: 25,
    },
    onRefresh: {
      type: Function,
      default: null,
    },
  },
  methods: {
    clickButton(page) {
      if (page < 1) page = 1;
      if (this.page * 1 !== page) {
        this.$emit("update:page", page);
      }
    },
    prevButton() {
      if (this.page > 1) {
        this.clickButton(this.page - 1);
      }
    },
    nextButton() {
      this.clickButton(this.page + 1);
    },
    onChangePage(e) {
      const page = _.get(e, "target.value") || this.page;
      this.clickButton(page * 1);
    },
    changePerPage(e) {
      this.$emit("update:perpage", _.get(e, "target.value", this.perpage));
    },
  },
};
</script>
