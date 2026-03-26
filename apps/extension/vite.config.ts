import { resolve } from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: "manifest.json",
          dest: "."
        }
      ]
    })
  ],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        sidepanel: resolve(__dirname, "sidepanel/index.html"),
        popup: resolve(__dirname, "popup/index.html"),
        serviceWorker: resolve(__dirname, "background/service-worker.ts"),
        contentScript: resolve(__dirname, "content/content-script.ts")
      },
      output: {
        entryFileNames(chunk) {
          if (chunk.name === "serviceWorker") {
            return "background/service-worker.js";
          }
          if (chunk.name === "contentScript") {
            return "content/content-script.js";
          }
          return "assets/[name].js";
        },
        chunkFileNames: "chunks/[name]-[hash].js",
        assetFileNames: ({ name }) => {
          if (name?.endsWith(".css")) {
            return "assets/[name]";
          }
          return "assets/[name]-[hash][extname]";
        }
      }
    }
  }
});
