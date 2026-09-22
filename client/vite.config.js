import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: { port: 5173, strictPort: true },
  preview: {
    // Read PORT in JavaScript so npm start works on Windows and Linux.
    port: Number(process.env.PORT) || 4173,
    strictPort: true,
    allowedHosts: process.env.RAILWAY_PUBLIC_DOMAIN
      ? [process.env.RAILWAY_PUBLIC_DOMAIN]
      : []
  }
});
