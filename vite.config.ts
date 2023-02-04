import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

const virtualFile = "@virtual-file";
const virtualId = "\0" + virtualFile;
const nestedVirtualFile = "@nested-virtual-file";
const nestedVirtualId = "\0" + nestedVirtualFile;

const base = "/";

// preserve this to test loading __filename & __dirname in ESM as Vite polyfills them.
// if Vite incorrectly load this file, node.js would error out.
globalThis.__vite_test_filename = __filename;
globalThis.__vite_test_dirname = __dirname;

export default defineConfig(({ mode, command, ssrBuild }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  return {
    define: {
      "process.env": process.env,
    },
    base,
    plugins: [
      vue(),
      {
        name: "virtual",
        resolveId(id) {
          if (id === "@foo") {
            return id;
          }
        },
        load(id, options) {
          const ssrFromOptions = options?.ssr ?? false;
          if (id === "@foo") {
            // Force a mismatch error if ssrBuild is different from ssrFromOptions
            return `export default { msg: '${
              command === "build" && !!ssrBuild !== ssrFromOptions
                ? `defineConfig ssrBuild !== ssr from load options`
                : "hi"
            }' }`;
          }
        },
      },
      {
        name: "virtual-module",
        resolveId(id) {
          if (id === virtualFile) {
            return virtualId;
          } else if (id === nestedVirtualFile) {
            return nestedVirtualId;
          }
        },
        load(id) {
          if (id === virtualId) {
            return `export { msg } from "@nested-virtual-file";`;
          } else if (id === nestedVirtualId) {
            return `export const msg = "[success] from conventional virtual file"`;
          }
        },
      },
      // Example of a plugin that injects a helper from a virtual module that can
      // be used in renderBuiltUrl
      (function () {
        const queryRE = /\?.*$/s;
        const hashRE = /#.*$/s;
        const cleanUrl = (url) => url.replace(hashRE, "").replace(queryRE, "");
        let config;

        const virtualId = "\0virtual:ssr-vue-built-url";
        return {
          name: "built-url",
          enforce: "post",
          configResolved(_config) {
            config = _config;
          },
          resolveId(id) {
            if (id === virtualId) {
              return id;
            }
          },
          load(id) {
            if (id === virtualId) {
              return {
                code: `export const __ssr_vue_processAssetPath = (url) => '${base}' + url`,
                moduleSideEffects: "no-treeshake",
              };
            }
          },
          transform(code, id) {
            const cleanId = cleanUrl(id);
            if (
              config.build.ssr &&
              (cleanId.endsWith(".js") || cleanId.endsWith(".vue")) &&
              !code.includes("__ssr_vue_processAssetPath")
            ) {
              return {
                code:
                  `import { __ssr_vue_processAssetPath } from '${virtualId}';__ssr_vue_processAssetPath;` +
                  code,
                sourcemap: null, // no sourcemap support to speed up CI
              };
            }
          },
        };
      })(),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        vue:
          process.env.NODE_ENV === "production"
            ? "vue"
            : "vue/dist/vue.esm-bundler.js",
      },
    },

    server: {
      host: "0.0.0.0",
      port: 8080,
    },

    experimental: {
      renderBuiltUrl(filename, { hostType, type, ssr }) {
        if (ssr && type === "asset" && hostType === "js") {
          return {
            runtime: `__ssr_vue_processAssetPath(${JSON.stringify(filename)})`,
          };
        }
      },
    },
    build: {
      minify: true,
    },
    ssr: {},
    optimizeDeps: {},
  };
});