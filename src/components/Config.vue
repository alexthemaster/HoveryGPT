<script setup lang="ts">
import { ref } from "vue";
import { config, saveConfig } from "../store.js";

const disabled = ref(true);
const disabledDelete = ref(config.shortcut.length < 1);

function setShortcut(e: KeyboardEvent) {
  if (config.shortcut.includes(e.key == " " ? "Space" : e.key)) return;
  if (config.shortcut.length > 2) return;
  if (e.key == " ") return config.shortcut.push("Space");
  config.shortcut.push(e.key);
  checkShortcutDisabled();
}

function deleteShortcut() {
  config.shortcut = [];
  checkShortcutDisabled();
}

function checkShortcutDisabled() {
  disabledDelete.value = config.shortcut.length < 1;
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
    <h2>
      No configuration has been found, please set up Hovery GPT! (Tip: you can
      always return to this page by using the context menu in your tray)
    </h2>
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
  <div class="shortcut">
    <input
      id="shortcut"
      v-on:keydown="setShortcut"
      :value="config.shortcut.join('+')"
      readonly
      style="margin-bottom: 0"
    />
    <button @click="deleteShortcut" :disabled="disabledDelete">Delete</button>
  </div>

  <button @click="saveConfig" :disabled="disabled">Save</button>
</template>

<style scoped>
input {
  margin-bottom: 10px;
}

.shortcut {
  display: flex;
  margin-bottom: 10px;
}
</style>
