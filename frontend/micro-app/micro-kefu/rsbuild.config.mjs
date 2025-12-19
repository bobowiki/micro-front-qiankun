import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import pkg from "./package.json" assert { type: "json" };

const packageName = pkg.name;

export default defineConfig({
  server: {
    // proxy: {
    //   "/": "http://localhost:3000",
    // },
  },
  source: {
    define: {
      __SOURCE_PREFIX__: JSON.stringify(pkg.name),
    },
  },
  output: {
    filenameHash: false,
  },
  plugins: [pluginReact()],
  tools: {
    rspack: (config) => {
      config.output = {
        ...config.output,
        library: `${packageName}`, // UMD 全局变量
        libraryTarget: "umd",
        chunkLoadingGlobal: `webpackJsonp_${packageName}`,
        globalObject: "window",
      };
      config.optimization = {
        ...config.optimization,
        runtimeChunk: {
          name: "manifest", // 生成 manifest.js
        },
        splitChunks: {
          chunks: "async", // 懒加载 chunk 分开打包
          minSize: 0, // 强制生成 chunk
        },
      };
      return config;
    },
  },
});
