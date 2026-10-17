@echo off
title DAA Frontend Server
cls
echo ====================================================================
echo  Starting Vite + React Frontend Server
echo ====================================================================
echo.
cd /d "%~dp0frontend"
echo Running Vite dev server on http://localhost:5173 ...
echo.
npm run dev
pause
