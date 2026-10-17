@echo off
title DAA Project Launcher
cls
echo ====================================================================
echo  AI Search Optimization Project - Full Stack Launcher
echo  DAA College Project: Binary Search, Divide & Conquer & Complexity
echo ====================================================================
echo.

echo [1/2] Starting FastAPI Backend Server on port 8000...
start "DAA Backend Server (FastAPI)" cmd /k "cd /d "%~dp0backend" && uvicorn main:app --reload --port 8000"

echo [2/2] Starting Vite React Frontend Server on port 5173...
start "DAA Frontend Server (Vite)" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo Waiting 3 seconds for servers to start...
timeout /t 3 /nobreak >nul

echo.
echo Opening Application in your default browser...
start http://localhost:5173

echo.
echo ====================================================================
echo  SUCCESS: Application is running!
echo  - Frontend: http://localhost:5173
echo  - Backend API: http://localhost:8000
echo  - API Docs (Swagger): http://localhost:8000/docs
echo.
echo  Keep the server windows open while testing the project.
echo ====================================================================
echo.
pause
