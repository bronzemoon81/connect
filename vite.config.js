import { fileURLToPath, URL } from "node:url";
import { rmSync } from "node:fs";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import electron from "vite-plugin-electron";
import renderer from "vite-plugin-electron-renderer";
import pkg from "./package.json";
import copy from "rollup-plugin-copy";

rmSync("dist-electron", { recursive: true, force: true });

const isDevelopment =
  process.env.NODE_ENV === "development" || !!process.env.VSCODE_DEBUG;
const isProduction = process.env.NODE_ENV === "production";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  plugins: [
    vue(),
    electron([
      {
        // Main-Process entry file of the Electron App.
        entry: "electron/main/index.js",
        onstart(options) {
          if (process.env.VSCODE_DEBUG) {
            console.log(
              /* For `.vscode/.debug.script.mjs` */ "[startup] Electron App"
            );
          } else {
            options.startup();
          }
        },
        vite: {
          build: {
            sourcemap: isDevelopment,
            minify: isProduction,
            outDir: "dist-electron/main",
            rollupOptions: {
              external: Object.keys(
                "dependencies" in pkg ? pkg.dependencies : {}
              ),
            },
          },
        },
      },
      {
        entry: "electron/preload/index.js",
        onstart(options) {
          // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete,
          // instead of restarting the entire Electron App.
          options.reload();
        },
        vite: {
          build: {
            sourcemap: isDevelopment,
            minify: isProduction,
            outDir: "dist-electron/preload",
            rollupOptions: {
              external: Object.keys(
                "dependencies" in pkg ? pkg.dependencies : {}
              ),
            },
          },
        },
      },
    ]),
    copy({
      targets: [
        {
          src: "electron/connections",
          dest: "dist-electron",
        },
      ],
    }),
    renderer({
      nodeIntegration: true,
    }),
  ],
  server: !!process.env.VSCODE_DEBUG
    ? (() => {
        const url = new URL(pkg.debug.env.VITE_DEV_SERVER_URL);
        return {
          host: url.hostname,
          port: +url.port,
        };
      })()
    : undefined,
  clearScreen: false,
});
