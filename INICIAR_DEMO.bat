@echo off
setlocal
cd /d "%~dp0"
echo.
echo  Innovativa Inspecoes SST - Portfolio Demo
echo  Iniciando em http://localhost:8080
echo.
start "" cmd /c "timeout /t 2 /nobreak >nul & start http://localhost:8080"
python -m http.server 8080
endlocal
