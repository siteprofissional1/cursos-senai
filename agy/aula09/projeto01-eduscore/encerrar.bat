@echo off
chcp 65001 > nul
title EduScore - Finalizador de Serviços

echo =====================================================================
echo           🛑 Encerrando Serviços do EduScore
echo =====================================================================
echo.

echo [1/2] Finalizando processos na porta 8000 (Backend FastAPI)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000 ^| findstr LISTENING') do (
    echo Finalizando PID %%a...
    taskkill /F /PID %%a >nul 2>&1
)

echo [2/2] Finalizando processos na porta 5173 (Frontend Vite)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173 ^| findstr LISTENING') do (
    echo Finalizando PID %%a...
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo =====================================================================
echo    Todos os serviços do EduScore foram finalizados com sucesso!
echo =====================================================================
pause
