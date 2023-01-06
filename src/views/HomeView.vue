<script setup lang='ts'>
// @ts-ignore
import HomeIndex from '@/features/Home/HomeIndex.vue'
import { ref } from 'vue-demi'
const opener = ref<boolean>(false)
const open = () => {
  opener.value = !opener.value
}
</script>

<template>
  <div>
    <button @click="open()"> open </button>
    <template v-if="opener">
      <HomeIndex @opener="open" />
    </template>
  </div>
</template>

<style lang="scss" scoped>

</style>