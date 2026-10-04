@echo off
rem Double-click this instead of index.html.
rem
rem Progress is stored by the browser against the exact address the page was
rem opened from. Opening index.html directly gives it a file:// address, which
rem is a different store from http://localhost:8000 and will look empty. This
rem always uses the same address, so the progress is always the same progress.

cd /d "%~dp0"

rem Start the server only if nothing is already listening on 8000.
netstat -ano | findstr /r /c:"TCP.*:8000 .*LISTENING" >nul 2>&1
if errorlevel 1 (
  start "self-study server" /min cmd /c "python -m http.server 8000 --bind 127.0.0.1"
  rem give it a moment to bind before the browser asks for the page
  ping -n 2 127.0.0.1 >nul
)

rem AI Engineering from Scratch, served from a local clone (its lessons load from raw.githubusercontent.com,
rem which this network blocks). Pages open lesson links here when it is running. Pull the latest first.
set "AIENG=%~dp0..\..\ai-engineering-from-scratch"
if exist "%AIENG%\site\lesson.html" (
  netstat -ano | findstr /r /c:"TCP.*:8010 .*LISTENING" >nul 2>&1
  if errorlevel 1 (
    start "course update" /min cmd /c "git -C "%AIENG%" pull --ff-only --quiet"
    start "course server" /min cmd /c "python -m http.server 8010 --bind 127.0.0.1 --directory "%AIENG%""
  )
)

start "" "http://localhost:8000/index.html"
