@echo off
title DAA Backend Server
cls
echo ====================================================================
echo  Starting FastAPI Backend Server
echo ====================================================================
echo.
cd /d "%~dp0backend"
echo Running Uvicorn on http://localhost:8000 ...
echo API Swagger Docs available at http://localhost:8000/docs
echo.
uvicorn main:app --reload --port 8000
pause
