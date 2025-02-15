<script setup lang="ts">
import { nextTick, ref, useTemplateRef } from "vue";
import { useRouter } from "vue-router";
import type { GPTContent } from "../../electron/main";
import { config } from "../store";
import Markdown from "./Markdown.vue";

const router = useRouter();
if (config.firstTime) router.push("/config");

const msg = ref<string>("");
const msgDiv = useTemplateRef("msgDiv");
const input = useTemplateRef("input");
const messages = ref<GPTContent[]>([]);
const disabled = ref<boolean>(true);
const inputDisabled = ref(false);
const streamedMessage = ref("");
const error = ref("");

window.ipcRenderer.on("resetState", () => {
  messages.value = [];
});

window.ipcRenderer.on("messageStream", (_, msg) => {
  if (!msg) return;
  streamedMessage.value += msg;
  scrollMessages();
});

window.ipcRenderer.on("streamDone", (_, err) => {
  if (err) {
    error.value = err;
    inputDisabled.value = false;
  }
  messages.value.push({
    role: "assistant",
    content: streamedMessage.value,
  });

  streamedMessage.value = "";

  inputDisabled.value = false;
  nextTick(() => {
    addCopyCode();
    input.value?.focus();
  });
});

// Thank you Rob O'Leary https://www.roboleary.net/2022/01/13/copy-code-to-clipboard-blog.html
function addCopyCode() {
  let blocks = document.querySelectorAll("pre:has(code)");
  let copyButtonLabel = "Copy Code";

  blocks.forEach((block) => {
    let button = document.createElement("button");

    button.innerText = copyButtonLabel;
    block.appendChild(button);

    button.addEventListener("click", async () => {
      let code = block.querySelector("code");
      let text = code!.innerText;

      await navigator.clipboard.writeText(text);
    });
  });
}

async function sendMessage() {
  if (!msg.value.trim()) return;
  disabled.value = true;
  inputDisabled.value = true;

  messages.value.push({
    role: "user",
    content: msg.value.trim(),
  });
  msg.value = "";

  await window.ipcRenderer.invoke(
    "sendMessage",
    JSON.stringify(messages.value)
  );

  nextTick(() => {
    scrollMessages();
  });
}

function scrollMessages() {
  const top = msgDiv!.value!.scrollHeight;
  msgDiv!.value!.scroll({ top, behavior: "smooth" });
}

function checkDisabled() {
  if (!msg.value.trim()) disabled.value = true;
  else disabled.value = false;
}
</script>

<template>
  <div class="messages" ref="msgDiv">
    <template v-for="message of messages">
      <div :class="`message ${message.role}`">
        <Markdown :md="message.content" />
      </div>
    </template>
    <template v-if="!!streamedMessage">
      <div class="message assistant">
        <Markdown :md="streamedMessage" />
      </div>
    </template>
    <template v-if="error">
      <div class="message error">
        <Markdown :md="error" />
      </div>
    </template>
  </div>
  <div class="input-container">
    <input
      v-model="msg"
      type="text"
      id="message-input"
      ref="input"
      placeholder="Type a message..."
      v-on:keyup="checkDisabled"
      v-on:keyup.enter="sendMessage"
      :disabled="inputDisabled"
    />
    <button :disabled="disabled" style="order: 2" @click="sendMessage">
      Send
    </button>
  </div>
</template>

<style>
.messages {
  display: flex;
  height: 100%;
  flex-direction: column;
  padding-right: 5px;
  overflow-y: scroll;
  gap: 10px;
}

.message {
  padding: 12px;
  border-radius: 10px;
  max-width: 85ch;
  text-overflow: ellipsis;
  text-wrap: wrap;
  font-size: 14px;
}

pre:has(code) {
  position: relative;
  margin: 5px 0;
  padding: 1.75rem 0 1.75rem 1rem;
}

pre:has(code) button {
  position: absolute;
  top: 5px;
  right: 5px;
}

pre {
  overflow: auto;
  max-width: 85ch;
}

.assistant {
  background: #40414f;
  color: white;
  align-self: flex-start;
}

.error {
  color: rgb(227, 45, 45);
}

.user {
  background: #428c6d;
  color: white;
  align-self: flex-end;
}

.input-container {
  display: flex;
  padding-top: 5px;
}

button {
  margin-left: 10px;
}
</style>
