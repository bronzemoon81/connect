import { defineStore } from "pinia";
import { localDatabase } from "@/utils/properties/local-database";
import { helper } from "@/utils/properties/helper";

export const useErrorStore = defineStore("error", {
  state: () => {
    return {
      current: [],
      hash: [],
      errors: [],
      service: null,
    };
  },
  actions: {
    async fetch(service) {
      this.service = service;
      await this.reset();
      this.current = await localDatabase().errors.get({
        service: this.service,
        select: ["method", "hash"],
      });
    },
    async reset() {
      this.current = [];
      this.hash = [];
      this.errors = [];
    },
    hasHash(hash) {
      const bool = _.findIndex(this.current, { hash }) > -1;
      if (bool) this.hash.push(hash);
      return bool;
    },
    insert(ctx = {}) {
      const { request = null } = ctx;
      if (!request || !this.hasHash(helper.md5(request)))
        this.errors.push(_.cloneDeep(ctx));
    },
    count(method = null) {
      const currentHashList = this.current.filter((item) => {
        return !method || item.method === method;
      });

      const hashCount = currentHashList.filter(
        (o) => this.hash.indexOf(o.hash) > -1
      ).length;

      return (
        hashCount +
        this.errors.filter((item) => {
          return (
            item.service === this.service && (!method || item.method === method)
          );
        }).length
      );
    },
    async save() {
      await localDatabase().errors.delete({
        where: { service: this.service },
        whereNotIn: { hash: _.cloneDeep(this.hash) },
      });
      if (this.errors.length > 0) {
        await localDatabase().errors.insert(_.cloneDeep(this.errors));
      }
      await this.reset();
    },
  },
});
