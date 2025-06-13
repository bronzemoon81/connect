import { useTransactionStore } from "@/stores/transaction-store";

export class Compare {
  model = null;
  store = null;

  constructor() {
    this.store = useTransactionStore();
  }

  async process() {
    if (!this.store.processing) return;
    await this.compare();
  }

  async compare() {}
}
