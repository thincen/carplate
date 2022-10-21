// vite.config.js
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
export default defineConfig({
     server: {
         host: "0.0.0.0",
     },
    base: "/carplate/",
    assetsInclude: ["/changelog.md","/version.info"],
    plugins: [
      VitePWA({
        registerType: "autoUpdate",
        // base:"/cwqi/",
        includeAssets:["img/**/*.png"],
        manifest: {
          "name": "carplate",
          "short_name": "carplate",
          "display": "fullscreen",
          //"display": "standalone",
          "start_url": "index.html",
          "theme_color": "#130f40",
          "background_color": "#130f40",
          //"background_color": "#aaaaff",
          "description": "demo",
          "icons": [
            {
              "src": "img/logo/apple-touch-icon.png",
              "sizes": "180x180",
              "type": "image/png"
            },
            {
              "src": "img/logo/android-chrome-512x512.png",
              "sizes": "512x512",
              "type": "image/png"
            },
            {
              "src": "img/logo/android-chrome-192x192.png",
              "sizes": "192x192",
              "type": "image/png"
            }
          ]
        }, // manifest end
        workbox: {
          clientsClaim: true,
          skipWaiting: true
        }
      })
    ]
    // build: {
    //     rollupOptions: {
    //       input: {
    //         main: resolve(__dirname, 'index.html'),
    //         cwqi: resolve(__dirname, 'cwqi/index.html'),
    //         daily: resolve(__dirname, 'daily/index.html')
    //       }
    //     }
    //   }
})
