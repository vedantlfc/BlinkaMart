import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      includeManifestIcons: false,
      injectRegister: "auto",
      registerType: "autoUpdate",
      manifest: {
        name: "DopeCart",
        short_name: "DopeCart",
        description:
          "DopeCart is a playful parody ordering app. We deliver Dopamine.",
        id: "/",
        start_url: "/",
        scope: "/",
        display: "standalone",
        orientation: "portrait",
        theme_color: "#241c35",
        background_color: "#fff8ea",
        categories: ["lifestyle", "entertainment", "food"],
        icons: [
          {
            src: "/pwa/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/pwa/maskable-icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "/pwa/maskable-icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        cleanupOutdatedCaches: true,
        globPatterns: ["**/*.{js,css,html,png,svg,webmanifest}"],
        navigateFallback: "/index.html",
        runtimeCaching: [
          {
            urlPattern: ({ url }) =>
              url.origin === location.origin &&
              url.pathname.startsWith("/product-images/") &&
              url.pathname.endsWith(".jpg"),
            handler: "CacheFirst",
            options: {
              cacheName: "dopecart-product-images-v1",
              cacheableResponse: {
                statuses: [0, 200],
              },
              expiration: {
                maxEntries: 180,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
        ],
      },
    }),
  ],
});
