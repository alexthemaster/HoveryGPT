<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
window.ipcRenderer.on("changeRoute", (_, route) => {
  router.push(route);
});

addEventListener("keydown", (e) => {
  if (e.key == "Escape") window.ipcRenderer.invoke("hide");
});
</script>

<template>
  <RouterView></RouterView>
</template>
