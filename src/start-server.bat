@echo off
cd /d "%~dp0"
echo Starting web server on http://localhost:8001
echo.
echo Press Ctrl+C to stop the server
echo.
python -m http.server 8001
pause

