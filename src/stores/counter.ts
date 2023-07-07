import { defineStore } from "pinia";
import type { ICounter } from "@/models/ICounters";

export const useCounter = defineStore("count", {
  state: (): ICounter => ({
    count: 0,
  }),
  getters: {
    doubleCount(): number {
      return this.count;
    },
  },
  actions: {
    increment() {
      this.count++;
    },
  },
});
