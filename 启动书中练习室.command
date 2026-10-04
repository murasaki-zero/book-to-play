#!/bin/bash
# 书中练习室 · 本地启动器
# 双击即可启动本地服务并在浏览器中打开书架

cd "$(dirname "$0")"

PORT=4173
URL="http://127.0.0.1:${PORT}"

echo "=========================================="
echo "          书中练习室 · 我的书架"
echo "=========================================="
echo "正在检查本地运行环境..."

# 检查 node 是否可用
if ! command -v node >/dev/null 2>&1; then
  echo "未检测到 Node.js，正在尝试直接用浏览器打开本地页面..."
  open "index.html"
  exit 0
fi

# 检查端口是否已被占用
if lsof -Pi :${PORT} -sTCP:LISTEN -t >/dev/null 2>&1; then
  echo "服务已在后台运行中，正在打开浏览器..."
  open "${URL}"
else
  echo "正在启动本地静态学习服务 (端口 ${PORT})..."
  # 启动后台服务
  node chapter-one/scripts/serve.mjs &
  SERVER_PID=$!
  sleep 0.8
  open "${URL}"
  echo ""
  echo "已在默认浏览器中打开：${URL}"
  echo "如需停止服务，可按 Ctrl+C 关闭此窗口。"
  echo "=========================================="
  wait $SERVER_PID
fi
