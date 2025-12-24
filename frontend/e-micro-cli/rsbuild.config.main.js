import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import path from "node:path";
import fs from "node:fs";

function getPackageJson() {
  const pkgPath = path.join(process.cwd(), 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    return pkg
  }
  return null;
}
const pkg = getPackageJson()

export default defineConfig({
  environments: {
    web: {
      dev: {
        progressBar: {
          id: 'Web',
        },
      },
    }
  },
  source: {
    define: {
      __SOURCE_PREFIX__: JSON.stringify(pkg.name),
    },
  },
  dev: {
    progressBar: true,
  },
  output: {
    filenameHash: false,
    filename: "[name].js",
    assetPrefix: `https://cysx-yikai.oss-cn-beijing.aliyuncs.com/static/${pkg.name}/${pkg.version}`,
  },
  plugins: [pluginReact()],
  tools: {
    rspack: (config) => {
      config.output = {
        ...config.output,
        library: `${pkg.name}`, // UMD 全局变量
        libraryTarget: "umd",
        chunkLoadingGlobal: `webpackJsonp_${pkg.name}`,
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
