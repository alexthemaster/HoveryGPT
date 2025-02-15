<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
window.ipcRenderer.on("changeRoute", (_, route) => {
  router.push(route);
});
</script>

<template>
  <RouterView></RouterView>
</template>
