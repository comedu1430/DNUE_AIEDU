import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/DNUE_AIEDU/",
  plugins: [react()],
  resolve: {
    alias: {
      process: "process/browser",
      util: "util",
    },
  },
  define: {
    global: "globalThis",
  },
});
