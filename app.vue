<template>
  <div id="app" class="bg-gray-900">
    <NavBar />
    <NuxtPage />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { ipcRenderer } from 'electron'
import fs from 'node:fs'

onMounted(() => {
  console.log('ipcRenderer:', ipcRenderer)
  console.log('fs:', fs)
})
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap');

body {
  margin: 0;
  font-family: 'Noto Sans';
}

#app {
  height: 100vh;
  width: 100vw;

  display: grid;
  grid-template-columns: 3rem auto;
}
</style>
