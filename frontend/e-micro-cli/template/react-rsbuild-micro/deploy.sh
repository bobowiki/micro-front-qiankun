#!/bin/bash

# ===============================
# Rsbuild 前端打包 + 上传脚本
# ===============================
set -e

IMAGE_NAME="rsbuild-frontend-build"
CONTAINER_NAME="rsbuild-output"
PACKAGE_NAME=$(node -p "require('./package.json').name")
PACKAGE_VERSION=$(node -p "require('./package.json').version")
OSS_BUCKET="oss://cysx-yikai/static/$PACKAGE_NAME/$PACKAGE_VERSION"
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