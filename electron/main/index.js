import { app, BrowserWindow, shell, ipcMain, Menu, Tray } from "electron";
import { release } from "node:os";
import { join, basename } from "node:path";
import { autoUpdater } from "electron-updater";
// import "./bugsnag";

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.NODE_ENV = app.isPackaged ? "production" : "development";
process.env.DIST_ELECTRON = join(__dirname, "..");
process.env.DIST = join(process.env.DIST_ELECTRON, "../dist");
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, "../public")
  : process.env.DIST;

let isQuiting = process.env.NODE_ENV === "development";
let win = null;
let tray = null;

// Disable GPU Acceleration for Windows 7
if (release().startsWith("6.1")) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

// Here, you can also use other preload
const preload = join(__dirname, "../preload/index.js");
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, "index.html");

const fs = require("fs");
async function createWindow() {
  win = new BrowserWindow({
    title: "CONNECT",
    icon: join(process.env.PUBLIC, "icons/icon.ico"),
    width: 1120,
    height: 624,
    minWidth: 720,
    minHeight: 624,
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: true,
    },
  });

  // Otomatik güncelleme kontrolü
  if (process.env.NODE_ENV === "production") {
    autoUpdater.checkForUpdatesAndNotify();
  }

  if (process.env.VITE_DEV_SERVER_URL) {
    // electron-vite-vue#298
    win.loadURL(url);
    // Open devTool if the app is not packaged
    win.webContents.openDevTools();
  } else {
    win.loadFile(indexHtml);
  }

  win.on("close", (e) => {
    if (!isQuiting) {
      e.preventDefault();
      if (process.platform === "darwin") app.dock.hide();
      win.hide();
    }
  });

  win.on("show", (e) => {
    if (process.platform === "darwin") app.dock.show();
  });

  // Test actively push message to the Electron-Renderer
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url);
    return { action: "deny" };
  });

  const exeName = basename(process.execPath);
  let isOpenAtLogin = app.getLoginItemSettings().openAtLogin;

  tray = new Tray(join(process.env.PUBLIC, "icons/tray-icon.png"));
  const contextMenu = Menu.buildFromTemplate([
    {
      label:
        import.meta.env.VITE_APP_NAME +
        " Version: " +
        import.meta.env.VITE_APP_VERSION,
      enabled: false,
    },
    { type: "separator" },
    {
      label: "Uygulamayı Göster / Gizle",
      click: () => {
        if (win.isVisible()) app.quit();
        else win.show();
      },
    },
    {
      id: "auto-run",
      type: "checkbox",
      checked: isOpenAtLogin,
      label: "Otomatik Başlatma",
      toolTip:
        "Eğer bilgisayarınızda oturum açtığınızda bu programın otomatik olarak başlamasını istiyorsanız, burayı etkinleştirin.",
      click() {
        isOpenAtLogin = !isOpenAtLogin;

        app.setLoginItemSettings({
          openAtLogin: isOpenAtLogin,
          path: app.getPath("exe"),
          args: [
            "--processStart",
            `"${exeName}"`,
            "--process-start-args",
            `"--hidden"`,
          ],
        });
      },
    },
    { type: "separator" },
    {
      label: "Çıkış Yap",
      click: () => {
        isQuiting = true;
        app.quit();
      },
    },
  ]);
  tray.setToolTip(import.meta.env.VITE_APP_NAME);
  tray.setContextMenu(contextMenu);
}

app.whenReady().then(createWindow);

app.on("will-quit", (e) => {
  if (isQuiting) return;

  e.preventDefault();
});

app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") app.quit();
});

app.on("second-instance", () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

// New window example arg: new windows url
ipcMain.handle("open-win", (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: true,
    },
  });

  // childWindow.setIcon(join(process.env.PUBLIC, "icon.png"));

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: arg });
  }
});

ipcMain.on("application-reload", (e, msg) => {
  if (msg === true) win.reload();
});

// Otomatik güncelleme olayları
autoUpdater.on("update-available", () => {
  win?.webContents.send("update-available");
});

autoUpdater.on("update-downloaded", () => {
  win?.webContents.send("update-downloaded");
});

// IPC olayları için güncelleme işleyicileri
ipcMain.on("install-update", () => {
  autoUpdater.quitAndInstall();
});
