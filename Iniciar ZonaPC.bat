@echo off
title ZonaPC - Servidor
echo ================================
echo   ZonaPC - Servidor iniciando...
echo ================================
echo.

node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js no esta instalado o no esta en el PATH.
    echo Descargalo desde https://nodejs.org
    pause
    exit
)

echo Verificando si el puerto 3000 esta en uso...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000 " ^| find "LISTENING"') do (
    echo Puerto 3000 ocupado. Terminando proceso anterior ^(PID: %%a^)...
    taskkill /PID %%a /F >nul 2>&1
)
echo.

echo Para DETENER el servidor presiona Ctrl+C
echo.
start "" http://localhost:3000
node backend\server.js
pause
