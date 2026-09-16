import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// HydroRisk frontend. Talks to the FastAPI backend (main.py) which
// defaults to http://127.0.0.1:8000 - see src/lib/api.js.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
});
