<script setup lang="ts">
import { useClickOutside } from "@/composables/useClickOutside";
import { useCounter } from "@/stores/counter";
import { useLanguage } from "@/utils/language";
import { ref, defineEmits } from "vue";

const counter = useCounter();

const { switchLanguage } = useLanguage()
const domRef = ref<Event>()

const emits = defineEmits<{
  (e: 'opener'): void
}>()

useClickOutside(domRef, () => {
  emits("opener")
})
</script>

<template>
  <div class="mainamdw" ref="domRef">
    <button @click="switchLanguage()"> switchlanguage {{ $t("hello") }} </button>
    <br>
    <button @click="counter.increment()">count me {{ counter.count }}</button>
    <router-link  :to="$i18nRoute({
      name: 'About'
    })">about me</router-link>
    <p>
      this is a home page
    </p>
  </div>
</template>
