import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// User site (Dyaus2.github.io) is served from the domain root → base "/".
export default defineConfig({
  base: "/",
  plugins: [react()],
  build: {
    target: "es2020",
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three"],
          r3f: ["@react-three/fiber", "@react-three/drei", "@react-three/postprocessing"],
          gsap: ["gsap"],
        },
      },
    },
  },
});
