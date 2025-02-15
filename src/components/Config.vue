<script setup lang="ts">
import { ref } from "vue";
import { config, saveConfig } from "../store.js";

const disabled = ref(true);

function setShortcut(e: KeyboardEvent) {
  if (e.key == "Backspace") return (config.shortcut.length = 0);
  if (config.shortcut.length > 2) return;
  config.shortcut.push(e.key);
}

defineEmits(["close"]);

const urlRegex =
  /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i;

addEventListener("keyup", () => {
  disabled.value =
    !config.baseUrl ||
    !urlRegex.test(config.baseUrl) ||
    !config.apiKey ||
    !config.model ||
    !config.shortcut.length;
});
</script>

<template>
  <template v-if="config.firstTime">
    <h2>No config has been found, please set up Hovery GPT!</h2>
    <h3>
      Tip: you can always return to this page by using the context menu in your
      tray
    </h3>
  </template>
  <label for="base-url">Base URL:</label>
  <input
    id="base-url"
    v-model.trim="config.baseUrl"
    type="url"
    placeholder="Enter base URL"
  />

  <label for="api-key">API Key:</label>
  <input
    id="api-key"
    v-model.trim="config.apiKey"
    type="password"
    placeholder="Enter API key"
  />

  <label for="model">Model:</label>
  <input
    id="model"
    v-model.trim="config.model"
    type="text"
    required
    placeholder="Enter model name"
  />

  <label for="shortcut">Shortcut for opening Hovery GPT:</label>
  <label style="font-size: 50%"
    >Tip: Use Backspace to delete current shortcut</label
  >
  <input
    id="shortcut"
    v-on:keydown="setShortcut"
    :value="config.shortcut.join('+')"
    readonly
  />

  <button @click="saveConfig" :disabled="disabled">Save</button>
</template>

<style scoped>
input {
  margin-bottom: 10px;
}
</style>
