<script setup lang="ts">
import { useLanguage } from "@/utils/language";

const { i18n, switchLanguage, SUPPORT_LOCALES } = useLanguage();
</script>

<template>
  <div>
    <!-- <button> {{ i18n }} </button> -->
    <button @click="switchLanguage()">lang {{}}</button>
    <button
      v-for="(lang, index) in SUPPORT_LOCALES"
      :key="index"
      @click="switchLanguage(lang)"
      :class="{
        active: lang === i18n.global.locale.value,
      }"
    >
      {{ lang }}
    </button>
  </div>
</template>

<style lang="scss" scoped>
button{
  &.active{
    background: black;
    color: lightblue;
  }
}
</style>
