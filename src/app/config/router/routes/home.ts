import { RouteRecordRaw } from "vue-router";

export const HomeRoutes: RouteRecordRaw[] = [
  {
    path: "",
    name: "Home",
    component: () => import("@/views/Home/HomeIndex.vue")
  },
  {
    path: "about",
    name: "About",
    component: () => import("@/views/About/AboutIndex.vue")
  },
];
