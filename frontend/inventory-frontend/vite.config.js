// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000", // Flask backend
        changeOrigin: true,
        secure: false,
        // If Flask is down, fallback to JSON Server
        configure: (proxy) => {
          proxy.on("error", (err, req, res) => {
            console.warn("⚠️ Flask unavailable, switching to JSON Server...");
            const fallback = require("http").request(
              {
                hostname: "localhost",
                port: 3001, // JSON Server port
                path: req.url.replace("/api", ""), // strip /api prefix
                method: req.method,
                headers: req.headers,
              },
              (fbRes) => {
                res.writeHead(fbRes.statusCode, fbRes.headers);
                fbRes.pipe(res);
              },
            );
            req.pipe(fallback);
          });
        },
      },
    },
  },
});
