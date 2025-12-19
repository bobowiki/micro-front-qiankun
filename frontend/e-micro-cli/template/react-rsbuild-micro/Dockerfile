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
    && pnpm config set registry https://registry.npmmirror.com

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
