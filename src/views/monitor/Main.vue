<template>
  <div class="container-xs p-10">
    <teleport to="#top-navigation__icon">
      <i class="icon-duotone-monitor"></i>
    </teleport>

    <teleport to="#top-navigation__title">
      <span>Anlık Takip Ekranı</span>
    </teleport>

    <teleport to="#top-navigation__description">
      <span>
        Uygulama & Bayiloji arasında gerçekleşen işlemleri anlık olarak buradan
        takip edebilirsiniz.
      </span>
    </teleport>

    <div
      class="alert alert-danger-soft flex gap-6"
      v-if="$h.isset(tooManyAttempts)"
    >
      <div class="flex-shrink-0">
        <i class="icon-duotone-history-2 animate-pulse text-3xl"></i>
      </div>
      <div class="flex-1">
        Üzgünüz, çok fazla deneme hatası aldık ve {{ tooManyAttempts }} saniye
        boyunca hesabınıza erişim engellendi. Bu önlem, hesabınızın güvenliğini
        korumak amacıyla alınmıştır.
      </div>
    </div>

    <template v-else>
      <div class="alert alert-pending-soft flex gap-6" v-if="!processing">
        <div class="flex-shrink-0">
          <i class="icon-duotone-sleeping-circle animate-pulse text-3xl"></i>
        </div>
        <div class="flex-1">
          <div class="font-bold text-lg">
            Senkronizasyon için görev bekleniyor...
          </div>
          <div class="text-xl" v-if="visibleRemainingTime">
            Sonraki senkronizasyon için
            <span class="font-bold">{{ remainingTime }}</span> kaldı.
          </div>
          <div class="btn-group btn-group-sm justify-end mt-4">
            <button
              class="btn btn-success uppercase gap-2 font-bold !px-4"
              @click="run"
            >
              <span>Çalıştır</span>
            </button>
          </div>
        </div>
      </div>

      <div class="alert alert-success-soft flex gap-6" v-else>
        <div class="flex-shrink-0">
          <i
            class="icon-duotone-refresh animate-spin inline-block text-3xl"
          ></i>
        </div>
        <div class="flex-1">
          <div class="font-bold">Senkronizasyon yapılıyor...</div>
          <div class="text-sm">
            Tüm senkronizasyon işlemlerinin gerçekleşmesi biraz zaman alabilir.
          </div>
          <div class="btn-group btn-group-sm justify-end mt-4">
            <button
              class="btn btn-pending-soft uppercase gap-2 font-bold !px-4"
              @click="onStop"
            >
              <span>Durdur</span>
            </button>
          </div>
        </div>
      </div>
    </template>

    <template v-if="visible">
      <div class="box mt-4">
        <div
          class="flex items-center gap-4 pb-4 mb-4 text-base border-b border-slate-200/60 dark:border-darkmode-400"
        >
          <div class="flex-1 flex items-start gap-2 font-bold">
            <i class="icon-duotone-alt-arrow-down"></i>
            <div>
              <div>Yapılan İşlemler</div>
              <div class="font-normal text-sm text-slate-500">
                İşlem Numarası:
                <Clipboard
                  tag="span"
                  :text="transactionId"
                  class="font-bold cursor-pointer"
                >
                  {{ transactionId }}
                </Clipboard>
              </div>
            </div>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="table table-sm table-secondary">
            <thead>
              <th>Servis</th>
              <th>İşlem</th>
              <th class="text-center">Durum</th>
              <th class="text-center">Süre</th>
            </thead>
            <tbody>
              <tr v-for="row in transactionLogs">
                <td>{{ transactionStore.serviceText(row.service) }}</td>
                <td>
                  <div>{{ transactionStore.methodText(row.method) }}</div>
                  <div class="text-xs text-danger" v-if="row.message">
                    {{ row.message }}
                  </div>
                </td>
                <td class="text-center">
                  <template v-if="row.status === null">
                    <Tippy
                      tag="i"
                      content="İşleme Devam Ediyor"
                      class="icon-duotone-refresh inline-block animate-spin text-pending"
                      v-if="processing"
                    ></Tippy>
                    <Tippy
                      tag="i"
                      content="İşlem Yarıda Kesildi"
                      class="icon-duotone-close-circle inline-block text-danger"
                      v-else
                    ></Tippy>
                  </template>
                  <Tippy
                    tag="i"
                    content="Başarılı"
                    class="icon-duotone-check-circle inline-block text-success"
                    v-else-if="row.status === 'success'"
                  ></Tippy>
                  <Tippy
                    tag="i"
                    content="Başarısız Oldu"
                    class="icon-duotone-close-circle inline-block text-danger"
                    v-else-if="row.status === 'fail'"
                  ></Tippy>
                  <Tippy
                    tag="i"
                    content="Bazı Kayıtlarda Hata Oluştu"
                    class="icon-duotone-info-circle inline-block text-pending"
                    v-else-if="row.status === 'warning'"
                  ></Tippy>
                </td>
                <td class="text-center text-xs">
                  <span
                    class="font-semibold"
                    v-if="processing && row.status === null"
                  >
                    {{
                      $_.get(
                        transactionStore.counts,
                        `${row.service}.${row.method}`,
                        0
                      )
                    }}
                    Kayıt
                  </span>
                  <template v-else>
                    {{
                      $h
                        .millisecondToDay(
                          $_.get(runningTimes, `${row.service}.${row.method}`)
                        )
                        .millisecondToString()
                    }}
                  </template>
                </td>
              </tr>
              <tr>
                <td colspan="2" class="text-right text-sm">
                  Toplam Çalışma Süresi:
                </td>
                <td colspan="2" class="text-center text-sm font-bold">
                  {{
                    $h.millisecondToDay(totalRunningTime).millisecondToString()
                  }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import { defineComponent } from "vue";
import { mapStores } from "pinia";
import { useSystemStore } from "@/stores/system-store";
import { useTransactionStore } from "@/stores/transaction-store";

export default defineComponent({
  name: "Monitor",
  data() {
    return {
      visible: false,
      remainingTime: null,
    };
  },
  inject: ["confirmRef"],
  computed: {
    processing() {
      return this.transactionStore.processing;
    },
    transactionLogs() {
      return this.transactionStore.logs;
    },
    transactionId() {
      return this.transactionStore.identifier;
    },
    visibleRemainingTime() {
      return this.transactionStore.nextRunTime !== null;
    },
    tooManyAttempts() {
      return this.systemStore.tooManyAttempts;
    },
    runningTimes() {
      return this.transactionStore.runningTimes;
    },
    totalRunningTime() {
      return _.sum(_.values(this.runningTimes));
    },
    ...mapStores(useSystemStore, useTransactionStore),
  },
  watch: {
    processing: {
      handler(val) {
        if (val) this.listening();
      },
      flush: "post",
    },
  },
  mounted() {
    if (this.processing) this.listening();
    this.calcRemainingTime();
  },
  methods: {
    listening() {
      this.visible = true;
    },
    run() {
      this.transactionStore.process();
    },
    calcRemainingTime() {
      this.remainingTime = this.$h
        .diffTimeByNow(this.transactionStore.nextRunTime / 1000)
        .toString();

      setTimeout(() => {
        this.calcRemainingTime();
      }, 1000);
    },
    onStop() {
      this.confirmRef.show("warning", {
        text: "Senkronizasyon işlemini iptal etmek istiyor musunuz?",
        callback: () => {
          this.transactionStore.stop();
        },
      });
    },
  },
});
</script>
