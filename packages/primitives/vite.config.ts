import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import vueJsx from "@vitejs/plugin-vue2-jsx";
import alias from "@rollup/plugin-alias";
import { resolve } from "path";
import DefineOptions from 'unplugin-vue-define-options/vite'
// import VueTypeImports from '@rah-emil/vite-plugin-vue-type-imports'
import VueMacros from 'unplugin-vue-macros/vite'
const projectRootDir = resolve(__dirname);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VueMacros({
      plugins:{
        vue:vue(),
        vueJsx:vueJsx()
      }
    }),
    // VueTypeImports(),
    DefineOptions(),
    alias({
      entries: [
        {
          find: "@",
          replacement: resolve(projectRootDir, "src"),
        },
      ],
    }),
  ],
  build: {
    lib: {
      name: "aria-vue2",
      fileName: "index",
      entry: resolve(__dirname, "src/index.ts"),
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library (Vue)
      external: ["vue", "@vueuse/core"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: "Vue",
        },
        assetFileNames: (chunkInfo) => {
          if (chunkInfo.name === "style.css") return "index.css";
          return chunkInfo.name as string;
        },
      },
    },
  },
})
