#!/bin/bash
# 书中练习室 - 局域网服务一键启动器
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

echo "=========================================="
echo "  书中练习室 · 启动局域网多设备共享服务"
echo "=========================================="
node chapter-one/scripts/serve.mjs &
SERVER_PID=$!

sleep 1

# 尝试用默认浏览器打开首页
if command -v open > /dev/null; then
  open "http://localhost:4173"
fi

wait $SERVER_PID
