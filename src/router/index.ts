import {
  createWebHistory,
  createMemoryHistory,
  createRouter,
} from "vue-router";
import {
  DEFAULT_LOCALE,
  getBrowserLocale,
  i18n,
  loadLocaleMessages,
  setI18nLanguage,
} from "@/i18n";
import { SUPPORT_LOCALES } from "@/utils/constants";

const routes: any[] = [];
const routeNames: string[] = [];

const childRoutes = [
  {
    path: "",
    name: "Home",
    component: () => import("@/views/Home/index.vue"),
  },
];

let history = import.meta.env.SSR ? createMemoryHistory() : createWebHistory();

const checkIfArrayIsUnique = (myArray: string[]) => {
  return myArray.length === new Set(myArray).size;
};

const recursiveChildren = (locale: any, children: any): any => {
  if (!children || children.length === 0) {
    return;
  }

  const recChildren: any = [];
  children.forEach((child: any) => {
    routeNames.push(child.name);
    recChildren.push({
      ...child,
      name: `${locale}_${child.name}`,
      children: recursiveChildren(locale, child.children),
    });
  });
  return recChildren;
};

SUPPORT_LOCALES.forEach((locale: string) => {
  routes.unshift({
    path: `/${locale === DEFAULT_LOCALE ? "" : locale}`,
    // component: {
    //   template: "<router-view></router-view>",
    // },
    children: recursiveChildren(locale, childRoutes),
  });
});

if (checkIfArrayIsUnique(routeNames))
  throw new Error("Route names must be unique");

const isServer = typeof window === "undefined";

const beforeEach = async (to: any, from: any, next: any) => {
  if (!isServer) {
    window.scrollTo({
      top: 0,
    });
  }

  let paramsLocale;

  SUPPORT_LOCALES.forEach((locale) => {
    const regex = new RegExp(
      `/${locale}/${locale.length + 1 === to.path.length ? `|/${locale}` : ""}`
    );
    let m;
    if ((m = regex.exec(to.path)) !== null) {
      paramsLocale = m[0].slice(1, locale.length + 1);
    }
  });

  paramsLocale = paramsLocale === undefined ? DEFAULT_LOCALE : paramsLocale;

  const newLocale = getBrowserLocale();
  // use locale if paramsLocale is not in SUPPORT_LOCALES

  if (!SUPPORT_LOCALES.includes(paramsLocale)) {
    return next({ name: `${newLocale}_Home` });
  }

  // load locale messages
  if (!i18n.global.availableLocales.includes(paramsLocale)) {
    await loadLocaleMessages(i18n, paramsLocale);
  }
  // set i18n language
  setI18nLanguage(i18n, paramsLocale);

  return next();
};

export default function () {
  const router = createRouter({
    history,
    routes,
  });

  router.beforeEach(beforeEach);

  return router;
}
