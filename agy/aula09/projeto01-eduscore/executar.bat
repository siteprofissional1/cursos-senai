@echo off
chcp 65001 > nul
title EduScore - Inicializador Turnkey (Padrão SENAI)

echo =====================================================================
echo           🎓 EduScore - Plataforma Analítica ENEM 2025
echo       Desenvolvido com Google Antigravity AI - Padrão SENAI
echo =====================================================================
echo.
echo [1/3] Verificando dependências e ambiente...

where python >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERRO] Python não foi encontrado no PATH. Por favor instale o Python 3.10+.
    pause
    exit /b 1
)

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERRO] Node/npm não foi encontrado no PATH. Por favor instale o Node.js 18+.
    pause
    exit /b 1
)

echo [2/3] Iniciando Backend FastAPI (Porta 8000)...
start "EduScore Backend (FastAPI)" cmd /k "python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload"

echo [3/3] Iniciando Frontend React Vite (Porta 5173)...
start "EduScore Frontend (Vite)" cmd /k "cd frontend && npm run dev"

echo.
echo Aguardando inicialização dos serviços (3 segundos)...
timeout /t 3 /nobreak > nul

echo Abrindo navegador em http://localhost:5173 ...
start http://localhost:5173

echo.
echo =====================================================================
echo    Serviços em execução com sucesso!
echo    - Frontend: http://localhost:5173
echo    - Backend API: http://localhost:8000
echo    - Docs Swagger: http://localhost:8000/docs
echo    Para encerrar tudo de forma limpa, execute 'encerrar.bat'.
echo =====================================================================
