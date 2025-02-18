import {
  app,
  BrowserWindow,
  dialog,
  globalShortcut,
  ipcMain,
  Menu,
  nativeImage,
  Tray,
} from "electron";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import OpenAI from "openai";

// const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;
let tray: Tray | null;

const configPath = path.join(app.getPath("userData"), "settings.json");
let config: Config | null;
let client: OpenAI | null;

async function loadConfig(): Promise<Config> {
  try {
    config = JSON.parse(await readFile(configPath, "utf-8")) as Config;
    loadOpenClient(config);
  } catch (err) {
    config = {
      firstTime: true,
      baseUrl: "https://api.openai.com/v1",
      shortcut: [],
      apiKey: "",
      model: "gpt-4o-mini",
    };
  } finally {
    return config!;
  }
}

function loadOpenClient(config: Config) {
  client = new OpenAI({
    baseURL: config.baseUrl,
    apiKey: config.apiKey,
  });
}

function loadTray() {
  tray = new Tray(
    nativeImage.createFromPath(path.join(process.env.VITE_PUBLIC, "icon.png"))
  );
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Open Hovery GPT",
      type: "normal",
      click: () => {
        changeRoute("/");
        win?.show();
        win?.focus();
      },
    },
    {
      label: "Open Configuration",
      type: "normal",
      click: () => {
        changeRoute("/config");
        win?.show();
        win?.focus();
      },
    },
    {
      label: "Quit",
      type: "normal",
      click: () => {
        win?.close();
        win = null;
        app.quit;
        process.exit();
      },
    },
  ]);

  tray.on("click", () => {
    if (win?.isVisible()) return win.hide();
    win?.show();
  });

  tray.setToolTip("Hovery GPT");
  tray.setContextMenu(contextMenu);
}

async function afterReady() {
  await loadConfig();
  loadTray();

  win = new BrowserWindow({
    icon: nativeImage.createFromPath(
      path.join(process.env.VITE_PUBLIC, "icon.png")
    ),
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
    },
    show: config!.firstTime,
    titleBarStyle: "hidden",
    autoHideMenuBar: true,
  });
  win.setMenu(null);
  // win.webContents.openDevTools();

  win.on("close", (e) => {
    e.preventDefault();
    win?.hide();
  });

  win.on("hide", () => {
    win?.webContents.send("resetState");
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }

  if (config!.shortcut.length) {
    registerShortcut();
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    afterReady();
  }
});

app.on("second-instance", () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.whenReady().then(afterReady);

ipcMain.handle("error", (_, msg) => {
  dialog.showErrorBox("Error", msg);
});

ipcMain.handle("getConfig", () => {
  return config;
});

ipcMain.handle("saveConfig", async (_, newConfigJSON) => {
  await writeFile(configPath, newConfigJSON, "utf-8");
  const newConfig: Config = JSON.parse(newConfigJSON);

  if (
    config?.baseUrl !== newConfig.baseUrl ||
    config?.apiKey !== newConfig.apiKey
  ) {
    loadOpenClient(newConfig);
  }

  config = newConfig;
  registerShortcut();
  changeRoute("/");
});

ipcMain.handle("sendMessage", async (_, messages: string | GPTContent[]) => {
  messages = JSON.parse(messages as string) as GPTContent[];

  if (config?.developerPrompt) {
    messages.push({ role: "developer", content: config.developerPrompt });
  }

  const stream = await client?.chat.completions
    .create({
      model: config?.model ?? "gpt-4o-mini",
      messages,
      stream: true,
    })
    .catch((err) => {
      win?.webContents.send("streamDone", `An error occured: ${err}`);
    });

  if (!stream) return;

  for await (const chunk of stream) {
    win?.webContents.send("messageStream", chunk.choices[0].delta.content);
    if (chunk.choices[0].finish_reason) {
      return win?.webContents.send("streamDone");
    }
  }
});

ipcMain.handle("hide", () => {
  win?.hide();
});

function changeRoute(route: string) {
  win?.webContents.send("changeRoute", route);
}

function registerShortcut() {
  globalShortcut.unregisterAll();
  globalShortcut.register(config!.shortcut.join("+"), () => {
    if (win?.isVisible()) win.hide();
    else {
      changeRoute("/");
      win?.show();
      win?.focus();
    }
  });
}

export interface Config {
  firstTime: boolean;
  baseUrl: string;
  apiKey: string;
  model: string;
  shortcut: string[];
  developerPrompt?: string;
}

export interface GPTContent {
  role: "user" | "assistant" | "developer";
  content: string;
}
