import { createApp } from "vue";
import { createPinia } from "pinia";

import "@/assets/scss/app.scss";

import App from "@/App.vue";
import { setupRouter } from "@/router";
import "@/libs";
import utils from "@/utils/properties";
import components from "@/global-components";

const app = createApp(App);

app.use(createPinia());
app.use(setupRouter());

utils(app);
components(app);

app.config.unwrapInjectedRef = true;

app.mount("#app");
