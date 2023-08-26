import { buildApp } from "./app";

const { app, router, pinia } = buildApp();

// @ts-ignore
const storeInitialState = window.INITIAL_DATA;
if (storeInitialState) {
  pinia.state.value = storeInitialState;
}
const root = "#app";
router.isReady().then(() => {
  app.mount(root);
});
