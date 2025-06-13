import { useTransactionStore } from "@/stores/transaction-store";
import { helper } from "@/utils/properties/helper";
import { useErrorStore } from "@/stores/error-store";
import { ToastNotify } from "@/libs/toast-notify";

export class ServiceAbstract {
  name = "";

  lastWorkingTime = null;

  methods = [];

  expect = [];

  store = null;

  errorStore = null;

  duration = 1000 * 60 * 60 * 24 * 30;

  constructor() {
    this.store = useTransactionStore();
    this.errorStore = useErrorStore();
  }

  async process(methods = []) {
    if (methods.length > 0) this.methods = methods;
    else this.methods = ["server", "compare", "equalize"];

    this.lastWorkingTime =
      window.localStorage.getItem(`${this.name}LastWorkingTime`) || null;

    const nowUnix = new Date().getTime();
    const diff = nowUnix - (this.lastWorkingTime || 0);

    if (diff > this.duration) this.methods.unshift("bayiloji");

    this.methods = this.methods.filter((o) => this.expect.indexOf(o) === -1);

    await this.call();
  }

  async call() {
    const method = this.methods.shift();
    if (!this.store.processing || !method) return;

    if (typeof this[method] === "function") {
      this.store.insertLog(this.name, method);

      await helper.sleep(1000);

      try {
        const startTime = new Date().getTime();
        await this[method]();
        const endTime = new Date().getTime();

        this.store.setRunningTime(this.name, method, endTime - startTime);

        const errorCount = this.errorStore.count(method);

        ToastNotify({
          className: "warning",
          text: `${errorCount} Satırda hata oluştu. Oluşan Hatalar sayfasından kontrol ediniz.`,
        });

        this.store.insertLog(
          this.name,
          method,
          errorCount === 0 ? "success" : "warning"
        );
      } catch (err) {
        this.store.insertLog(this.name, method, "fail", err.message);

        this.errorStore.insert({
          uuid: this.store.identifier,
          service: this.name,
          method: method,
          request: null,
          response: null,
          message: err.message || "",
        });

        throw err;
      }
    }

    await this.call();
  }

  async bayiloji() {
    window.localStorage.setItem(
      `${this.name}LastWorkingTime`,
      new Date().getTime().toString()
    );
  }
  async server() {}
  async compare() {}
  async equalize() {}
}
