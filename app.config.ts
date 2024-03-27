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
    ],
  },
  server: {
    preset: "cloudflare_module",
    rollupConfig: {
      external: ["__STATIC_CONTENT_MANIFEST", "node:async_hooks"],
    },
  },
});
