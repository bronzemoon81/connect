import LayoutDefault from "@/layouts/default/Main.vue";
import LayoutLogin from "@/layouts/login/Main.vue";

import NotFoundView from "@/views/error-page/Main.vue";

import Login from "@/views/auth/login/Main.vue";

import Welcome from "@/views/welcome/Main.vue";
import Home from "@/views/home/Main.vue";
import Settings from "@/views/settings/Main.vue";
import Monitor from "@/views/monitor/Main.vue";
import ErrorTracking from "@/views/error-tracking/Main.vue";

// import operations from "./operations";

export default [
  {
    path: "/",
    component: LayoutDefault,
    children: [
      {
        path: "/",
        name: "home",
        component: Home,
      },
      {
        path: "/settings",
        name: "settings",
        component: Settings,
      },
      {
        path: "/monitor",
        name: "monitor",
        component: Monitor,
      },
      {
        path: "/error-tracking",
        name: "error-tracking",
        component: ErrorTracking,
      },
      // operations,
    ],
    meta: { requiresAuth: true },
  },
  {
    path: "/auth",
    component: LayoutLogin,
    children: [
      {
        path: "login",
        name: "login",
        component: Login,
      },
    ],
    meta: { requiresGuest: true },
  },
  {
    path: "/welcome",
    name: "welcome",
    component: Welcome,
    meta: { requiresAuth: true },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "page.notfound",
    component: NotFoundView,
  },
];
