import "highlight.js/styles/atom-one-dark.css";
import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import App from "./App.vue";
import Chat from "./components/Chat.vue";
import Config from "./components/Config.vue";
import "./style.css";

const routes = [
  {
    path: "/",
    component: Chat,
  },
  {
    path: "/config",
    component: Config,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

createApp(App).use(router).mount("#app");
