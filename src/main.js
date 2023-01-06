import { buildApp } from "./app";

const { app, router, pinia } = buildApp();

const storeInitialState = window.INITIAL_DATA;
if (storeInitialState) {
  pinia.state.value = storeInitialState;
}
// wait until router is ready before mounting to ensure hydration match
router.isReady().then(() => {
  app.mount("#app");
});
