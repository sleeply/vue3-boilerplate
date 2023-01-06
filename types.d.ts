import { LocationQueryRaw, RouteParams } from "vue-router";

export interface InI18nRoute {
    name: string;
    params?: RouteParams;
    query?: LocationQueryRaw;
  }
  

declare module "vue" {
  interface ComponentCustomProperties{
    $i18nRoute:( route: InI18nRoute):RouteLocationRaw => void; 
  }
}
