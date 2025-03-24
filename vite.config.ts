import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  optimizeDeps: {
    exclude: ["ses"],
  },
  plugins: [react()],
  server: {
    proxy: {
      "/indonesia-api": {
        target: "https://www.emsifa.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/indonesia-api/, "/api-wilayah-indonesia/api"),
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
