// vite.config.ts
import { resolve } from "path";
import { loadEnv } from "file:///E:/xzz/development/backstagemanagement/node_modules/.pnpm/vite@5.3.4_@types+node@20.16.5_less@4.2.0_terser@5.31.6/node_modules/vite/dist/node/index.js";
import Vue from "file:///E:/xzz/development/backstagemanagement/node_modules/.pnpm/@vitejs+plugin-vue@5.1.3_vite@5.3.4_@types+node@20.16.5_less@4.2.0_terser@5.31.6__vue@3.4.32_typescript@5.5.3_/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import VueJsx from "file:///E:/xzz/development/backstagemanagement/node_modules/.pnpm/@vitejs+plugin-vue-jsx@4.0.1_vite@5.3.4_@types+node@20.16.5_less@4.2.0_terser@5.31.6__vue@3.4.32_typescript@5.5.3_/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import progress from "file:///E:/xzz/development/backstagemanagement/node_modules/.pnpm/vite-plugin-progress@0.0.7_vite@5.3.4_@types+node@20.16.5_less@4.2.0_terser@5.31.6_/node_modules/vite-plugin-progress/dist/index.mjs";
import EslintPlugin from "file:///E:/xzz/development/backstagemanagement/node_modules/.pnpm/vite-plugin-eslint@1.8.1_eslint@9.10.0_jiti@1.21.6__vite@5.3.4_@types+node@20.16.5_less@4.2.0_terser@5.31.6_/node_modules/vite-plugin-eslint/dist/index.mjs";
import { ViteEjsPlugin } from "file:///E:/xzz/development/backstagemanagement/node_modules/.pnpm/vite-plugin-ejs@1.7.0_vite@5.3.4_@types+node@20.16.5_less@4.2.0_terser@5.31.6_/node_modules/vite-plugin-ejs/index.js";
import { viteMockServe } from "file:///E:/xzz/development/backstagemanagement/node_modules/.pnpm/vite-plugin-mock@2.9.6_mockjs@1.1.0_rollup@4.21.2_vite@5.3.4_@types+node@20.16.5_less@4.2.0_terser@5.31.6_/node_modules/vite-plugin-mock/dist/index.js";
import PurgeIcons from "file:///E:/xzz/development/backstagemanagement/node_modules/.pnpm/vite-plugin-purge-icons@0.10.0_vite@5.3.4_@types+node@20.16.5_less@4.2.0_terser@5.31.6_/node_modules/vite-plugin-purge-icons/dist/index.mjs";
import VueI18nPlugin from "file:///E:/xzz/development/backstagemanagement/node_modules/.pnpm/@intlify+unplugin-vue-i18n@4.0.0_rollup@4.21.2_vue-i18n@9.13.1_vue@3.4.32_typescript@5.5.3___webpack-sources@3.2.3/node_modules/@intlify/unplugin-vue-i18n/lib/vite.mjs";
import { createSvgIconsPlugin } from "file:///E:/xzz/development/backstagemanagement/node_modules/.pnpm/vite-plugin-svg-icons@2.0.1_vite@5.3.4_@types+node@20.16.5_less@4.2.0_terser@5.31.6_/node_modules/vite-plugin-svg-icons/dist/index.mjs";
import { createStyleImportPlugin, ElementPlusResolve } from "file:///E:/xzz/development/backstagemanagement/node_modules/.pnpm/vite-plugin-style-import@2.0.0_vite@5.3.4_@types+node@20.16.5_less@4.2.0_terser@5.31.6_/node_modules/vite-plugin-style-import/dist/index.mjs";
import UnoCSS from "file:///E:/xzz/development/backstagemanagement/node_modules/.pnpm/unocss@0.61.9_postcss@8.4.45_rollup@4.21.2_vite@5.3.4_@types+node@20.16.5_less@4.2.0_terser@5.31.6_/node_modules/unocss/dist/vite.mjs";
import { visualizer } from "file:///E:/xzz/development/backstagemanagement/node_modules/.pnpm/rollup-plugin-visualizer@5.12.0_rollup@4.21.2/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
var __vite_injected_original_dirname = "E:\\xzz\\development\\backstagemanagement\\packages\\front";
var root = process.cwd();
function pathResolve(dir) {
  return resolve(root, ".", dir);
}
var vite_config_default = ({ command, mode }) => {
  let env = {};
  const isBuild = command === "build";
  if (!isBuild) {
    env = loadEnv(process.argv[3] === "--mode" ? process.argv[4] : process.argv[3], root);
  } else {
    env = loadEnv(mode, root);
  }
  return {
    base: env.VITE_BASE_PATH,
    plugins: [
      Vue({
        script: {
          // 开启defineModel
          defineModel: true
        }
      }),
      VueJsx(),
      progress(),
      env.VITE_USE_ALL_ELEMENT_PLUS_STYLE === "false" ? createStyleImportPlugin({
        resolves: [ElementPlusResolve()],
        libs: [
          {
            libraryName: "element-plus",
            esModule: true,
            resolveStyle: (name) => {
              if (name === "click-outside") {
                return "";
              }
              return `element-plus/es/components/${name.replace(/^el-/, "")}/style/css`;
            }
          }
        ]
      }) : void 0,
      EslintPlugin({
        cache: false,
        failOnWarning: false,
        failOnError: false,
        include: ["src/**/*.vue", "src/**/*.ts", "src/**/*.tsx"]
        // 检查的文件
      }),
      VueI18nPlugin({
        runtimeOnly: true,
        compositionOnly: true,
        include: [resolve(__vite_injected_original_dirname, "src/locales/**")]
      }),
      createSvgIconsPlugin({
        iconDirs: [pathResolve("src/assets/svgs")],
        symbolId: "icon-[dir]-[name]",
        svgoOptions: true
      }),
      PurgeIcons(),
      env.VITE_USE_MOCK === "true" ? viteMockServe({
        ignore: /^\_/,
        mockPath: "mock",
        localEnabled: !isBuild,
        prodEnabled: isBuild,
        injectCode: `
          import { setupProdMockServer } from '../mock/_createProductionServer'

          setupProdMockServer()
          `
      }) : void 0,
      ViteEjsPlugin({
        title: env.VITE_APP_TITLE
      }),
      UnoCSS()
    ],
    css: {
      preprocessorOptions: {
        less: {
          additionalData: '@import "./src/styles/variables.module.less";',
          javascriptEnabled: true
        }
      }
    },
    resolve: {
      extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".less", ".css"],
      alias: [
        {
          find: "vue-i18n",
          replacement: "vue-i18n/dist/vue-i18n.cjs.js"
        },
        {
          find: /\@\//,
          replacement: `${pathResolve("src")}/`
        }
      ]
    },
    esbuild: {
      pure: env.VITE_DROP_CONSOLE === "true" ? ["console.log"] : void 0,
      drop: env.VITE_DROP_DEBUGGER === "true" ? ["debugger"] : void 0
    },
    build: {
      target: "es2015",
      outDir: env.VITE_OUT_DIR || "dist",
      sourcemap: env.VITE_SOURCEMAP === "true",
      // brotliSize: false,
      rollupOptions: {
        plugins: env.VITE_USE_BUNDLE_ANALYZER === "true" ? [visualizer()] : void 0,
        // 拆包
        output: {
          manualChunks: {
            "vue-chunks": ["vue", "vue-router", "pinia", "vue-i18n"],
            "element-plus": ["element-plus"],
            "wang-editor": ["@wangeditor/editor", "@wangeditor/editor-for-vue"],
            echarts: ["echarts", "echarts-wordcloud"]
          }
        }
      },
      cssCodeSplit: !(env.VITE_USE_CSS_SPLIT === "false"),
      cssTarget: ["chrome31"]
    },
    server: {
      port: 4e3,
      proxy: {
        // 选项写法
        "/api": {
          target: "http://127.0.0.1:8000",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, "")
        }
      },
      hmr: {
        overlay: false
      },
      host: "0.0.0.0"
    },
    optimizeDeps: {
      include: [
        "vue",
        "vue-router",
        "vue-types",
        "element-plus/es/locale/lang/zh-cn",
        "element-plus/es/locale/lang/en",
        "@iconify/iconify",
        "@vueuse/core",
        "axios",
        "qs",
        "echarts",
        "echarts-wordcloud",
        "qrcode",
        "@wangeditor/editor",
        "@wangeditor/editor-for-vue",
        "vue-json-pretty",
        "@zxcvbn-ts/core",
        "dayjs",
        "cropperjs"
      ]
    }
  };
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFx4enpcXFxcZGV2ZWxvcG1lbnRcXFxcYmFja3N0YWdlbWFuYWdlbWVudFxcXFxwYWNrYWdlc1xcXFxmcm9udFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxceHp6XFxcXGRldmVsb3BtZW50XFxcXGJhY2tzdGFnZW1hbmFnZW1lbnRcXFxccGFja2FnZXNcXFxcZnJvbnRcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6L3h6ei9kZXZlbG9wbWVudC9iYWNrc3RhZ2VtYW5hZ2VtZW50L3BhY2thZ2VzL2Zyb250L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnXG5pbXBvcnQgeyBsb2FkRW52IH0gZnJvbSAndml0ZSdcbmltcG9ydCB0eXBlIHsgVXNlckNvbmZpZywgQ29uZmlnRW52IH0gZnJvbSAndml0ZSdcbmltcG9ydCBWdWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuaW1wb3J0IFZ1ZUpzeCBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUtanN4J1xuaW1wb3J0IHByb2dyZXNzIGZyb20gJ3ZpdGUtcGx1Z2luLXByb2dyZXNzJ1xuaW1wb3J0IEVzbGludFBsdWdpbiBmcm9tICd2aXRlLXBsdWdpbi1lc2xpbnQnXG5pbXBvcnQgeyBWaXRlRWpzUGx1Z2luIH0gZnJvbSAndml0ZS1wbHVnaW4tZWpzJ1xuaW1wb3J0IHsgdml0ZU1vY2tTZXJ2ZSB9IGZyb20gJ3ZpdGUtcGx1Z2luLW1vY2snXG5pbXBvcnQgUHVyZ2VJY29ucyBmcm9tICd2aXRlLXBsdWdpbi1wdXJnZS1pY29ucydcbmltcG9ydCBWdWVJMThuUGx1Z2luIGZyb20gJ0BpbnRsaWZ5L3VucGx1Z2luLXZ1ZS1pMThuL3ZpdGUnXG5pbXBvcnQgeyBjcmVhdGVTdmdJY29uc1BsdWdpbiB9IGZyb20gJ3ZpdGUtcGx1Z2luLXN2Zy1pY29ucydcbmltcG9ydCB7IGNyZWF0ZVN0eWxlSW1wb3J0UGx1Z2luLCBFbGVtZW50UGx1c1Jlc29sdmUgfSBmcm9tICd2aXRlLXBsdWdpbi1zdHlsZS1pbXBvcnQnXG5pbXBvcnQgVW5vQ1NTIGZyb20gJ3Vub2Nzcy92aXRlJ1xuaW1wb3J0IHsgdmlzdWFsaXplciB9IGZyb20gJ3JvbGx1cC1wbHVnaW4tdmlzdWFsaXplcidcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmNvbnN0IHJvb3QgPSBwcm9jZXNzLmN3ZCgpXG5cbmZ1bmN0aW9uIHBhdGhSZXNvbHZlKGRpcjogc3RyaW5nKSB7XG4gIHJldHVybiByZXNvbHZlKHJvb3QsICcuJywgZGlyKVxufVxuXG5leHBvcnQgZGVmYXVsdCAoeyBjb21tYW5kLCBtb2RlIH06IENvbmZpZ0Vudik6IFVzZXJDb25maWcgPT4ge1xuICBsZXQgZW52ID0ge30gYXMgYW55XG4gIGNvbnN0IGlzQnVpbGQgPSBjb21tYW5kID09PSAnYnVpbGQnXG4gIGlmICghaXNCdWlsZCkge1xuICAgIGVudiA9IGxvYWRFbnYocHJvY2Vzcy5hcmd2WzNdID09PSAnLS1tb2RlJyA/IHByb2Nlc3MuYXJndls0XSA6IHByb2Nlc3MuYXJndlszXSwgcm9vdClcbiAgfSBlbHNlIHtcbiAgICBlbnYgPSBsb2FkRW52KG1vZGUsIHJvb3QpXG4gIH1cbiAgcmV0dXJuIHtcbiAgICBiYXNlOiBlbnYuVklURV9CQVNFX1BBVEgsXG4gICAgcGx1Z2luczogW1xuICAgICAgVnVlKHtcbiAgICAgICAgc2NyaXB0OiB7XG4gICAgICAgICAgLy8gXHU1RjAwXHU1NDJGZGVmaW5lTW9kZWxcbiAgICAgICAgICBkZWZpbmVNb2RlbDogdHJ1ZVxuICAgICAgICB9XG4gICAgICB9KSxcbiAgICAgIFZ1ZUpzeCgpLFxuICAgICAgcHJvZ3Jlc3MoKSxcbiAgICAgIGVudi5WSVRFX1VTRV9BTExfRUxFTUVOVF9QTFVTX1NUWUxFID09PSAnZmFsc2UnXG4gICAgICAgID8gY3JlYXRlU3R5bGVJbXBvcnRQbHVnaW4oe1xuICAgICAgICAgICAgcmVzb2x2ZXM6IFtFbGVtZW50UGx1c1Jlc29sdmUoKV0sXG4gICAgICAgICAgICBsaWJzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBsaWJyYXJ5TmFtZTogJ2VsZW1lbnQtcGx1cycsXG4gICAgICAgICAgICAgICAgZXNNb2R1bGU6IHRydWUsXG4gICAgICAgICAgICAgICAgcmVzb2x2ZVN0eWxlOiAobmFtZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgaWYgKG5hbWUgPT09ICdjbGljay1vdXRzaWRlJykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJydcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIHJldHVybiBgZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvJHtuYW1lLnJlcGxhY2UoL15lbC0vLCAnJyl9L3N0eWxlL2Nzc2BcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9KVxuICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgIEVzbGludFBsdWdpbih7XG4gICAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgICAgZmFpbE9uV2FybmluZzogZmFsc2UsXG4gICAgICAgIGZhaWxPbkVycm9yOiBmYWxzZSxcbiAgICAgICAgaW5jbHVkZTogWydzcmMvKiovKi52dWUnLCAnc3JjLyoqLyoudHMnLCAnc3JjLyoqLyoudHN4J10gLy8gXHU2OEMwXHU2N0U1XHU3Njg0XHU2NTg3XHU0RUY2XG4gICAgICB9KSxcbiAgICAgIFZ1ZUkxOG5QbHVnaW4oe1xuICAgICAgICBydW50aW1lT25seTogdHJ1ZSxcbiAgICAgICAgY29tcG9zaXRpb25Pbmx5OiB0cnVlLFxuICAgICAgICBpbmNsdWRlOiBbcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvbG9jYWxlcy8qKicpXVxuICAgICAgfSksXG4gICAgICBjcmVhdGVTdmdJY29uc1BsdWdpbih7XG4gICAgICAgIGljb25EaXJzOiBbcGF0aFJlc29sdmUoJ3NyYy9hc3NldHMvc3ZncycpXSxcbiAgICAgICAgc3ltYm9sSWQ6ICdpY29uLVtkaXJdLVtuYW1lXScsXG4gICAgICAgIHN2Z29PcHRpb25zOiB0cnVlXG4gICAgICB9KSxcbiAgICAgIFB1cmdlSWNvbnMoKSxcbiAgICAgIGVudi5WSVRFX1VTRV9NT0NLID09PSAndHJ1ZSdcbiAgICAgICAgPyB2aXRlTW9ja1NlcnZlKHtcbiAgICAgICAgICAgIGlnbm9yZTogL15cXF8vLFxuICAgICAgICAgICAgbW9ja1BhdGg6ICdtb2NrJyxcbiAgICAgICAgICAgIGxvY2FsRW5hYmxlZDogIWlzQnVpbGQsXG4gICAgICAgICAgICBwcm9kRW5hYmxlZDogaXNCdWlsZCxcbiAgICAgICAgICAgIGluamVjdENvZGU6IGBcbiAgICAgICAgICBpbXBvcnQgeyBzZXR1cFByb2RNb2NrU2VydmVyIH0gZnJvbSAnLi4vbW9jay9fY3JlYXRlUHJvZHVjdGlvblNlcnZlcidcblxuICAgICAgICAgIHNldHVwUHJvZE1vY2tTZXJ2ZXIoKVxuICAgICAgICAgIGBcbiAgICAgICAgICB9KVxuICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgIFZpdGVFanNQbHVnaW4oe1xuICAgICAgICB0aXRsZTogZW52LlZJVEVfQVBQX1RJVExFXG4gICAgICB9KSxcbiAgICAgIFVub0NTUygpXG4gICAgXSxcblxuICAgIGNzczoge1xuICAgICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xuICAgICAgICBsZXNzOiB7XG4gICAgICAgICAgYWRkaXRpb25hbERhdGE6ICdAaW1wb3J0IFwiLi9zcmMvc3R5bGVzL3ZhcmlhYmxlcy5tb2R1bGUubGVzc1wiOycsXG4gICAgICAgICAgamF2YXNjcmlwdEVuYWJsZWQ6IHRydWVcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgcmVzb2x2ZToge1xuICAgICAgZXh0ZW5zaW9uczogWycubWpzJywgJy5qcycsICcudHMnLCAnLmpzeCcsICcudHN4JywgJy5qc29uJywgJy5sZXNzJywgJy5jc3MnXSxcbiAgICAgIGFsaWFzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBmaW5kOiAndnVlLWkxOG4nLFxuICAgICAgICAgIHJlcGxhY2VtZW50OiAndnVlLWkxOG4vZGlzdC92dWUtaTE4bi5janMuanMnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBmaW5kOiAvXFxAXFwvLyxcbiAgICAgICAgICByZXBsYWNlbWVudDogYCR7cGF0aFJlc29sdmUoJ3NyYycpfS9gXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIGVzYnVpbGQ6IHtcbiAgICAgIHB1cmU6IGVudi5WSVRFX0RST1BfQ09OU09MRSA9PT0gJ3RydWUnID8gWydjb25zb2xlLmxvZyddIDogdW5kZWZpbmVkLFxuICAgICAgZHJvcDogZW52LlZJVEVfRFJPUF9ERUJVR0dFUiA9PT0gJ3RydWUnID8gWydkZWJ1Z2dlciddIDogdW5kZWZpbmVkXG4gICAgfSxcbiAgICBidWlsZDoge1xuICAgICAgdGFyZ2V0OiAnZXMyMDE1JyxcbiAgICAgIG91dERpcjogZW52LlZJVEVfT1VUX0RJUiB8fCAnZGlzdCcsXG4gICAgICBzb3VyY2VtYXA6IGVudi5WSVRFX1NPVVJDRU1BUCA9PT0gJ3RydWUnLFxuICAgICAgLy8gYnJvdGxpU2l6ZTogZmFsc2UsXG4gICAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICAgIHBsdWdpbnM6IGVudi5WSVRFX1VTRV9CVU5ETEVfQU5BTFlaRVIgPT09ICd0cnVlJyA/IFt2aXN1YWxpemVyKCldIDogdW5kZWZpbmVkLFxuICAgICAgICAvLyBcdTYyQzZcdTUzMDVcbiAgICAgICAgb3V0cHV0OiB7XG4gICAgICAgICAgbWFudWFsQ2h1bmtzOiB7XG4gICAgICAgICAgICAndnVlLWNodW5rcyc6IFsndnVlJywgJ3Z1ZS1yb3V0ZXInLCAncGluaWEnLCAndnVlLWkxOG4nXSxcbiAgICAgICAgICAgICdlbGVtZW50LXBsdXMnOiBbJ2VsZW1lbnQtcGx1cyddLFxuICAgICAgICAgICAgJ3dhbmctZWRpdG9yJzogWydAd2FuZ2VkaXRvci9lZGl0b3InLCAnQHdhbmdlZGl0b3IvZWRpdG9yLWZvci12dWUnXSxcbiAgICAgICAgICAgIGVjaGFydHM6IFsnZWNoYXJ0cycsICdlY2hhcnRzLXdvcmRjbG91ZCddXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgY3NzQ29kZVNwbGl0OiAhKGVudi5WSVRFX1VTRV9DU1NfU1BMSVQgPT09ICdmYWxzZScpLFxuICAgICAgY3NzVGFyZ2V0OiBbJ2Nocm9tZTMxJ11cbiAgICB9LFxuICAgIHNlcnZlcjoge1xuICAgICAgcG9ydDogNDAwMCxcbiAgICAgIHByb3h5OiB7XG4gICAgICAgIC8vIFx1OTAwOVx1OTg3OVx1NTE5OVx1NkNENVxuICAgICAgICAnL2FwaSc6IHtcbiAgICAgICAgICB0YXJnZXQ6ICdodHRwOi8vMTI3LjAuMC4xOjgwMDAnLFxuICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvYXBpLywgJycpXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBobXI6IHtcbiAgICAgICAgb3ZlcmxheTogZmFsc2VcbiAgICAgIH0sXG4gICAgICBob3N0OiAnMC4wLjAuMCdcbiAgICB9LFxuICAgIG9wdGltaXplRGVwczoge1xuICAgICAgaW5jbHVkZTogW1xuICAgICAgICAndnVlJyxcbiAgICAgICAgJ3Z1ZS1yb3V0ZXInLFxuICAgICAgICAndnVlLXR5cGVzJyxcbiAgICAgICAgJ2VsZW1lbnQtcGx1cy9lcy9sb2NhbGUvbGFuZy96aC1jbicsXG4gICAgICAgICdlbGVtZW50LXBsdXMvZXMvbG9jYWxlL2xhbmcvZW4nLFxuICAgICAgICAnQGljb25pZnkvaWNvbmlmeScsXG4gICAgICAgICdAdnVldXNlL2NvcmUnLFxuICAgICAgICAnYXhpb3MnLFxuICAgICAgICAncXMnLFxuICAgICAgICAnZWNoYXJ0cycsXG4gICAgICAgICdlY2hhcnRzLXdvcmRjbG91ZCcsXG4gICAgICAgICdxcmNvZGUnLFxuICAgICAgICAnQHdhbmdlZGl0b3IvZWRpdG9yJyxcbiAgICAgICAgJ0B3YW5nZWRpdG9yL2VkaXRvci1mb3ItdnVlJyxcbiAgICAgICAgJ3Z1ZS1qc29uLXByZXR0eScsXG4gICAgICAgICdAenhjdmJuLXRzL2NvcmUnLFxuICAgICAgICAnZGF5anMnLFxuICAgICAgICAnY3JvcHBlcmpzJ1xuICAgICAgXVxuICAgIH1cbiAgfVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE2VixTQUFTLGVBQWU7QUFDclgsU0FBUyxlQUFlO0FBRXhCLE9BQU8sU0FBUztBQUNoQixPQUFPLFlBQVk7QUFDbkIsT0FBTyxjQUFjO0FBQ3JCLE9BQU8sa0JBQWtCO0FBQ3pCLFNBQVMscUJBQXFCO0FBQzlCLFNBQVMscUJBQXFCO0FBQzlCLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sbUJBQW1CO0FBQzFCLFNBQVMsNEJBQTRCO0FBQ3JDLFNBQVMseUJBQXlCLDBCQUEwQjtBQUM1RCxPQUFPLFlBQVk7QUFDbkIsU0FBUyxrQkFBa0I7QUFkM0IsSUFBTSxtQ0FBbUM7QUFpQnpDLElBQU0sT0FBTyxRQUFRLElBQUk7QUFFekIsU0FBUyxZQUFZLEtBQWE7QUFDaEMsU0FBTyxRQUFRLE1BQU0sS0FBSyxHQUFHO0FBQy9CO0FBRUEsSUFBTyxzQkFBUSxDQUFDLEVBQUUsU0FBUyxLQUFLLE1BQTZCO0FBQzNELE1BQUksTUFBTSxDQUFDO0FBQ1gsUUFBTSxVQUFVLFlBQVk7QUFDNUIsTUFBSSxDQUFDLFNBQVM7QUFDWixVQUFNLFFBQVEsUUFBUSxLQUFLLENBQUMsTUFBTSxXQUFXLFFBQVEsS0FBSyxDQUFDLElBQUksUUFBUSxLQUFLLENBQUMsR0FBRyxJQUFJO0FBQUEsRUFDdEYsT0FBTztBQUNMLFVBQU0sUUFBUSxNQUFNLElBQUk7QUFBQSxFQUMxQjtBQUNBLFNBQU87QUFBQSxJQUNMLE1BQU0sSUFBSTtBQUFBLElBQ1YsU0FBUztBQUFBLE1BQ1AsSUFBSTtBQUFBLFFBQ0YsUUFBUTtBQUFBO0FBQUEsVUFFTixhQUFhO0FBQUEsUUFDZjtBQUFBLE1BQ0YsQ0FBQztBQUFBLE1BQ0QsT0FBTztBQUFBLE1BQ1AsU0FBUztBQUFBLE1BQ1QsSUFBSSxvQ0FBb0MsVUFDcEMsd0JBQXdCO0FBQUEsUUFDdEIsVUFBVSxDQUFDLG1CQUFtQixDQUFDO0FBQUEsUUFDL0IsTUFBTTtBQUFBLFVBQ0o7QUFBQSxZQUNFLGFBQWE7QUFBQSxZQUNiLFVBQVU7QUFBQSxZQUNWLGNBQWMsQ0FBQyxTQUFTO0FBQ3RCLGtCQUFJLFNBQVMsaUJBQWlCO0FBQzVCLHVCQUFPO0FBQUEsY0FDVDtBQUNBLHFCQUFPLDhCQUE4QixLQUFLLFFBQVEsUUFBUSxFQUFFLENBQUM7QUFBQSxZQUMvRDtBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBQUEsTUFDRixDQUFDLElBQ0Q7QUFBQSxNQUNKLGFBQWE7QUFBQSxRQUNYLE9BQU87QUFBQSxRQUNQLGVBQWU7QUFBQSxRQUNmLGFBQWE7QUFBQSxRQUNiLFNBQVMsQ0FBQyxnQkFBZ0IsZUFBZSxjQUFjO0FBQUE7QUFBQSxNQUN6RCxDQUFDO0FBQUEsTUFDRCxjQUFjO0FBQUEsUUFDWixhQUFhO0FBQUEsUUFDYixpQkFBaUI7QUFBQSxRQUNqQixTQUFTLENBQUMsUUFBUSxrQ0FBVyxnQkFBZ0IsQ0FBQztBQUFBLE1BQ2hELENBQUM7QUFBQSxNQUNELHFCQUFxQjtBQUFBLFFBQ25CLFVBQVUsQ0FBQyxZQUFZLGlCQUFpQixDQUFDO0FBQUEsUUFDekMsVUFBVTtBQUFBLFFBQ1YsYUFBYTtBQUFBLE1BQ2YsQ0FBQztBQUFBLE1BQ0QsV0FBVztBQUFBLE1BQ1gsSUFBSSxrQkFBa0IsU0FDbEIsY0FBYztBQUFBLFFBQ1osUUFBUTtBQUFBLFFBQ1IsVUFBVTtBQUFBLFFBQ1YsY0FBYyxDQUFDO0FBQUEsUUFDZixhQUFhO0FBQUEsUUFDYixZQUFZO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQUtkLENBQUMsSUFDRDtBQUFBLE1BQ0osY0FBYztBQUFBLFFBQ1osT0FBTyxJQUFJO0FBQUEsTUFDYixDQUFDO0FBQUEsTUFDRCxPQUFPO0FBQUEsSUFDVDtBQUFBLElBRUEsS0FBSztBQUFBLE1BQ0gscUJBQXFCO0FBQUEsUUFDbkIsTUFBTTtBQUFBLFVBQ0osZ0JBQWdCO0FBQUEsVUFDaEIsbUJBQW1CO0FBQUEsUUFDckI7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsWUFBWSxDQUFDLFFBQVEsT0FBTyxPQUFPLFFBQVEsUUFBUSxTQUFTLFNBQVMsTUFBTTtBQUFBLE1BQzNFLE9BQU87QUFBQSxRQUNMO0FBQUEsVUFDRSxNQUFNO0FBQUEsVUFDTixhQUFhO0FBQUEsUUFDZjtBQUFBLFFBQ0E7QUFBQSxVQUNFLE1BQU07QUFBQSxVQUNOLGFBQWEsR0FBRyxZQUFZLEtBQUssQ0FBQztBQUFBLFFBQ3BDO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLE1BQU0sSUFBSSxzQkFBc0IsU0FBUyxDQUFDLGFBQWEsSUFBSTtBQUFBLE1BQzNELE1BQU0sSUFBSSx1QkFBdUIsU0FBUyxDQUFDLFVBQVUsSUFBSTtBQUFBLElBQzNEO0FBQUEsSUFDQSxPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsTUFDUixRQUFRLElBQUksZ0JBQWdCO0FBQUEsTUFDNUIsV0FBVyxJQUFJLG1CQUFtQjtBQUFBO0FBQUEsTUFFbEMsZUFBZTtBQUFBLFFBQ2IsU0FBUyxJQUFJLDZCQUE2QixTQUFTLENBQUMsV0FBVyxDQUFDLElBQUk7QUFBQTtBQUFBLFFBRXBFLFFBQVE7QUFBQSxVQUNOLGNBQWM7QUFBQSxZQUNaLGNBQWMsQ0FBQyxPQUFPLGNBQWMsU0FBUyxVQUFVO0FBQUEsWUFDdkQsZ0JBQWdCLENBQUMsY0FBYztBQUFBLFlBQy9CLGVBQWUsQ0FBQyxzQkFBc0IsNEJBQTRCO0FBQUEsWUFDbEUsU0FBUyxDQUFDLFdBQVcsbUJBQW1CO0FBQUEsVUFDMUM7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLE1BQ0EsY0FBYyxFQUFFLElBQUksdUJBQXVCO0FBQUEsTUFDM0MsV0FBVyxDQUFDLFVBQVU7QUFBQSxJQUN4QjtBQUFBLElBQ0EsUUFBUTtBQUFBLE1BQ04sTUFBTTtBQUFBLE1BQ04sT0FBTztBQUFBO0FBQUEsUUFFTCxRQUFRO0FBQUEsVUFDTixRQUFRO0FBQUEsVUFDUixjQUFjO0FBQUEsVUFDZCxTQUFTLENBQUMsU0FBUyxLQUFLLFFBQVEsVUFBVSxFQUFFO0FBQUEsUUFDOUM7QUFBQSxNQUNGO0FBQUEsTUFDQSxLQUFLO0FBQUEsUUFDSCxTQUFTO0FBQUEsTUFDWDtBQUFBLE1BQ0EsTUFBTTtBQUFBLElBQ1I7QUFBQSxJQUNBLGNBQWM7QUFBQSxNQUNaLFNBQVM7QUFBQSxRQUNQO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRjsiLAogICJuYW1lcyI6IFtdCn0K
