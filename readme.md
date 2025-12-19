# frontend

## 微前端概念

frontend 前端相关，app-base 基座 app，其他目录其他子应用 demo。
先了解概念在微前端中我们会有一个基座应用，基座负责注册子应用，并且通过

```javascript
registerMicroApps([
  {
    name: "micro-kefu", // app name registered
    entry: {
      scripts: [
        "http://127.0.0.1:8081/static/js/manifest.js",
        "http://127.0.0.1:8081/static/js/index.js",
      ],
      html: '<div id="appsub"></div>',
    },
    container: "#subApp-viewport",
    activeRule: "/kefu",
  },
]);

start();
```

start()启动整个微前端。

在这里有一个概念，应用/资源/页面。这三个概念非常关键。在业务场景上会将一部分功能整合起来成为一个应用，这个应用包含应用信息、菜单信息、页面等等。资源是我们前端开发将项目打包成静态文件。在这里有一个很好的点是应为 qiankun 是通过 activeRule 激活规则去选择激活那些资源，例如

```javascript
{
    "name": "setting",
    "entry": {
        "scripts": [
            "https://cysx-yikai.oss-cn-beijing.aliyuncs.com/static/micro-setting/1.0.0/js/manifest.js",
            "https://cysx-yikai.oss-cn-beijing.aliyuncs.com/static/micro-setting/1.0.0/js/index.js"
        ],
        "styles": [
            "https://cysx-yikai.oss-cn-beijing.aliyuncs.com/static/micro-setting/1.0.0/js/index.css"
        ]
    },
    "activeRule": [
        "/setting/micro-setting/resource-setting/list",
        "/setting/micro-setting/resource-setting/detail/:id",
        "/setting/micro-setting/app-setting/list",
        "/setting/micro-setting/app-setting/detail/:id",
        "/setting/micro-setting/test"
    ]
}

{
  "name": "micro-test",
  "entry": {
      "scripts": [
          "https://cysx-yikai.oss-cn-beijing.aliyuncs.com/static/micro-test/1.0.4/js/manifest.js",
          "https://cysx-yikai.oss-cn-beijing.aliyuncs.com/static/micro-test/1.0.4/js/index.js"
      ],
      "styles": [
          "https://cysx-yikai.oss-cn-beijing.aliyuncs.com/static/micro-test/1.0.4/css/index.css"
      ]
  },
  "activeRule": [
      "/setting/micro-test"
  ]
}
```

例如这里就是对应一份资源 setting，然后 scripts 是里面的静态资源，在 activeRule 里面通过第一个/setting 去确定他是 setting 应用，然后第二个也是"/setting/micro-test"说明也是在 setting 应用下但是资源是另一个项目下的页面资源`https://cysx-yikai.oss-cn-beijing.aliyuncs.com/static/micro-test/1.0.4/js/manifest.js`这样应用维度变得非常灵活，他不在是一份静态资源的应用，而是可以通过路径的第一位 appcode 去保证多分份资源在一个应用下。

**这有什么用呢？**

比如说客服业务下有一个客服工作台，还有运营业务上有一个运营工作台，但是有的时候客服需要去查看的运营活动，这个时候前台只能通过在客服工作台下 iframe 嵌套运营工作台，这样也行但是 iframe 会有很多硬隔离的问题，比如弹窗不居中，加载慢等等。微前端支持预加载，并且能够解决 iframe 带来的问题。这个时候我们可以以/kefu 作为 appcode，在运营的静态资源中注册一个`activeRule: ['/kefu/yunying/page']`这样就能在一个应用下加载不同资源的页面。注意应用维度其实就是我们抽象出来的一层而已。

实现 js entry 过程中需要对子应用打包进行一些约束，不是说不能使用 html entry，html entry 很浪费资源，你要去起一个 web 服务器，js entry 你只需要将应用打包后的静态文件上传到 cdn 即可。同时子应用打包还需要满足 qiankun 的要求，比如 UMD 全局标量，还有生命周期函数挂载到 window 下

子应用打包打包事项

```javascript
import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import pkg from "./package.json" assert { type: "json" };

const packageName = pkg.name;

export default defineConfig({
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
```

按照官方配置

```javascript
const config = {
  library: `${packageName}`, // UMD 全局变量
  libraryTarget: "umd",
  chunkLoadingGlobal: `webpackJsonp_${packageName}`,
  globalObject: "window",
};
```

### 1. **library: <packageName>是做什么的**
___

打包输出会把你的 bundle 作为一个“库”导出，导出名为 packageName（例如 micro-setting）。

在浏览器中会变成 window["micro-setting"] = /_ 导出的模块对象 _/（具体取决于 libraryTarget）。

**qiankun 需要它的原因**

qiankun 在默认场景下通过主页面动态加载子应用的 script，然后需要拿到子应用暴露出来的生命周期对象（bootstrap/mount/unmount/...）。

使用 library + umd，子应用会以一个可访问的全局变量暴露，主应用可以通过 window[packageName] 或者 qiankun 内部机制找到并调用这些生命周期函数。
___

### 2. **libraryTarget: "umd"是做什么的**
___

指定构建产物的模块格式为 UMD（Universal Module Definition），即同时兼容 CommonJS、AMD、以及在浏览器上通过全局变量访问的方式。

这样打包后的文件既能被 require()、也能被 define()、也能被 `<script>` 方式加载并挂到 window。

**qiankun 需要它的原因**

qiankun 的加载器在不同场景（本地开发/线上/SSR 边缘情况）可能需要以通用方式访问打包产物。UMD 给了最大的兼容性：主应用用 `<script>` 加载后，子应用仍能以全局变量暴露生命周期。

简单地说：UMD 保证“主应用无论怎么把脚本插进来，都能拿到子应用导出的 API”
___

### 3. **chunkLoadingGlobal: \webpackJsonp\_${packageName}``**
___

（在旧 webpack 里叫 jsonpFunction、或 chunkLoadingGlobal）

**是做什么的**

当构建产生 异步 chunk（动态 import 分片） 时，runtime 会用一个全局数组/函数来注册和“push”新 chunk 到页面上。

这个全局变量默认是 window["webpackJsonp"]（或 window["webpackChunk_NAME"]，不同版本差别）。

chunkLoadingGlobal 可以把这个默认名字改成唯一名字 webpackJsonp\_<packageName>。


**qiankun 需要它的原因**


在微前端场景下，多个子应用同时加载在同一页面，如果所有子应用都使用相同的 chunk-loading 全局名就会互相冲突（覆盖或错用彼此的 chunk 表），导致模块加载失败或加载到错误的模块体。

通过把这个名字与 packageName 绑定，每个子应用维护自己的异步 chunk 注册表，互不干扰。
___

### 4. **globalObject: "window"是做什么的**
___

构建产物在生成 UMD 或 runtime 时，会引用“全局对象”来挂载变量（例如 this、globalThis、window）。

globalObject 强制指定使用 window 作为运行时的全局对象。

qiankun 需要它的原因

在浏览器环境下（尤其微前端场景），我们希望 runtime 把 chunk 注册、library 导出等都挂到 window。

一些构建环境默认使用 globalThis 或 self（在 web worker 或 node 场景下更合适），但我们明确要在浏览器主线程 window 上操作，设置 globalObject: "window" 可避免运行时在某些情况下引用错误的全局环境。

对于 sandbox（比如 qiankun 的沙箱）或者在某些跨域/iframe 场景，也能保证按预期写入 window，便于主应用通过 window[...] 读取子应用导出。

**这四项配置的核心目的就是让子应用变成一个独立、可通过全局安全访问、并且不会与其它子应用在异步 chunk 与运行时代码上互相污染的模块——而这正是 qiankun 在同一页面运行多个微前端时最担心的问题。**

**🧩 一、webpack打包配置之runtimeChunk 是什么？**

在 webpack / rspack 中，runtimeChunk 表示「把运行时代码（runtime）」从每个 bundle 中抽离出来，单独生成一个文件，比如 manifest.js。

运行时代码主要做的事情包括：

模块加载逻辑（**webpack_require** / **rspack_require**）

动态 import() 异步加载管理（chunk 注册表）

模块 ID 与文件映射关系

热更新逻辑（HMR）

👉 简单说，就是 webpack 的心脏，控制模块如何加载和执行。
如果没有启用
那每一个入口文件（entry）都会内联一份 runtime 逻辑，比如：

index.js → 包含一份 runtime

pageA.js → 也包含一份 runtime

pageB.js → 又包含一份 runtime

如果多个入口或者多个子应用都加载到同一个页面上（微前端场景常见），他们的 runtime 全部挂到全局作用域，会发生冲突：

多个子应用的 **webpack_require** 会覆盖彼此；

异步 chunk 注册表混乱；

导致「Chunk not found」「Cannot find module」等问题。

这就是为什么在 qiankun 这种场景下，必须把 runtime 独立出来。

**启用 runtimeChunk: { name: "manifest" } 的好处**
效果：

webpack/rspack 会生成一个独立的 manifest.js 文件；

其它业务入口的 bundle（如 main.js）里不再包含 runtime；

页面加载时，先执行 manifest.js，再执行你的 main.js。

✅ 好处：

运行时代码隔离，不会与其他子应用互相污染；

每个子应用都有自己独立的 **webpack_require**；

异步 chunk 的加载逻辑独立，不会加载到其他子应用的模块；

提高缓存命中率（业务代码更新时 runtime 不变）；

对 qiankun 而言——保证微应用间的模块加载互不干扰。

**为什么 qiankun 特别需要这个？**

qiankun 的设计理念是：

子应用必须完全独立、可单独运行、不会污染主应用或其他子应用。

但 qiankun 的加载方式是「动态插入 `<script>` 标签」，
即多个微应用的 JS 实际上都在主页面上执行。

⚠️ 所以，如果你不抽离 runtime：

子应用 A 和 B 的 **webpack_require** 都挂在全局；

后加载的那个会覆盖前面的；

异步 chunk（动态 import）会从错误的 runtime 中查找模块；

导致非常隐蔽的报错（比如点击子应用按钮后某组件加载失败）。

```javascript
 {
  "splitChunks": {
    chunks: "async", // 懒加载 chunk 分开打包
    minSize: 0, // 强制生成 chunk
  },
}
```

这份配置主要是强制懒加载分开打包，这样减少主文件的大小，提升加载速度，但这里有一个问题，qiankun 如何知道其他懒加载文件的路径，我们在注册 qiankun 应用时
`scripts: item.entry.scripts,`采用的是单文件加载，也就是只能知道`manifest.js`和`index.js`的路径。这个时候就需要增加一项配置

```javascript
import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import pkg from "./package.json" assert { type: "json" };

const packageName = pkg.name;

export default defineConfig({
  source: {
    define: {
      __SOURCE_PREFIX__: JSON.stringify(pkg.name),
    },
  },
  output: {
    filenameHash: false,
    filename: "[name].js",
    assetPrefix: `https://cysx-yikai.oss-cn-beijing.aliyuncs.com/static/${pkg.name}/${pkg.version}/`,
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
```

assetPrefix 能够告诉加载时应该访问哪个路径，这个时候 qiankun 就会访问到正常的懒加载路径。

> 这里有一个可能之前，我在上传静态资源文件的时候将/dist/static 下的文件上传上去，但是 assetPrefix 默认就是会访问`https://cysx-yikai.oss-cn-beijing.aliyuncs.com/static/micro-test/1.1.1/static/css/async/index.css`下的路径，但是我文件上传之后并没有 static 这个目录，也就是说如果是异步加载问价就会无脑拿`/static/css/async/index.css`路径

## 子应用工程问题

### docker 打包

子应用采用 docker 环境进行打包

```dockerfile
# -------------------------------
# Stage 1: 构建阶段
# -------------------------------
# 提前docker pull node:18-alpine以及docker pull alpine:3.19可以大幅加快构建速度，这样就不需要每次都从远程拉取基础镜像了。
FROM node:18-alpine AS builder

WORKDIR /app

# 拷贝 package 文件（缓存安装依赖层）
COPY package.json pnpm-lock.yaml ./


# 设置淘宝镜像源（推荐）
RUN npm config set registry https://registry.npmmirror.com \
    && npm install -g pnpm \
    && pnpm config set registry https://registry.npmmirror.com && pnpm install

# 拷贝源代码
COPY . .

RUN pnpm install

# 打包（Rsbuild）
RUN pnpm run build

# -------------------------------
# Stage 2: 输出产物
# -------------------------------
FROM alpine:3.19 AS output

WORKDIR /output

# 只复制 dist 文件
COPY --from=builder /app/dist ./dist

CMD ["echo", "✅ Rsbuild 打包完成，产物已在 /output/dist"]
```

采用 node18 镜像，设置工作目录/app 打包完成之后从 docker 容器中将目录复制到当前服务器目录下
这一步没啥说的。其中注意的是有时候pnpm 版本不一样会导致的安装依赖报错，pnpm-lock文件无法正常进行安装

### 打包后文件上传

```sh
#!/bin/bash

# ===============================
# Rsbuild 前端打包 + 上传脚本
# ===============================
set -e

IMAGE_NAME="rsbuild-frontend-build"
CONTAINER_NAME="rsbuild-output"
PACKAGE_NAME=$(node -p "require('./package.json').name")
PACKAGE_VERSION=$(node -p "require('./package.json').version")
OSS_BUCKET="oss://cysx-yikai/static/$PACKAGE_NAME/$PACKAGE_VERSION/static"
LOCAL_DIR="./dist"

echo "🔍 检查 OSS 是否已存在相同版本..."
if ossutilmac64 stat $OSS_BUCKET/js/index.js >/dev/null 2>&1; then
  echo "❌ 版本 $PACKAGE_VERSION 已存在，请修改 package.json 中的 version！"
  exit 1
fi


# Step 1: 构建 Docker 镜像
echo "🚧 构建 Docker 镜像..."
docker build -t $IMAGE_NAME .

# Step 2: 创建临时容器
echo "📦 导出打包产物..."
# 删除旧的 dist 避免嵌套
if [ -d "./dist" ]; then
  echo "🧹 清理旧的 dist 目录..."
  rm -rf ./dist
fi
docker create --name $CONTAINER_NAME $IMAGE_NAME
docker cp $CONTAINER_NAME:/output/dist ./dist
docker rm $CONTAINER_NAME


# Step 3: 从 package.json 中读取 name 和 version


echo "📦 当前包名: $PACKAGE_NAME"
echo "🏷️ 版本号: $PACKAGE_VERSION"


# Step 4: 上传到 OSS
# ---- 阿里云 ossutil64 必须已配置好账号信息 ----
# ossutil64 config 可提前配置 AccessKeyId / Secret / Endpoint
echo "☁️ 上传 $LOCAL_DIR 到 OSS ($OSS_BUCKET)..."
ossutilmac64 cp -r $LOCAL_DIR $OSS_BUCKET --update

echo "✅ 上传完成"
```

通过`deploy.sh`去触发打包，在打包过程前先检查这次的 version 是否已经上线过，如果上线过需要修改 version 再上线。
`docker build -t $IMAGE_NAME .` 通过当前路径下的 Dockerfile 配置文件构建对应的镜像，在构建镜像过程中执行掉打包，也就是这个镜像构建完后

构建完之后复制出./dist 文件然后通过 ossutilmac64 进行文件上传，这个 ossutilmac64 需要在服务器上进行安装，因为没有服务器我是在本机上安装的

```sh
curl -O https://gosspublic.alicdn.com/ossutil/1.7.5/ossutilmac64
chmod +x ossutilmac64
sudo mv ossutilmac64 /usr/local/bin/ossutil64
```

上传之后就有对应的静态文件了，部署过程就是改下版本就好了。

## 脚手架
项目中有一个比较简单的脚手架，主要是对整个项目目录进行抽离，支持快速创建子应用模板

## 架构层面
qiankun从仓库维度组建整个应用架构变成了从页面维度组建整个应用结构，这个灵活度大大提升了，仓库代码是一个一个组织协同维护的，但是在页面层面借助qiankun能力可以自由组织起一个个的页面。再通过一些超级入口，比如把公司所有的b端项目全部放在一个超级入口，之前所有部署在各个域下的项目全都迁移在qiankun架构下，就可以自由组织应用。系统 => 应用 => 页面
