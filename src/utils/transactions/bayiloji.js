import { useTransactionStore } from "@/stores/transaction-store";

export class Bayiloji {
  model = null;
  store = null;
  apiDelay = 1000;

  constructor() {
    this.store = useTransactionStore();
  }

  async process() {
    if (!this.store.processing) return;
    await this.truncate();
    await this.fetch();
  }

  async truncate() {
    await this.model.truncate();
  }

  async fetch(page = 1, perpage = 250) {}
}
