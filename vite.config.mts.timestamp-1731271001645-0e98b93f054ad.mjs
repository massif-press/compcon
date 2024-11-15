var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// package.json
var require_package = __commonJS({
  "package.json"(exports, module) {
    module.exports = {
      name: "compcon",
      private: true,
      version: "3.0.0",
      scripts: {
        dev: "vite",
        build: "vue-tsc && vite build",
        "build-nocheck": "vite build",
        preview: "vite preview"
      },
      dependencies: {
        "@kyvg/vue3-notification": "3.4.1",
        "@massif/lancer-data": "3.1.7",
        "@mdi/font": "7.4.47",
        "@vueup/vue-quill": "1.2.0",
        "aws-amplify": "6.8.0",
        axios: "1.7.7",
        "chart.js": "4.4.6",
        "chartjs-plugin-annotation": "3.1.0",
        "chartjs-plugin-datalabels": "2.2.0",
        "ef-infinite-canvas": "0.6.7",
        jszip: "3.10.1",
        localforage: "1.10.0",
        lodash: "4.17.21",
        pinia: "2.2.5",
        prettier: "3.3.3",
        "promisify-file-reader": "4.1.0",
        semver: "7.6.3",
        sortablejs: "1.15.3",
        "sortablejs-vue3": "1.2.11",
        typeit: "^8.8.7",
        uuid: "11.0.2",
        vue: "3.5.12",
        "vue-advanced-cropper": "2.8.9",
        "vue-chartjs": "5.3.2",
        "vue-html-secure": "1.0.10",
        "vue-router": "4.4.5",
        vuetify: "3.7.3"
      },
      devDependencies: {
        "@types/lodash": "4.17.13",
        "@types/node": "22.8.6",
        "@types/uuid": "10.0.0",
        "@vitejs/plugin-vue": "5.1.4",
        sass: "1.80.6",
        typescript: "5.6.3",
        vite: "5.4.10",
        "vue-tsc": "2.1.10"
      }
    };
  }
});

// vite.config.mts
import { defineConfig } from "file:///C:/Projects/Massif/compcon/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Projects/Massif/compcon/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { fileURLToPath, URL } from "url";
var __vite_injected_original_import_meta_url = "file:///C:/Projects/Massif/compcon/vite.config.mts";
var vite_config_default = defineConfig({
  plugins: [vue()],
  build: {
    target: "esnext"
  },
  resolve: {
    alias: [
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
      },
      {
        find: "./runtimeConfig",
        replacement: "./runtimeConfig.browser"
      }
    ],
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"]
  },
  define: {
    "process.env.VERSION": JSON.stringify(require_package().version)
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsicGFja2FnZS5qc29uIiwgInZpdGUuY29uZmlnLm10cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsie1xyXG4gIFwibmFtZVwiOiBcImNvbXBjb25cIixcclxuICBcInByaXZhdGVcIjogdHJ1ZSxcclxuICBcInZlcnNpb25cIjogXCIzLjAuMFwiLFxyXG4gIFwic2NyaXB0c1wiOiB7XHJcbiAgICBcImRldlwiOiBcInZpdGVcIixcclxuICAgIFwiYnVpbGRcIjogXCJ2dWUtdHNjICYmIHZpdGUgYnVpbGRcIixcclxuICAgIFwiYnVpbGQtbm9jaGVja1wiOiBcInZpdGUgYnVpbGRcIixcclxuICAgIFwicHJldmlld1wiOiBcInZpdGUgcHJldmlld1wiXHJcbiAgfSxcclxuICBcImRlcGVuZGVuY2llc1wiOiB7XHJcbiAgICBcIkBreXZnL3Z1ZTMtbm90aWZpY2F0aW9uXCI6IFwiMy40LjFcIixcclxuICAgIFwiQG1hc3NpZi9sYW5jZXItZGF0YVwiOiBcIjMuMS43XCIsXHJcbiAgICBcIkBtZGkvZm9udFwiOiBcIjcuNC40N1wiLFxyXG4gICAgXCJAdnVldXAvdnVlLXF1aWxsXCI6IFwiMS4yLjBcIixcclxuICAgIFwiYXdzLWFtcGxpZnlcIjogXCI2LjguMFwiLFxyXG4gICAgXCJheGlvc1wiOiBcIjEuNy43XCIsXHJcbiAgICBcImNoYXJ0LmpzXCI6IFwiNC40LjZcIixcclxuICAgIFwiY2hhcnRqcy1wbHVnaW4tYW5ub3RhdGlvblwiOiBcIjMuMS4wXCIsXHJcbiAgICBcImNoYXJ0anMtcGx1Z2luLWRhdGFsYWJlbHNcIjogXCIyLjIuMFwiLFxyXG4gICAgXCJlZi1pbmZpbml0ZS1jYW52YXNcIjogXCIwLjYuN1wiLFxyXG4gICAgXCJqc3ppcFwiOiBcIjMuMTAuMVwiLFxyXG4gICAgXCJsb2NhbGZvcmFnZVwiOiBcIjEuMTAuMFwiLFxyXG4gICAgXCJsb2Rhc2hcIjogXCI0LjE3LjIxXCIsXHJcbiAgICBcInBpbmlhXCI6IFwiMi4yLjVcIixcclxuICAgIFwicHJldHRpZXJcIjogXCIzLjMuM1wiLFxyXG4gICAgXCJwcm9taXNpZnktZmlsZS1yZWFkZXJcIjogXCI0LjEuMFwiLFxyXG4gICAgXCJzZW12ZXJcIjogXCI3LjYuM1wiLFxyXG4gICAgXCJzb3J0YWJsZWpzXCI6IFwiMS4xNS4zXCIsXHJcbiAgICBcInNvcnRhYmxlanMtdnVlM1wiOiBcIjEuMi4xMVwiLFxyXG4gICAgXCJ0eXBlaXRcIjogXCJeOC44LjdcIixcclxuICAgIFwidXVpZFwiOiBcIjExLjAuMlwiLFxyXG4gICAgXCJ2dWVcIjogXCIzLjUuMTJcIixcclxuICAgIFwidnVlLWFkdmFuY2VkLWNyb3BwZXJcIjogXCIyLjguOVwiLFxyXG4gICAgXCJ2dWUtY2hhcnRqc1wiOiBcIjUuMy4yXCIsXHJcbiAgICBcInZ1ZS1odG1sLXNlY3VyZVwiOiBcIjEuMC4xMFwiLFxyXG4gICAgXCJ2dWUtcm91dGVyXCI6IFwiNC40LjVcIixcclxuICAgIFwidnVldGlmeVwiOiBcIjMuNy4zXCJcclxuICB9LFxyXG4gIFwiZGV2RGVwZW5kZW5jaWVzXCI6IHtcclxuICAgIFwiQHR5cGVzL2xvZGFzaFwiOiBcIjQuMTcuMTNcIixcclxuICAgIFwiQHR5cGVzL25vZGVcIjogXCIyMi44LjZcIixcclxuICAgIFwiQHR5cGVzL3V1aWRcIjogXCIxMC4wLjBcIixcclxuICAgIFwiQHZpdGVqcy9wbHVnaW4tdnVlXCI6IFwiNS4xLjRcIixcclxuICAgIFwic2Fzc1wiOiBcIjEuODAuNlwiLFxyXG4gICAgXCJ0eXBlc2NyaXB0XCI6IFwiNS42LjNcIixcclxuICAgIFwidml0ZVwiOiBcIjUuNC4xMFwiLFxyXG4gICAgXCJ2dWUtdHNjXCI6IFwiMi4xLjEwXCJcclxuICB9XHJcbn1cclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxQcm9qZWN0c1xcXFxNYXNzaWZcXFxcY29tcGNvblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcUHJvamVjdHNcXFxcTWFzc2lmXFxcXGNvbXBjb25cXFxcdml0ZS5jb25maWcubXRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Qcm9qZWN0cy9NYXNzaWYvY29tcGNvbi92aXRlLmNvbmZpZy5tdHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcclxuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnO1xyXG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBVUkwgfSBmcm9tICd1cmwnO1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbdnVlKCldLFxyXG4gIGJ1aWxkOiB7XHJcbiAgICB0YXJnZXQ6ICdlc25leHQnLFxyXG4gIH0sXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IFtcclxuICAgICAge1xyXG4gICAgICAgIGZpbmQ6ICdAJyxcclxuICAgICAgICByZXBsYWNlbWVudDogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpLFxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgZmluZDogJy4vcnVudGltZUNvbmZpZycsXHJcbiAgICAgICAgcmVwbGFjZW1lbnQ6ICcuL3J1bnRpbWVDb25maWcuYnJvd3NlcicsXHJcbiAgICAgIH0sXHJcbiAgICBdLFxyXG4gICAgZXh0ZW5zaW9uczogWycubWpzJywgJy5qcycsICcudHMnLCAnLmpzeCcsICcudHN4JywgJy5qc29uJywgJy52dWUnXSxcclxuICB9LFxyXG4gIGRlZmluZToge1xyXG4gICAgJ3Byb2Nlc3MuZW52LlZFUlNJT04nOiBKU09OLnN0cmluZ2lmeShyZXF1aXJlKCcuL3BhY2thZ2UuanNvbicpLnZlcnNpb24pLFxyXG4gIH0sXHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQUNFLE1BQVE7QUFBQSxNQUNSLFNBQVc7QUFBQSxNQUNYLFNBQVc7QUFBQSxNQUNYLFNBQVc7QUFBQSxRQUNULEtBQU87QUFBQSxRQUNQLE9BQVM7QUFBQSxRQUNULGlCQUFpQjtBQUFBLFFBQ2pCLFNBQVc7QUFBQSxNQUNiO0FBQUEsTUFDQSxjQUFnQjtBQUFBLFFBQ2QsMkJBQTJCO0FBQUEsUUFDM0IsdUJBQXVCO0FBQUEsUUFDdkIsYUFBYTtBQUFBLFFBQ2Isb0JBQW9CO0FBQUEsUUFDcEIsZUFBZTtBQUFBLFFBQ2YsT0FBUztBQUFBLFFBQ1QsWUFBWTtBQUFBLFFBQ1osNkJBQTZCO0FBQUEsUUFDN0IsNkJBQTZCO0FBQUEsUUFDN0Isc0JBQXNCO0FBQUEsUUFDdEIsT0FBUztBQUFBLFFBQ1QsYUFBZTtBQUFBLFFBQ2YsUUFBVTtBQUFBLFFBQ1YsT0FBUztBQUFBLFFBQ1QsVUFBWTtBQUFBLFFBQ1oseUJBQXlCO0FBQUEsUUFDekIsUUFBVTtBQUFBLFFBQ1YsWUFBYztBQUFBLFFBQ2QsbUJBQW1CO0FBQUEsUUFDbkIsUUFBVTtBQUFBLFFBQ1YsTUFBUTtBQUFBLFFBQ1IsS0FBTztBQUFBLFFBQ1Asd0JBQXdCO0FBQUEsUUFDeEIsZUFBZTtBQUFBLFFBQ2YsbUJBQW1CO0FBQUEsUUFDbkIsY0FBYztBQUFBLFFBQ2QsU0FBVztBQUFBLE1BQ2I7QUFBQSxNQUNBLGlCQUFtQjtBQUFBLFFBQ2pCLGlCQUFpQjtBQUFBLFFBQ2pCLGVBQWU7QUFBQSxRQUNmLGVBQWU7QUFBQSxRQUNmLHNCQUFzQjtBQUFBLFFBQ3RCLE1BQVE7QUFBQSxRQUNSLFlBQWM7QUFBQSxRQUNkLE1BQVE7QUFBQSxRQUNSLFdBQVc7QUFBQSxNQUNiO0FBQUEsSUFDRjtBQUFBO0FBQUE7OztBQ2pEMFEsU0FBUyxvQkFBb0I7QUFDdlMsT0FBTyxTQUFTO0FBQ2hCLFNBQVMsZUFBZSxXQUFXO0FBRmlJLElBQU0sMkNBQTJDO0FBS3JOLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxJQUFJLENBQUM7QUFBQSxFQUNmLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxFQUNWO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTDtBQUFBLFFBQ0UsTUFBTTtBQUFBLFFBQ04sYUFBYSxjQUFjLElBQUksSUFBSSxTQUFTLHdDQUFlLENBQUM7QUFBQSxNQUM5RDtBQUFBLE1BQ0E7QUFBQSxRQUNFLE1BQU07QUFBQSxRQUNOLGFBQWE7QUFBQSxNQUNmO0FBQUEsSUFDRjtBQUFBLElBQ0EsWUFBWSxDQUFDLFFBQVEsT0FBTyxPQUFPLFFBQVEsUUFBUSxTQUFTLE1BQU07QUFBQSxFQUNwRTtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sdUJBQXVCLEtBQUssVUFBVSxrQkFBMEIsT0FBTztBQUFBLEVBQ3pFO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
