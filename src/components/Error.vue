<script setup lang="ts">
import { defineProps } from "vue";
defineProps<{
  error: string;
}>();
</script>

<template>
  <div class="error">
    <h2>
      {{ error }} soooooo this is like... a long ass error message or something
      LOL pls sadjknbgsdjkgnb Lorem ipsum dolor sit, amet consectetur
      adipisicing elit. Saepe maiores modi quis id, ducimus aut cumque earum.
      Fuga cumque saepe beatae vitae corrupti voluptates, hic aliquam suscipit,
      minima magni ex. Lorem ipsum dolor sit amet consectetur adipisicing elit.
      Id odio odit iste nam. Sequi, voluptas cupiditate illum voluptatum harum
      dolor, distinctio enim doloribus porro beatae deserunt reiciendis adipisci
      aut ea!
    </h2>
  </div>
</template>

<style scoped>
.error {
  width: 88vw;
  max-height: 300px;
  background-color: rgb(193, 38, 38);
  border-radius: 10px;
  padding: 20px;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  overflow-y: scroll;
}
</style>
