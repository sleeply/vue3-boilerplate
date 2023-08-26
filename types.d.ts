import { LocationQueryRaw, RouteParams, RouteLocationRaw } from "vue-router";

export interface Ii18nRoute {
  name: string;
  params?: RouteParams;
  query?: LocationQueryRaw;
}

declare module "vue" {
  interface ComponentCustomProperties {
    $i18nRoute: (route: Ii18nRoute) => RouteLocationRaw;
  }
}
declare module "*.vue" {
  import type { ComponentOptions } from "vue";
  const Component: ComponentOptions;
  export default Component;
}

declare module "*.md" {
  import type { ComponentOptions } from "vue";
  const Component: ComponentOptions;
  export default Component;
}
