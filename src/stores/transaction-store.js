import { defineStore } from "pinia";
import { useAuthStore } from "@/stores/auth-store";
import { useErrorStore } from "@/stores/error-store";
import { helper } from "@/utils/properties/helper";
import { dateFns } from "@/utils/properties/date-fns";
import { serverDatabase } from "@/utils/properties/server-database";
import { localDatabase } from "@/utils/properties/local-database";
import { CategoryService } from "@/utils/transactions/category";
import { StaffService } from "@/utils/transactions/staff";
import { CompanyGroupService } from "@/utils/transactions/company-group";
import { CompanyService } from "@/utils/transactions/company";
import { CompanyBalanceService } from "@/utils/transactions/company-balance";
import { CompanyFicheService } from "@/utils/transactions/company-fiche";
import { ProductService } from "@/utils/transactions/product";
import { ProductLotService } from "@/utils/transactions/product-lot";
import { PricesService } from "@/utils/transactions/prices";
import { PriceListService } from "@/utils/transactions/price-list";
import { PhotoService } from "@/utils/transactions/photos";

const SERVICES = {
  photos: PhotoService,
  priceList: PriceListService,
  staff: StaffService,
  category: CategoryService,
  companyGroup: CompanyGroupService,
  company: CompanyService,
  companyBalance: CompanyBalanceService,
  companyFiche: CompanyFicheService,
  product: ProductService,
  productLot: ProductLotService,
  prices: PricesService,
};
export const useTransactionStore = defineStore("transaction", {
  state: () => {
    const cron = serverDatabase().cron;

    return {
      processing: false,
      services: [],
      nextRunTime:
        cron > 0 ? dateFns.addMinutes(new Date(), cron).getTime() : null,
      logs: [],
      identifier: null,
      runningTimes: {},
      counts: {},
    };
  },
  actions: {
    async process(ctx = {}) {
      this.nextRunTime = null;
      if (this.processing || !useAuthStore().token()) return;

      // todo: Hata yazdırma olaylarını iyileştirelim.
      // Hataların hepsini bir anda çekip ram i doldurma
      // Sadece hash sütununu çek ve karşılaştır
      // Karşılaştırma yapılan listede hash varsa o listeden yeni listeye taşı
      // İşlem görmemiş hash leri sildir gitsin
      // Yeni alınan hataları ekleme yap

      this.runningTimes = {};
      this.identifier = helper.uuid();
      this.logs = [];
      this.processing = true;

      console.warn("Veri Çekme & Karşılatırma & Gönderme İşlemlerine Başlandı");

      const { services = [], methods = [] } = ctx;

      if (services.length > 0) this.services = _.cloneDeep(services);
      else this.services = _.cloneDeep(_.keys(SERVICES));

      await this.activeServices();

      await this.call(methods);
      console.warn("Veri Çekme & Karşılatırma & Gönderme İşlemleri Bitti");
      this.processing = false;

      this.resetNextRunTime();
    },
    stop() {
      this.processing = false;
    },

    async call(methods = []) {
      const service = this.services.shift();
      if (!this.processing || !service) return;

      const errorStore = useErrorStore();
      await errorStore.fetch(service);

      if (SERVICES[service]) {
        try {
          await new SERVICES[service](this.insertLog.bind(this)).process(
            methods,
          );
        } catch (e) {
          return;
        }
      }

      await errorStore.save();
      await this.call();
    },
    insertLog(service, method, status = null, message = null) {
      const index = _.findIndex(this.logs, { service, method });
      if (index > -1) {
        this.logs[index].status = status;
        this.logs[index].message = message;
      } else this.logs.push({ service, method, status, message });
    },
    resetNextRunTime() {
      const cron = serverDatabase().cron;

      this.nextRunTime =
        cron > 0 ? dateFns.addMinutes(new Date(), cron).getTime() : null;
    },
    async activeServices() {
      await localDatabase()
        .settings.getActiveSqlQueries()
        .then((results) => {
          // console.log({ results });
          const active = [
            "staff",
            "category",
            "companyGroup",
            "priceList",
            ...results.map((item) => item.type),
          ];

          this.services = this.services.filter((o) => active.indexOf(o) > -1);
        });
    },
    setRunningTime(service, method, time) {
      this.runningTimes[`${service}.${method}`] = time;
    },
    methodText(val) {
      switch (val) {
        case "bayiloji":
          return "Bayilojiden Veriler Çekiliyor";
        case "server":
          return "Sunucudan Veriler Çekiliyor";
        case "compare":
          return "Veriler Karşılaştırılıyor";
        case "equalize":
          return "Bayiloji & Sunucucu Verileri Eşitleniyor";
        default:
          return "";
      }
    },
    serviceText(val) {
      switch (val) {
        case "photos":
          return "Ürün Fotoğrafları";
        case "staff":
          return "Personel";
        case "company":
          return "Cari";
        case "companyBalance":
          return "Cari Bakiye Devri";
        case "companyFiche":
          return "Cari Fiş";
        case "companyGroup":
          return "Cari Grubu";
        case "category":
          return "Ürün Kategorileri";
        case "product":
          return "Ürün";
        case "productLot":
          return "Ürün Lotu";
        case "prices":
          return "Ürün Fiyatları";
        case "priceList":
          return "Ürün Fiyat Listeleri";
        default:
          return "";
      }
    },
    setCount(service, method, value = 0) {
      _.set(this.counts, `${service}.${method}`, value);
    },
    // decreaseCount(service, method, value = 0) {
    //   let total = _.get(this.counts, `${service}.${method}`, 0);
    //   total -= value;
    //   if (total < 0) total = 0;
    //   _.set(this.counts, `${service}.${method}`, total);
    // },
  },
});
