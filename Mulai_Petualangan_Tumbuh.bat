@echo off
cd /d "%~dp0"
echo ===================================================
echo Memulai Server Petualangan TUMBUH (Port 8765)...
echo Real-Time Sync dan Pemutar Video YouTube Aktif!
echo Akses Aplikasi: http://127.0.0.1:8765
echo ===================================================
python server.py --open || start "" "http://127.0.0.1:8765" || start "" "index.html"
pause
