@echo off
chcp 65001 >nul
title 书中练习室 · 本地启动器

echo ==========================================
echo           书中练习室 · 我的书架
echo ==========================================
echo 正在检查本地运行环境...

set "PORT=4173"
set "URL=http://127.0.0.1:%PORT%"

:: 切换到脚本所在目录
cd /d "%~dp0"

:: 检查 Node.js 是否安装
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo 未检测到 Node.js 环境，正在直接用默认浏览器打开本地页面...
    start "" "index.html"
    goto :end
)

:: 检查 4173 端口是否已有服务
netstat -ano | findstr /r /c:":%PORT% *LISTENING" >nul 2>nul
if %errorlevel% equ 0 (
    echo 本地服务已在运行中，正在调起默认浏览器...
    start "" "%URL%"
    goto :end
)

echo 正在启动本地学习服务 (端口 %PORT%)...
start "书中练习室本地服务" /min cmd /c "node chapter-one\scripts\serve.mjs"

:: 等待服务启动
timeout /t 1 /nobreak >nul
start "" "%URL%"

echo.
echo 已在默认浏览器中打开：%URL%
echo 本地服务正在后台运行，关闭此窗口不会中断浏览。
echo ==========================================

:end
timeout /t 3 >nul
