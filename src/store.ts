import { reactive } from "vue";
import type { Config } from "../electron/main";

const config = reactive<Config>(await window.ipcRenderer.invoke("getConfig"));

async function saveConfig() {
  config.firstTime = false;
  await window.ipcRenderer.invoke("saveConfig", JSON.stringify(config));
}

export { config, saveConfig };
