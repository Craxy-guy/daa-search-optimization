@echo off
title Install DAA Project Dependencies
cls
echo ====================================================================
echo  Installing Dependencies for DAA AI Search Optimization Project
echo ====================================================================
echo.

echo [1/2] Installing Backend Python Requirements...
cd /d "%~dp0backend"
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo [WARNING] Python package installation had errors. Check your Python/pip installation.
) else (
    echo [SUCCESS] Backend dependencies installed successfully.
)

echo.
echo [2/2] Installing Frontend npm packages...
cd /d "%~dp0frontend"
call npm install
if %errorlevel% neq 0 (
    echo [WARNING] npm package installation had errors. Check your Node/npm installation.
) else (
    echo [SUCCESS] Frontend dependencies installed successfully.
)

echo.
echo ====================================================================
echo  Installation completed!
echo  Run start_app.bat to launch the application.
echo ====================================================================
echo.
pause
