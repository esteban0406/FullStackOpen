import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
    host: "localhost",
    port: 5173,
    strictPort: true,
    cors: true,
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./testSetup.js",
    coverage: {
      enabled: true,
      reporter: ["text"], // optional: adds terminal + HTML output
    },
  },
});
