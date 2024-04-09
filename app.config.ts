import { defineConfig } from "@solidjs/start/config";
import unocss from "unocss/vite";
import {
  presetUno,
  presetIcons,
  presetTypography,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";
import { presetDaisy } from "@unscatty/unocss-preset-daisy";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  vite: {
    plugins: [
      unocss({
        mergeSelectors: false,
        transformers: [transformerDirectives(), transformerVariantGroup()],
        presets: [
          presetUno(),
          presetDaisy(),
          presetTypography({
            cssExtend: {
              ":not(pre) > code::before,:not(pre) > code::after": {
                content: "",
              },
            },
          }),
          presetIcons(),
        ],
        shortcuts: {
          "input-box":
            "max-w-150px ml-1em px-1 text-slate-7 dark:text-slate rounded-sm bg-slate bg-op-15 focus:(bg-op-20 ring-0 outline-none)",
        },
      }),
      VitePWA({
        base: "/",
        scope: "/",
        includeAssets: ["favicon.svg", "apple-touch-icon.png"],
        registerType: "autoUpdate",
        manifest: {
          name: "LeeChat",
          lang: "zh-cn",
          short_name: "LeeChat",
          background_color: "#f6f8fa",
          theme_color: "#f6f8fa",
          icons: [
            {
              src: "192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "256.png",
              sizes: "256x256",
              type: "image/png",
            },
            {
              src: "512.png",
              sizes: "512x512",
              type: "image/png",
            },
            {
              src: "apple-touch-icon.png",
              sizes: "192x192",
              type: "image/png",
            },
          ],
        },
        disable: !!process.env.NETLIFY,
        devOptions: {
          enabled: true,
        },
      }),
    ],
  },
  middleware: "src/middleware.ts",
  server: {
    preset: "vercel-edge",
  },
});
