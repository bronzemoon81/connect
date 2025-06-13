<template>
  <tr ref="element" class="relative">
    <template v-if="visible">
      <slot></slot>

      <template v-if="showing">
        <div
          class="absolute left-0 top-0 w-full h-full z-20 bg-slate-100/95 dark:bg-darkmode-100/25 rounded-lg flex items-center px-6"
        >
          <div v-if="waiting || processingRecord">
            <LoadingIcon
              icon="oval"
              class="w-5 h-5 inline-block"
              :class="{ 'animate-spin': processingRecord }"
            />
            <span class="ml-3" v-if="waiting"> Kuyrukta bekliyor </span>
            <span class="ml-3" v-if="processingRecord">
              İşleminiz gerçekleştirilirken lütfen bekleyin
            </span>
          </div>
          <div v-if="error">
            <div class="text-danger text-xs font-medium line-clamp-1">
              {{ error }}
            </div>
            <div>
              <a
                href="javascript:;"
                class="font-medium"
                @click="removeError(item.id)"
              >
                <small> Hatayı Kapat </small>
              </a>
            </div>
          </div>
        </div>
      </template>
    </template>
    <td v-else colspan="100%" :style="{ height: `${height}px` }">
      <div></div>
    </td>
  </tr>
</template>

<script>
export default {
  name: "TableRow",
  props: {
    index: {
      required: true,
    },
    item: {
      required: true,
    },
    height: {
      type: Number,
      default: 44,
    },
    processing: { type: Boolean, default: false },
    virtual: { type: Boolean, default: false },
    transactionIds: { type: Array, default: () => [] },
    pendingTransactionIds: { type: Array, default: () => [] },
    errors: { type: Array, default: () => [] },
    removeError: { required: true },
  },
  data() {
    return {
      intersecting: false,
      observer: null,
    };
  },
  computed: {
    visible() {
      return !this.virtual || this.intersecting;
    },
    waiting() {
      return (
        this.processing && this.pendingTransactionIds.indexOf(this.item.id) > -1
      );
    },
    processingRecord() {
      return this.processing && this.transactionIds.indexOf(this.item.id) > -1;
    },
    error() {
      const index = _.findIndex(this.errors, { id: this.item.id });
      return _.get(this.errors, `${index}.error`, "");
    },
    showing() {
      return this.waiting || this.processingRecord || !!this.error;
    },
  },
  mounted() {
    if (this.virtual) {
      this.observer = new IntersectionObserver(this.onIntersection, {
        rootMargin: "150px 0px 150px 0px",
        // threshold: 0.5, // percentage of target's visible area. Triggers "onIntersection"
      });
      this.observer.observe(this.$refs.element);
    }
  },
  methods: {
    async onIntersection([{ isIntersecting }]) {
      this.intersecting = isIntersecting;
    },
  },
};
</script>
