import { RouterView } from "vue-router";

import BayilojiOperations from "@/views/operations/bayiloji/Main.vue";
import ErpOperations from "@/views/operations/erp/Main.vue";
import B2bSettings from "@/views/operations/B2bSettings/Main.vue";

export default {
  path: "operations",
  component: RouterView,
  children: [
    {
      path: "bayiloji",
      name: "operations.bayiloji",
      component: BayilojiOperations,
    },
    {
      path: "erp",
      name: "operations.erp",
      component: ErpOperations,
    },
    {
      path: "settings",
      name: "operations.settings",
      component: B2bSettings,
    },
  ],
};
