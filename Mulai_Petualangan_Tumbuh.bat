@echo off
cd /d "%~dp0"
echo Memulai Server Sinkronisasi Lintas-Email Petualangan TUMBUH...
python server.py --open || start "" "index.html"
pause
